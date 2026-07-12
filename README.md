<hr>

<h1 align="center">
  Philani
</h1>
<h2 align="center">
  Philani Mhlongo - personal website
</h2>
<p align="center">
  My new personal website <a href="https://philanimhlongo.github.io/" target="_blank">philanimhlongo</a> built using React, TypeScript, and Tailwind CSS from scratch.
</p>


## 🛠 Development Setup

1. Install dependencies

   ```sh
   npm install
   ```

2. Start the development server

   ```sh
   npm run dev
```


## 📬 Newsletter setup

Visitors can subscribe from the terminal with `subscribe <email>`. Because the
site is static, subscriptions need an external form endpoint, configured in
[`src/config/newsletter.ts`](src/config/newsletter.ts):

1. **Buttondown** (recommended): create a free account at
   [buttondown.com](https://buttondown.com), then set

   ```ts
   export const NEWSLETTER_ENDPOINT =
     "https://buttondown.com/api/emails/embed-subscribe/<your-username>"
   ```

   Subscribers get a confirmation email (double opt-in), and you send
   newsletters from the Buttondown dashboard when you publish new content.

2. **Formspree** (simplest): create a form at
   [formspree.io](https://formspree.io) and set the endpoint to
   `https://formspree.io/f/<your-form-id>`. Each subscription lands in your
   inbox/dashboard, and you manage the mailing list yourself.

Until an endpoint is configured, the `subscribe` command falls back to opening
the visitor's mail client with a pre-filled subscription request.
