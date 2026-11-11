# Cloudflare D1 & Facebook Ads Tracking Setup Guide
**TechUpdates Website Development, Hosting & App Agency**

Your website is built to run 100% statically on GitHub Pages and Cloudflare Pages, with a serverless edge backend powered by **Cloudflare Pages Functions** and **Cloudflare D1 SQL Database**.

---

## 1. Quick Overview of What is Installed

1. **Visitor & Ad Tracking Engine (`analytics.js`)**:
   - Automatically detects Facebook Ad clicks (`fbclid`), Instagram campaigns, and UTM parameters (`utm_source`, `utm_campaign`, etc.).
   - Saves them in browser session storage so they persist across pages.
   - Pings `/api/track` to store every visit and ad click in Cloudflare D1.

2. **Lead Capture & WhatsApp Integration (`functions/api/inquiry.js`)**:
   - When a client submits the project inquiry form, it automatically:
     - Saves their contact info, budget, and exact Facebook Ad attribution in Cloudflare D1.
     - Formats and opens a pre-filled WhatsApp message directly to **`+91 9400977424`**.

3. **Dynamic Online Store (`functions/api/products.js` & `store.html`)**:
   - Fetches products and ready-made website templates from the D1 database.
   - Has built-in fallback so the store works immediately even before the database is linked.

4. **Interactive Demo Showroom (`demos/`)**:
   - 4 self-contained responsive demo websites:
     - **Nova SaaS**: `/demos/saas/index.html`
     - **Apex Corporate**: `/demos/corporate/index.html`
     - **Luxe E-Commerce**: `/demos/ecommerce/index.html`
     - **Savor Restaurant**: `/demos/restaurant/index.html`
   - Clients can test them inside the interactive Desktop / Tablet / Mobile previewer.

---

## 2. Setting Up Cloudflare D1 (Free 5-Minute Setup)

### Step A: Push Code to GitHub
Ensure all files are committed and pushed to your GitHub repository.

### Step B: Connect to Cloudflare Pages
1. Log in to your **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. In the left sidebar, click **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository: `techupdates-main`.
4. Under **Build Settings**:
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `.` *(dot = root)*
5. Click **Save and Deploy**.

### Step C: Create the D1 Database
1. In Cloudflare Dashboard, go to **Workers & Pages** > **D1 SQL Database**.
2. Click **Create Database**.
3. Name it: `techupdates-db` and click **Create**.
4. Go to the **Console** tab of your new database, paste the contents of `schema.sql`, and click **Execute**.

### Step D: Bind D1 to Cloudflare Pages
1. Go back to **Workers & Pages** > click on your **techupdates** Pages project.
2. Go to **Settings** > **Functions**.
3. Scroll down to **D1 Database Bindings** and click **Add binding**.
4. Set:
   - **Variable name:** `DB`
   - **D1 Database:** Select `techupdates-db`
5. Click **Save**.
6. Trigger a redeploy (or push a commit). Your database and API functions (`/api/track`, `/api/inquiry`, `/api/products`, `/api/stats`) are now live!

---

## 3. How to View Your Facebook Ad Leads & Traffic Stats

Once your D1 database is linked, you can view your real-time analytics by visiting:
👉 **`https://techupdates.co.in/api/stats`**

This will return a JSON report showing:
- Total Pageviews
- Facebook Ad Clicks & Views
- Total Project Leads
- Attributed Leads from Facebook Ads
- Recent 10 Lead Submissions with phone numbers and campaign sources

---

## 4. Testing Locally on Your Computer

Run the built-in server:
```powershell
python -m http.server 8080
```
Then open:
👉 **`http://localhost:8080`**
