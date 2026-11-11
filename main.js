/**
 * TECHUPDATES — Master Client Controller
 * Controls Preloader, Interactive Live Template Demo Switcher,
 * Currency Switching, Ad Attribution Injection, and Lead Submission.
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================================
    // 1. PRELOADER DISMISSAL
    // =========================================================
    const preloader = document.getElementById("preloader");
    const hidePreloader = () => {
        if (preloader && !preloader.classList.contains("loaded")) {
            preloader.classList.add("loaded");
            setTimeout(() => {
                if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 600);
        }
    };

    window.addEventListener("load", hidePreloader);
    // Safety fallback: ensure preloader never blocks view past 1.5s
    setTimeout(hidePreloader, 1500);

    // =========================================================
    // 2. MOBILE NAVIGATION DRAWER
    // =========================================================
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
        // Close on link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => navLinks.classList.remove("show"));
        });
    }

    // =========================================================
    // 3. INTERACTIVE LIVE TEMPLATE DEMO SHOWCASE
    // =========================================================
    const demoIframe = document.getElementById("demoIframe");
    const browserUrl = document.getElementById("browserUrl");
    const externalDemoLink = document.getElementById("externalDemoLink");
    const browserMockup = document.getElementById("browserMockup");

    const templateData = {
        saas: {
            url: "demos/saas/index.html",
            displayUrl: "https://nova-ai.techupdates.co.in",
            title: "Nova - SaaS & Tech Startup"
        },
        corporate: {
            url: "demos/corporate/index.html",
            displayUrl: "https://apex-partners.techupdates.co.in",
            title: "Apex - Corporate & Advisory"
        },
        ecommerce: {
            url: "demos/ecommerce/index.html",
            displayUrl: "https://luxe-studio.techupdates.co.in",
            title: "Luxe - Boutique & E-Commerce"
        },
        restaurant: {
            url: "demos/restaurant/index.html",
            displayUrl: "https://savor-bistro.techupdates.co.in",
            title: "Savor - Restaurant & Dining"
        }
    };

    // Template Tab Switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const key = btn.getAttribute("data-template");
            const item = templateData[key];
            if (item && demoIframe) {
                demoIframe.src = item.url;
                if (browserUrl) browserUrl.textContent = item.displayUrl;
                if (externalDemoLink) externalDemoLink.href = item.url;
            }
        });
    });

    // Device Viewport Switcher (Desktop / Tablet / Mobile)
    const deviceButtons = document.querySelectorAll(".device-btn");
    deviceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            deviceButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const device = btn.getAttribute("data-device");
            if (browserMockup) {
                if (device === "mobile") {
                    browserMockup.style.maxWidth = "390px";
                } else if (device === "tablet") {
                    browserMockup.style.maxWidth = "768px";
                } else {
                    browserMockup.style.maxWidth = "100%";
                }
            }
        });
    });

    // =========================================================
    // 4. PRICING & CURRENCY SWITCHER (₹ INR / $ USD)
    // =========================================================
    let currentCurrency = "INR";
    const currencyButtons = document.querySelectorAll(".currency-btn");
    const priceElements = document.querySelectorAll("[data-price-inr]");

    function updateCurrency(curr) {
        currentCurrency = curr;
        priceElements.forEach(el => {
            const inrVal = el.getAttribute("data-price-inr");
            const usdVal = el.getAttribute("data-price-usd");
            const symbol = curr === "INR" ? "₹" : "$";
            const val = curr === "INR" ? inrVal : usdVal;

            const currencySymbolEl = el.closest(".plan-price-wrap")?.querySelector(".price-currency") || el.querySelector(".price-currency");
            const priceAmountEl = el.closest(".plan-price-wrap")?.querySelector(".price-amount") || el.querySelector(".price-amount");

            if (currencySymbolEl && priceAmountEl) {
                currencySymbolEl.textContent = symbol;
                priceAmountEl.textContent = val;
            } else {
                el.textContent = `${symbol}${val}`;
            }
        });
    }

    currencyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currencyButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const curr = btn.getAttribute("data-currency");
            updateCurrency(curr);
        });
    });

    // =========================================================
    // 5. PACKAGE SELECT & AUTO-FILL TO INQUIRY FORM
    // =========================================================
    const packageButtons = document.querySelectorAll(".select-package-btn");
    const packageInput = document.getElementById("packageSelected");
    const serviceInput = document.getElementById("serviceNeeded");
    const contactSection = document.getElementById("contact");

    packageButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const planName = btn.getAttribute("data-package");
            const serviceType = btn.getAttribute("data-service") || "Website Development";

            if (packageInput) packageInput.value = planName;
            if (serviceInput) serviceInput.value = serviceType;

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
                const nameInput = document.getElementById("fullName");
                if (nameInput) setTimeout(() => nameInput.focus(), 600);
            }
        });
    });

    // =========================================================
    // 6. SMART INQUIRY SUBMISSION (DB Save + WhatsApp Auto-Link)
    // =========================================================
    const inquiryForm = document.getElementById("inquiryForm");
    const toast = document.getElementById("toast");
    const WHATSAPP_NUMBER = "919400977424"; // Real owner contact

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);
    }

    if (inquiryForm) {
        inquiryForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName")?.value.trim() || "";
            const company = document.getElementById("company")?.value.trim() || "";
            const phone = document.getElementById("phone")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const serviceNeeded = document.getElementById("serviceNeeded")?.value || "Website Development";
            const packageSelected = document.getElementById("packageSelected")?.value || "Custom";
            const estimatedBudget = document.getElementById("budget")?.value || "Standard";
            const timeline = document.getElementById("timeline")?.value || "Flexible";
            const projectDetails = document.getElementById("projectDetails")?.value.trim() || "";

            if (!fullName || !phone) {
                showToast("⚠️ Please enter your Name and Mobile/WhatsApp number.");
                return;
            }

            // Retrieve ad tracking attribution (Facebook Ads fbclid & UTM)
            const attribution = window.TechUpdatesTracker ? window.TechUpdatesTracker.getAttribution() : {};

            const payload = {
                fullName,
                company,
                phone,
                email,
                serviceNeeded,
                packageSelected,
                estimatedBudget,
                timeline,
                projectDetails,
                fbclid: attribution.fbclid || null,
                utm_source: attribution.utm_source || null,
                utm_campaign: attribution.utm_campaign || null,
                referrer: attribution.referrer || document.referrer || "direct"
            };

            const submitBtn = inquiryForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = "<span>Processing Quote...</span>";
            }

            // 1. Asynchronously send to Edge Database (zero lag)
            try {
                fetch("/api/inquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }).catch(() => {});
            } catch (_) {}

            // 2. Prepare WhatsApp Pre-filled Lead Message
            const adInfo = attribution.fbclid || attribution.utm_campaign 
                ? `\n*Campaign:* ${attribution.utm_campaign || 'Facebook Ad'} (${attribution.utm_source || 'Ad'})`
                : "";

            const whatsappMessage = `*New Project Inquiry | TechUpdates*\n\n` +
                `*Name:* ${fullName}\n` +
                `*Company:* ${company || 'N/A'}\n` +
                `*Phone:* ${phone}\n` +
                (email ? `*Email:* ${email}\n` : '') +
                `*Service:* ${serviceNeeded}\n` +
                `*Package:* ${packageSelected}\n` +
                `*Budget:* ${estimatedBudget}\n` +
                `*Timeline:* ${timeline}\n` +
                (projectDetails ? `*Details:* ${projectDetails}\n` : '') +
                adInfo;

            const encoded = encodeURIComponent(whatsappMessage);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

            showToast("✅ Inquiry received! Opening WhatsApp to connect...");

            setTimeout(() => {
                window.open(waUrl, "_blank", "noopener,noreferrer");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                inquiryForm.reset();
            }, 800);
        });
    }
});
