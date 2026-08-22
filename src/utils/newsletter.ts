import { NEWSLETTER_ENDPOINT, NEWSLETTER_FALLBACK_EMAIL } from "../config/newsletter"

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Subscribe an email address to the newsletter.
 * Returns the lines to print in the terminal.
 */
export async function subscribeToNewsletter(email: string): Promise<string[]> {
  if (!NEWSLETTER_ENDPOINT) {
    // No form endpoint configured yet — fall back to a pre-filled email.
    const subject = encodeURIComponent("Newsletter subscription")
    const body = encodeURIComponent(
      `Hi Philani,\n\nPlease add ${email} to your newsletter so I get notified when you publish new content.\n`
    )
    window.location.href = `mailto:${NEWSLETTER_FALLBACK_EMAIL}?subject=${subject}&body=${body}`
    return [
      `Opening your mail client to subscribe ${email}…`,
      "",
      "Hit send and I'll add you to the list — you'll get an email",
      "whenever new content is published.",
    ]
  }

  try {
    // no-cors: form endpoints like Buttondown/Formspree accept the POST but
    // don't always send CORS headers, so the response is opaque.
    await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email }).toString(),
    })
    return [
      `${email} is on the list.`,
      "",
      "Check your inbox for a confirmation email — you'll be notified",
      "whenever new content is published.",
    ]
  } catch {
    return [
      "Something went wrong while subscribing.",
      `Please try again later, or email ${NEWSLETTER_FALLBACK_EMAIL} directly.`,
    ]
  }
}
