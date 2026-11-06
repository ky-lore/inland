/*
 * Lead form configuration — Inland Renovation & Construction
 * ------------------------------------------------------------------
 * This is the ONLY file that needs editing to connect the estimate
 * forms to GoHighLevel (GHL). Until `endpoint` is set, every form
 * shows an honest "online requests unavailable" message and points
 * visitors to the phone / email links already on the page.
 * No lead is sent anywhere and no success message is ever faked.
 *
 * To finish the integration (see FORMS-INTEGRATION.md):
 *   1. Get the GHL inbound-webhook URL (Automation → Workflows →
 *      trigger "Inbound Webhook") from the account owner.
 *   2. Paste it into `endpoint` below.
 *   3. Map the field names listed in FORMS-INTEGRATION.md to GHL
 *      contact fields inside the workflow.
 *   4. Submit one clearly-labelled TEST lead and confirm it arrives,
 *      then delete it from the CRM.
 */
window.IRC_LEAD_CONFIG = {
  // GHL inbound webhook URL. Leave null until provided — do not guess.
  endpoint: null,

  // "json" (application/json body) or "form" (urlencoded body).
  // GHL inbound webhooks accept JSON.
  encoding: "json",

  // Request timeout in milliseconds.
  timeoutMs: 15000
};
