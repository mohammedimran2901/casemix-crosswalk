# CasemixCrosswalk 🌍

A launch-tonight SaaS MVP: search orthopedic procedures across **US MS-DRG, UK NHS HRG, German G-DRG, Australian AR-DRG** and see published reimbursement rates side by side. Free for 3 lookups, then a $19 Stripe unlock.

## Files
- `index.html` — landing page + search UI + pricing
- `data.js` — seed crosswalk dataset (⚠️ rates are illustrative — verify against official CMS / NHS / InEK / IHACPA publications before charging real customers)
- `app.js` — search, free-lookup counter (localStorage), blur paywall
- `styles.css`

## Launch tonight in 4 steps
1. **Create a Stripe Payment Link** ($19 one-time) at dashboard.stripe.com → Payment Links.
   Set the success URL to `https://YOURDOMAIN.com/?success=1`.
2. Put your link into `app.js`, line 4 (`STRIPE_PAYMENT_LINK`).
3. Deploy free:
   - Netlify: drag-and-drop this folder onto app.netlify.com
   - or Vercel / GitHub Pages (it's fully static).
4. Post the link on LinkedIn (health economics groups), r/HealthEconomics, and DM market-access consultants.

## Roadmap after first sales
- Expand dataset beyond orthopedics (cardio, oncology)
- Add countries (NordDRG, FR GHM, CH SwissDRG)
- CSV export button for paid users
- Swap localStorage unlock for real license keys if revenue justifies it

**Disclaimer:** reference tool only, not a certified grouping engine. Not affiliated with CMS, NHS England, InEK or IHACPA.
