# Backup & Recovery — Sri Velmayil Jewellery

## What to back up

This site is a **Next.js application** with file-based data (no traditional database). Back up these items:

| Asset | Location | Frequency |
|-------|----------|-----------|
| Collection catalogue | `data/collections.json` | After every admin edit |
| Gold rate history | `data/rate-history.json` | Daily (auto-updated by live API) |
| Admin upload images (dev) | `public/uploads/` | After each upload |
| Cloudinary images (production) | Cloudinary dashboard | Weekly export / enabled backups |
| Environment secrets | Hosting provider (Vercel/VPS) | On change |
| Source code | Git repository | Every release |

## Cloudinary (production uploads)

1. Log in to [Cloudinary Console](https://console.cloudinary.com).
2. Enable **Backup** on the `sri-velmayil-jewellery` folder (paid feature) or periodically export asset lists via API.
3. Store `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in your password manager and hosting env.

## Rate history

- Live rates are fetched automatically from MetalpriceAPI or `gold-api.com`.
- Historical records are stored in `data/rate-history.json` (last 90 days).
- **Backup:** Copy `data/rate-history.json` daily via cron or hosting snapshot.

```bash
# Example daily backup (Linux cron)
cp data/rate-history.json backups/rate-history-$(date +%Y%m%d).json
```

## Collections data

```bash
cp data/collections.json backups/collections-$(date +%Y%m%d).json
```

## Full site recovery procedure

### 1. Restore application code

```bash
git clone <repository-url>
cd sabarish
npm ci
```

### 2. Restore environment variables

Copy from secure storage into `.env.production` or hosting dashboard:

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- `CLOUDINARY_*`
- `METALPRICE_API_KEY` (optional)
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`

### 3. Restore data files

```bash
cp backups/collections-latest.json data/collections.json
cp backups/rate-history-latest.json data/rate-history.json
```

### 4. Restore uploaded images

- **Production:** Images are on Cloudinary — no local restore needed if Cloudinary account is intact.
- **Dev/local:** Copy `public/uploads/` from backup.

### 5. Rebuild and deploy

```bash
npm run build
npm run start   # or deploy via Vercel/hosting panel
```

### 6. Verify after recovery

```bash
npm run verify
npx tsx scripts/closure-verification.ts https://your-domain.com
```

Check:

- `/api/rates` returns live data
- Admin login works
- Collections pages show correct images
- `/sitemap.xml` and `/robots.txt` respond

## Recommended hosting backup strategy

| Platform | Recommendation |
|----------|----------------|
| **Vercel** | Git is source of truth; env vars in project settings; use Cloudinary for uploads |
| **VPS** | Daily `tar` of `data/`, `public/uploads/`; snapshot disk weekly |
| **Cloudinary** | Enable backup / replicate folder to second cloud bucket |

## Contact for emergencies

- Developer: restore from Git + env vars + `data/` backups
- Domain/DNS: registrar panel (point A/CNAME to hosting)
- SSL: auto via Vercel/Let's Encrypt on VPS
