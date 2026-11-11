/**
 * TECHUPDATES - Smart Analytics & Facebook Ad Attribution Tracker
 * Captures fbclid, UTM campaigns, referrers, and device info.
 * Works seamlessly with Edge Database and handles static hosting gracefully.
 */

(function () {
    "use strict";

    // 1. EXTRACT QUERY PARAMETERS
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get("fbclid");
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmContent = urlParams.get("utm_content");
    const utmTerm = urlParams.get("utm_term");

    // 2. PERSIST AD ATTRIBUTION IN SESSION STORAGE
    // This ensures that even if user navigates through 5 pages before contacting,
    // we still know exactly which Facebook ad brought them in.
    if (fbclid) sessionStorage.setItem("tu_fbclid", fbclid);
    if (utmSource) sessionStorage.setItem("tu_utm_source", utmSource);
    if (utmMedium) sessionStorage.setItem("tu_utm_medium", utmMedium);
    if (utmCampaign) sessionStorage.setItem("tu_utm_campaign", utmCampaign);
    if (utmContent) sessionStorage.setItem("tu_utm_content", utmContent);
    if (utmTerm) sessionStorage.setItem("tu_utm_term", utmTerm);

    // Also track first referrer if external
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        sessionStorage.setItem("tu_first_referrer", document.referrer);
    }

    // 3. DETECT DEVICE & SCREEN
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) return "mobile";
        return "desktop";
    }

    // 4. ASYNC TRACKING BEACON TO EDGE DATABASE
    function recordPageView() {
        const payload = {
            page_url: window.location.href,
            page_title: document.title,
            referrer: sessionStorage.getItem("tu_first_referrer") || document.referrer || "direct",
            fbclid: sessionStorage.getItem("tu_fbclid") || null,
            utm_source: sessionStorage.getItem("tu_utm_source") || (fbclid ? "facebook" : null),
            utm_medium: sessionStorage.getItem("tu_utm_medium") || null,
            utm_campaign: sessionStorage.getItem("tu_utm_campaign") || null,
            utm_content: sessionStorage.getItem("tu_utm_content") || null,
            utm_term: sessionStorage.getItem("tu_utm_term") || null,
            device_type: getDeviceType(),
            screen_resolution: `${window.screen.width}x${window.screen.height}`
        };

        // Fire-and-forget fetch to API
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(() => {
            // Silently ignore if running on pure static hosting
        });
    }

    // 5. PUBLIC EXPORTS FOR INQUIRY FORM & WHATSAPP
    window.TechUpdatesTracker = {
        getAttribution() {
            return {
                fbclid: sessionStorage.getItem("tu_fbclid") || "",
                utm_source: sessionStorage.getItem("tu_utm_source") || (sessionStorage.getItem("tu_fbclid") ? "facebook" : ""),
                utm_medium: sessionStorage.getItem("tu_utm_medium") || "",
                utm_campaign: sessionStorage.getItem("tu_utm_campaign") || "",
                referrer: sessionStorage.getItem("tu_first_referrer") || document.referrer || "direct"
            };
        }
    };

    // Trigger tracking once DOM is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        recordPageView();
    } else {
        document.addEventListener("DOMContentLoaded", recordPageView);
    }
})();
