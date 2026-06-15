# Deployment Guide — Sri Velmayil Jewellery

## Live URLs

| URL | Purpose |
|-----|---------|
| https://sri-velmayil-jewellery.vercel.app | Vercel deployment (working) |
| https://srivelmayiljewellery.com | Custom domain (connect in Vercel) |
| https://github.com/btwprathish-cmd/sri-velmayil-jewellery | Source code |

---

## Step 1: Vercel environment variables

Open [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Environment Variables**.

Add these for **Production** (and Preview if you want):

| Variable | Required | Example / Notes |
|----------|----------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://srivelmayiljewellery.com` |
| `ADMIN_USERNAME` | Yes | `velmayil_admin` |
| `ADMIN_PASSWORD` | Yes | Min 16 characters — use a strong unique password |
| `ADMIN_SESSION_SECRET` | Yes | Min 32 random characters |
| `CLOUDINARY_CLOUD_NAME` | Yes (uploads) | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes (uploads) | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes (uploads) | From Cloudinary dashboard |
| `METALPRICE_API_KEY` | Optional | Falls back to gold-api.com if empty |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics ID |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | Google Search Console verification code |

After saving variables, go to **Deployments** → latest deployment → **Redeploy**.

---

## Step 2: Connect custom domain

1. Vercel → Project → **Settings** → **Domains**
2. Add `srivelmayiljewellery.com` and `www.srivelmayiljewellery.com`
3. Vercel shows DNS records — add them at your domain registrar:

**Typical setup:**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Wait 5–60 minutes for DNS propagation
5. Vercel auto-provisions **SSL (HTTPS)**

Update `NEXT_PUBLIC_SITE_URL` to `https://srivelmayiljewellery.com` and redeploy.

---

## Step 3: Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://srivelmayiljewellery.com`
3. Copy verification code → set `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel → redeploy
4. Submit sitemap: `https://srivelmayiljewellery.com/sitemap.xml`

---

## Step 4: Verify deployment

```bash
# Rates API
curl https://sri-velmayil-jewellery.vercel.app/api/rates

# Robots & sitemap
curl https://sri-velmayil-jewellery.vercel.app/robots.txt
curl https://sri-velmayil-jewellery.vercel.app/sitemap.xml

# Admin security (should be 401)
curl -o /dev/null -w "%{http_code}" https://sri-velmayil-jewellery.vercel.app/api/admin/collections
```

Or run locally against live URL:

```bash
npm run verify:closure https://sri-velmayil-jewellery.vercel.app
```

---

## Notes for Vercel serverless

- **Live rates** fetch from external APIs every 30 minutes (no manual updates needed)
- **Rate history file** is read from bundled `data/rate-history.json`; new history rows may not persist on serverless (rates still update live)
- **Admin collection edits** that write to `data/collections.json` do not persist on Vercel — use Cloudinary for images; for persistent catalogue changes, edit `data/collections.json` in Git and redeploy
- **Admin login** returns 503 until `ADMIN_*` env vars are set
