# CORDA — Studio Website

Static HTML/CSS/JS site. No build step. Deploy anywhere.

## Setup

### 1. Form (required)

The contact form uses [Formspree](https://formspree.io).

1. Create a free account at formspree.io
2. Create a new form — you will get an endpoint like `https://formspree.io/f/YOUR_ID`
3. Open `js/main.js` and replace the placeholder:

```js
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Submissions arrive directly in your email inbox.

### 2. Email address

Open `index.html` and search for `hello@corda.studio`. Replace with your real address.

### 3. Deploy

**Netlify (recommended)**
- Drag the folder into netlify.com/drop
- Or connect your GitHub repo for auto-deploy on push

**Vercel**
```bash
npx vercel
```

**GitHub Pages**
- Push to GitHub
- Settings → Pages → Deploy from branch → main → / (root)

## Structure

```
corda/
├── index.html       # All markup
├── css/
│   └── style.css    # All styles
├── js/
│   └── main.js      # Counters, bars, reveal, form
└── README.md
```

## Dependencies (CDN, no install needed)

- [Chart.js 4.4.1](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js)
- [Google Fonts — Bricolage Grotesque, Outfit, DM Mono](https://fonts.google.com)
