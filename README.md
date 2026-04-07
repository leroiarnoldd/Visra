# Visra — Visa Intelligence Platform
### Cloudflare Pages Deployment

---

## File Structure

```
visra/
├── index.html                  ← Full Visra frontend
├── _headers                    ← Security headers
├── .gitignore                  ← Never commit secrets
├── README.md
└── functions/
    └── api/
        └── visra-api.js        ← Secure API proxy (keeps your key safe)
```

---

## Deployment Steps

### 1. GitHub
- Create a new repo called `visra` at github.com
- Upload all files maintaining the folder structure above
- For `functions/api/visra-api.js` — use GitHub's "Create new file" 
  and type the full path including slashes to create the folders

### 2. Cloudflare Pages
- dash.cloudflare.com → Workers & Pages → Create → Pages
- Connect to Git → select your visra repo
- Framework: None | Build command: blank | Output: blank
- Deploy

### 3. Add API Key (do before testing)
- Cloudflare → your project → Settings → Environment variables
- Add: ANTHROPIC_API_KEY = your key from console.anthropic.com
- Add for both Production and Preview
- Save → Retry deployment

### 4. Get your Anthropic API key
- console.anthropic.com → API Keys → Create Key
- Copy it — you only see it once

---

## How it works
User → /api/visra-api (Cloudflare Function) → Anthropic API
Your key never touches the browser or GitHub.
