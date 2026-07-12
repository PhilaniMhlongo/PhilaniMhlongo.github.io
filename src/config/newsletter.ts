/**
 * Newsletter configuration
 *
 * The site is static (GitHub Pages), so subscriptions are handled by an
 * external form endpoint. Set NEWSLETTER_ENDPOINT to a URL that accepts a
 * form-encoded POST with an `email` field. Two free options:
 *
 * 1. Buttondown (recommended — a real newsletter service with double opt-in):
 *    - Create an account at https://buttondown.com
 *    - Set the endpoint to:
 *      "https://buttondown.com/api/emails/embed-subscribe/<your-username>"
 *
 * 2. Formspree (collects emails into your inbox/dashboard):
 *    - Create a form at https://formspree.io
 *    - Set the endpoint to: "https://formspree.io/f/<your-form-id>"
 *
 * While NEWSLETTER_ENDPOINT is empty, the `subscribe` terminal command falls
 * back to opening the visitor's mail client with a pre-filled subscription
 * request addressed to NEWSLETTER_FALLBACK_EMAIL.
 */
export const NEWSLETTER_ENDPOINT = ""

export const NEWSLETTER_FALLBACK_EMAIL = "mhlongophilani04@gmail.com"
