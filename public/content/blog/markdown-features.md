# Complete Markdown Features Demo

This document demonstrates all the rich text features available on this site.

---

## Basic Formatting

**Bold text**, *italic text*, ~~strikethrough~~, and `inline code`.

You can combine them: ***bold and italic***, **bold with `code`**.

---

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

---

## Lists

### Unordered Lists
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists
1. First item
2. Second item
   1. Nested 2.1
   2. Nested 2.2
3. Third item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task to do

---

## Links and Images

[Visit my GitHub](https://github.com/philanimhlongo) - external links open in new tabs

![Example Image](/content/images/example.png)

---

## Code Blocks

Inline code: `const x = 42`

```javascript
// JavaScript with syntax highlighting
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("DevOps Engineer");
```

```python
# Python example
def deploy_infrastructure(config):
    """Deploy infrastructure using Terraform"""
    return terraform.apply(config)
```

---

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ | Fully supported |
| LaTeX Math | ✅ | KaTeX rendering |
| Emoji | ✅ | :rocket: :heart: |
| Footnotes | ✅ | See below[^1] |

---

## Math Equations (LaTeX)

Inline math: The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$

Block math:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

Kubernetes resource calculation:

$$
\text{Total CPU} = \sum_{i=1}^{n} (\text{requests}_i + \text{limits}_i)
$$

---

## Custom Containers (Callouts)

> [!NOTE]
> This is a note callout. Use it for additional information or context.

> [!TIP]
> This is a tip callout. Share helpful advice or best practices here.

> [!IMPORTANT]
> This is an important callout. Highlight critical information.

> [!WARNING]
> This is a warning callout. Alert users about potential issues or risks.

---

## Emoji Shortcuts

You can use emoji shortcodes :smile: :rocket: :heart: :fire: :computer: :cloud:

DevOps emojis: :whale: :gear: :construction: :wrench: :package:

---

## Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

> Regular blockquote without special formatting.

---

## Horizontal Rules

Use `---` to create dividers:

---

## Footnotes

Here's a sentence with a footnote.[^1] And another one.[^2]

You can also use inline footnotes^[This is an inline footnote].

---

## All Together

Let's combine multiple features:

> [!TIP]
> When calculating Kubernetes resource limits, use this formula:
> 
> $$
> \text{Memory}_{\text{pod}} = \text{Base} + \sum \text{Container}_i
> $$
> 
> Check the [Kubernetes docs](https://kubernetes.io/docs/) :whale: for more details.[^3]

**Result:** :rocket: Your pods are optimized!

---

[^1]: Footnotes appear at the bottom of the content.
[^2]: They're great for citations and additional context.
[^3]: This footnote includes a link: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
