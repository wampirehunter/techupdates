// functions/api/track.js
// Cloudflare Pages Function - Records Pageviews, Referrers, and Facebook Ad Clicks

export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const body = await request.json();
        const {
            page_url,
            page_title,
            referrer,
            fbclid,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            device_type,
            screen_resolution
        } = body;

        // Retrieve Cloudflare geolocation & client headers
        const country = request.headers.get("cf-ipcountry") || "Unknown";
        const city = request.headers.get("cf-ipcity") || "Unknown";
        const userAgent = request.headers.get("user-agent") || "";

        // If Cloudflare D1 binding is available, execute SQL insert
        if (env.DB) {
            await env.DB.prepare(`
                INSERT INTO page_views (
                    page_url, page_title, referrer, fbclid,
                    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
                    country, city, user_agent, device_type, screen_resolution
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                page_url || "",
                page_title || "",
                referrer || "",
                fbclid || null,
                utm_source || null,
                utm_medium || null,
                utm_campaign || null,
                utm_content || null,
                utm_term || null,
                country,
                city,
                userAgent,
                device_type || "desktop",
                screen_resolution || ""
            ).run();
        }

        return new Response(JSON.stringify({ success: true, tracked: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 200, // Return 200 so client analytics never breaks user experience
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
