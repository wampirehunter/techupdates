-- =========================================================
-- TECHUPDATES - CLOUDFLARE D1 DATABASE SCHEMA
-- Compatible with Cloudflare D1 (SQLite Edge Database)
-- =========================================================

-- 1. VISITOR & AD TRAFFIC TRACKING (Facebook Ads, UTMs, Pageviews)
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    page_url TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    fbclid TEXT,                    -- Facebook Click ID from Ad campaigns
    utm_source TEXT,                -- e.g. facebook, instagram, google
    utm_medium TEXT,                -- e.g. cpc, paid_social, reel
    utm_campaign TEXT,              -- e.g. web_dev_launch_2026
    utm_content TEXT,               -- Ad creative / copy variation
    utm_term TEXT,                  -- Keywords
    country TEXT,                   -- Cloudflare edge header (cf-ipcountry)
    city TEXT,                      -- Cloudflare edge header (cf-ipcity)
    user_agent TEXT,
    device_type TEXT,               -- Mobile / Tablet / Desktop
    screen_resolution TEXT
);

CREATE INDEX IF NOT EXISTS idx_pageviews_fbclid ON page_views (fbclid);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_campaign ON page_views (utm_campaign);
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON page_views (timestamp);

-- 2. CLIENT PROJECT INQUIRIES & LEADS
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    full_name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    service_needed TEXT NOT NULL,   -- Website Dev, Hosting, App Dev, etc.
    package_selected TEXT,          -- Starter, Standard Business, Custom, etc.
    estimated_budget TEXT,
    timeline TEXT,
    project_details TEXT,
    fbclid TEXT,                    -- Attributed Facebook Click ID
    utm_source TEXT,                -- Lead origin campaign source
    utm_campaign TEXT,
    referrer TEXT,
    ip_country TEXT,
    status TEXT DEFAULT 'new'       -- 'new', 'contacted', 'closed', 'archived'
);

CREATE INDEX IF NOT EXISTS idx_inquiries_phone ON inquiries (phone);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);

-- 3. STORE PRODUCTS (Future Online Store / Ready-to-use Templates)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,         -- 'website_template', 'saas_starter', 'hosting_addon'
    price_inr REAL NOT NULL,
    price_usd REAL NOT NULL,
    description TEXT,
    features_json TEXT,             -- JSON string of bullet point features
    image_url TEXT,
    demo_url TEXT,
    download_url TEXT,
    is_active INTEGER DEFAULT 1,
    featured INTEGER DEFAULT 0
);

-- Seed initial products/templates for future e-commerce
INSERT OR IGNORE INTO products (id, title, slug, category, price_inr, price_usd, description, features_json, image_url, demo_url, is_active, featured)
VALUES 
(1, 'Nova - SaaS & Tech Startup Template', 'nova-saas-template', 'website_template', 2499, 29, 'High-converting landing page built for modern SaaS products and tech startups.', '["Dark Mode UI", "100% Responsive", "Interactive Pricing Table", "Lead Capture Ready"]', 'assets/templates/nova.jpg', 'demos/saas/index.html', 1, 1),
(2, 'Apex - Corporate & Advisory Consulting', 'apex-corporate-template', 'website_template', 2999, 39, 'Professional executive multi-page layout for financial, legal and business consultancies.', '["Clean Typography", "Case Study Grid", "Service Pages", "Quote Generator"]', 'assets/templates/apex.jpg', 'demos/corporate/index.html', 1, 1),
(3, 'Luxe - Modern Boutique & E-Commerce', 'luxe-ecommerce-template', 'website_template', 3999, 49, 'Modern lifestyle and retail storefront template with cart and filter workflow.', '["Product Grid", "Filterable Categories", "Quick View Modal", "Mobile Optimized"]', 'assets/templates/luxe.jpg', 'demos/ecommerce/index.html', 1, 1),
(4, 'Savor - Restaurant & Cafe Dining', 'savor-restaurant-template', 'website_template', 1999, 25, 'Appetizing, mobile-first design for cafes, bistros and fine dining establishments.', '["Digital Menu Cards", "Table Reservation Form", "Location Map", "Instagram Feed"]', 'assets/templates/savor.jpg', 'demos/restaurant/index.html', 1, 1);

-- 4. CUSTOMER ORDERS & DOWNLOADS (Future Store)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_code TEXT UNIQUE,
    product_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'manual_inquiry',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
);
