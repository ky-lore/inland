# Lead forms — GHL integration guide

Status: **not connected.** No lead from the website currently reaches any CRM.
Until the steps below are done, every form shows:

> **Online requests aren't available yet.** Your details have not been sent. Please call … or email us instead.

The phone/email in that message are read from the links already on the page, so they will follow automatically when those numbers are updated.

## Forms

| Form ID (`data-lead-form`) | Page | Fields |
|---|---|---|
| `home-hero-estimate` | index.html (hero, `#consult`) | first_name, last_name, phone, email, project_type |
| `home-footer-estimate` | index.html (final CTA, `#contact`) | first_name, last_name, phone, email, city, project_type, message |
| `contact-page-estimate` | contact.html (`#contact-form`) | first_name, last_name, phone, email, city, project_type, message |

## Files

- `form-config.js` holds the settings. **This is the only file to edit.**
- `forms.js` is the shared handler for every `<form data-lead-form>`. Don't edit it for setup.

Both are loaded after `app.js` on index.html and contact.html.

## Payload sent (POST, JSON by default)

| Key | Required | Notes |
|---|---|---|
| `first_name` | yes | max 50 |
| `last_name` | yes | max 50 |
| `phone` | yes | free-format, validated to 10 digits (or 11 starting with 1) |
| `email` | yes | browser email validation, max 254 |
| `project_type` | yes | Kitchen remodel · Bathroom remodel · ADU / addition · Full home remodel · Multiple rooms · Not sure yet |
| `city` | no | footer + contact forms only |
| `message` | no | footer + contact forms only, max 2000 |
| `form_id` | auto | which form was used (table above) |
| `page_url`, `page_title` | auto | where it was submitted |
| `submitted_at` | auto | ISO timestamp |
| `utm_source` … `utm_content`, `gclid`, `fbclid` | auto, if present in URL | for ad attribution |

A hidden honeypot field (`company_website`) catches bots. It is never sent, and a filled honeypot never shows success.

## What's needed to finish

1. **From the GHL account owner:** an Inbound Webhook URL (Automation → Workflows → new workflow → trigger *Inbound Webhook*). Alternatively, if a GHL form embed is preferred, send the embed code and the native forms will be swapped for it.
2. Paste the URL into `form-config.js` → `endpoint`.
3. In the GHL workflow, map the keys above to contact fields (first name, last name, phone, email, custom fields for project type/city/message, source = `form_id`), and add the notification / pipeline steps.
4. Check CORS: the browser posts directly to the webhook. GHL inbound webhooks accept cross-origin JSON posts. If a different endpoint is used and it rejects preflight requests, set `encoding: "form"` (urlencoded, no preflight).
5. Submit **one** clearly-labelled test lead (e.g. name "TEST – delete"), confirm it arrives, then delete it from the CRM.

## Behaviour (already implemented and tested)

- Native HTML validation runs before anything is sent.
- The submit button disables and reads "Sending…" while a request is in flight, and extra clicks are ignored (tested: 3 submit attempts produced 1 request).
- Success is shown **only** for a 2xx response, and the form is then cleared.
- On a non-2xx response, network error or 15 s timeout: an error message with the phone/email fallback. The entered data is kept and the button re-enables.
- Status messages use `role="status"` / `aria-live="polite"` for screen readers.
