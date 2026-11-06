/*
 * Reusable lead-form handler.
 * Any <form data-lead-form="..."> on the page is wired up automatically.
 *
 * Behaviour
 *  - Native HTML validation runs first (required / type / pattern / maxlength).
 *  - One submission at a time: the button is disabled while a request is in flight.
 *  - Loading, success and error states are shown in the form's [data-form-status] element.
 *  - Success is shown ONLY when the configured endpoint returns a 2xx response.
 *  - With no endpoint configured (window.IRC_LEAD_CONFIG.endpoint is null) the
 *    form shows an "unavailable" message instead of pretending to send.
 */
(function () {
  "use strict";

  var cfg = window.IRC_LEAD_CONFIG || {};
  var forms = document.querySelectorAll("form[data-lead-form]");
  if (!forms.length) return;

  // Contact links already on the page (no numbers/emails are hard-coded here).
  function contactFallbackHTML() {
    var tel = document.querySelector('a[href^="tel:"]');
    var mail = document.querySelector('a[href^="mailto:"]');
    var parts = [];
    if (tel) parts.push('call <a href="' + tel.getAttribute("href") + '">' + tel.textContent.trim() + "</a>");
    if (mail) parts.push('<a href="' + mail.getAttribute("href") + '">email us</a>');
    return parts.length ? " Please " + parts.join(" or ") + " instead." : " Please contact us by phone or email instead.";
  }

  function setStatus(form, state, html) {
    var el = form.querySelector("[data-form-status]");
    if (!el) return;
    el.className = "form-status is-" + state;
    el.innerHTML = html;
    el.hidden = false;
  }

  function setBusy(form, busy) {
    var btn = form.querySelector('[type="submit"]');
    form.setAttribute("aria-busy", busy ? "true" : "false");
    if (!btn) return;
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.disabled = busy;
    btn.textContent = busy ? "Sending…" : btn.dataset.label;
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "company_website") return; // honeypot, never sent
      data[k] = typeof v === "string" ? v.trim() : v;
    });
    data.form_id = form.getAttribute("data-lead-form");
    data.page_url = location.href;
    data.page_title = document.title;
    data.submitted_at = new Date().toISOString();
    // pass through campaign parameters if present
    var qs = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(function (p) {
      if (qs.get(p)) data[p] = qs.get(p);
    });
    return data;
  }

  function send(data) {
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, cfg.timeoutMs || 15000);
    var isJson = cfg.encoding !== "form";
    return fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": isJson ? "application/json" : "application/x-www-form-urlencoded" },
      body: isJson ? JSON.stringify(data) : new URLSearchParams(data).toString(),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res;
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  Array.prototype.forEach.call(forms, function (form) {
    var inFlight = false;

    // Phone: require 10 digits (optionally a leading 1), any formatting.
    var phone = form.querySelector('input[type="tel"]');
    if (phone) {
      phone.addEventListener("input", function () {
        var d = phone.value.replace(/\D/g, "");
        var ok = d.length === 10 || (d.length === 11 && d.charAt(0) === "1");
        phone.setCustomValidity(phone.value && !ok ? "Please enter a 10-digit phone number." : "");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (inFlight) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      // Honeypot filled → silently drop (bots), but never show success.
      var hp = form.querySelector('[name="company_website"]');
      if (hp && hp.value) return;

      if (!cfg.endpoint) {
        setStatus(form, "error",
          "<strong>Online requests aren't available yet.</strong> Your details have not been sent." + contactFallbackHTML());
        return;
      }

      inFlight = true;
      setBusy(form, true);
      setStatus(form, "loading", "Sending your request…");

      send(collect(form)).then(function () {
        form.reset();
        setStatus(form, "success",
          "<strong>Thanks — your request was received.</strong> We'll be in touch to schedule your consultation.");
      }).catch(function () {
        setStatus(form, "error",
          "<strong>Sorry, we couldn't send your request.</strong> Your details have not been sent." + contactFallbackHTML());
      }).then(function () {
        inFlight = false;
        setBusy(form, false);
      });
    });
  });
})();
