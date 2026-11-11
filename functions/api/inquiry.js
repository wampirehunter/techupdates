// functions/api/inquiry.js
// Cloudflare Pages Function - Stores Project Leads with Facebook Ad Attribution

export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const data = await request.json();
        const {
            fullName,
            company,
            phone,
            email,
            serviceNeeded,
            packageSelected,
            estimatedBudget,
            timeline,
            projectDetails,
            fbclid,
            utm_source,
            utm_campaign,
            referrer
        } = data;

        if (!fullName || !phone) {
            return new Response(JSON.stringify({ success: false, error: "Name and phone are required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const country = request.headers.get("cf-ipcountry") || "Unknown";

        let inquiryId = null;
        if (env.DB) {
            const result = await env.DB.prepare(`
                INSERT INTO inquiries (
                    full_name, company, phone, email,
                    service_needed, package_selected, estimated_budget, timeline,
                    project_details, fbclid, utm_source, utm_campaign, referrer, ip_country
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                fullName,
                company || "",
                phone,
                email || "",
                serviceNeeded || "Website Development",
                packageSelected || "Custom",
                estimatedBudget || "",
                timeline || "",
                projectDetails || "",
                fbclid || null,
                utm_source || null,
                utm_campaign || null,
                referrer || "",
                country
            ).run();
            inquiryId = result?.meta?.last_row_id || null;
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: "Inquiry saved successfully",
            inquiryId: inquiryId 
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
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
