// functions/api/stats.js
// Cloudflare Pages Function - Summary of Ad Traffic, Clicks & Inquiries

export async function onRequestGet(context) {
    const { env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        if (!env.DB) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Cloudflare D1 is not bound yet. Connect D1 in Cloudflare Pages dashboard.",
                stats: { totalViews: 0, fbViews: 0, totalLeads: 0, recentLeads: [] }
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const totalViews = await env.DB.prepare("SELECT COUNT(*) as count FROM page_views").first();
        const fbViews = await env.DB.prepare("SELECT COUNT(*) as count FROM page_views WHERE fbclid IS NOT NULL OR utm_source = 'facebook'").first();
        const totalLeads = await env.DB.prepare("SELECT COUNT(*) as count FROM inquiries").first();
        const fbLeads = await env.DB.prepare("SELECT COUNT(*) as count FROM inquiries WHERE fbclid IS NOT NULL OR utm_source = 'facebook'").first();
        const recentLeads = await env.DB.prepare("SELECT id, created_at, full_name, phone, service_needed, package_selected, fbclid, utm_campaign FROM inquiries ORDER BY id DESC LIMIT 10").all();

        return new Response(JSON.stringify({
            success: true,
            stats: {
                totalViews: totalViews?.count || 0,
                facebookAdViews: fbViews?.count || 0,
                totalLeads: totalLeads?.count || 0,
                facebookAdLeads: fbLeads?.count || 0,
                recentLeads: recentLeads?.results || []
            }
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}
