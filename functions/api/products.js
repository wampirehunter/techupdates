// functions/api/products.js
// Cloudflare Pages Function - Returns Products/Templates for Online Store

const FALLBACK_PRODUCTS = [
    {
        id: 1,
        title: "Nova - SaaS & Tech Startup Template",
        slug: "nova-saas-template",
        category: "website_template",
        price_inr: 2499,
        price_usd: 29,
        description: "High-converting landing page built for modern SaaS products and tech startups.",
        features: ["Dark Mode UI", "100% Responsive", "Interactive Pricing Table", "Lead Capture Ready"],
        image_url: "assets/portfolio/luxury-real-estate.jpg",
        demo_url: "demos/saas/index.html",
        is_active: 1
    },
    {
        id: 2,
        title: "Apex - Corporate & Advisory Consulting",
        slug: "apex-corporate-template",
        category: "website_template",
        price_inr: 2999,
        price_usd: 39,
        description: "Professional executive multi-page layout for financial, legal and business consultancies.",
        features: ["Clean Typography", "Case Study Grid", "Service Pages", "Quote Generator"],
        image_url: "assets/portfolio/watch-commercial.jpg",
        demo_url: "demos/corporate/index.html",
        is_active: 1
    },
    {
        id: 3,
        title: "Luxe - Modern Boutique & E-Commerce",
        slug: "luxe-ecommerce-template",
        category: "website_template",
        price_inr: 3999,
        price_usd: 49,
        description: "Modern lifestyle and retail storefront template with cart and filter workflow.",
        features: ["Product Grid", "Filterable Categories", "Quick View Modal", "Mobile Optimized"],
        image_url: "assets/portfolio/perfume-commercial.jpg",
        demo_url: "demos/ecommerce/index.html",
        is_active: 1
    },
    {
        id: 4,
        title: "Savor - Restaurant & Cafe Dining",
        slug: "savor-restaurant-template",
        category: "website_template",
        price_inr: 1999,
        price_usd: 25,
        description: "Appetizing, mobile-first design for cafes, bistros and fine dining establishments.",
        features: ["Digital Menu Cards", "Table Reservation Form", "Location Map", "Instagram Feed"],
        image_url: "assets/portfolio/restaurant-food-commercial.jpg",
        demo_url: "demos/restaurant/index.html",
        is_active: 1
    }
];

export async function onRequestGet(context) {
    const { env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        if (env.DB) {
            const { results } = await env.DB.prepare(
                "SELECT * FROM products WHERE is_active = 1 ORDER BY featured DESC, id ASC"
            ).all();

            const parsedResults = (results || []).map(p => ({
                ...p,
                features: p.features_json ? JSON.parse(p.features_json) : []
            }));

            return new Response(JSON.stringify({ success: true, products: parsedResults }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // Return fallback if D1 not yet bound
        return new Response(JSON.stringify({ success: true, products: FALLBACK_PRODUCTS, source: "mock" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: true, products: FALLBACK_PRODUCTS, error: err.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}
