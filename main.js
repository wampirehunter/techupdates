/**
 * TECHUPDATES - Core JavaScript
 * Data-driven architecture for GitHub Pages compatibility.
 * Allows easy updates without modifying HTML.
 */

const portfolioProjects = [
    {
    id: 1,
    title: "Luxury Perfume Commercial",
    category: "CONCEPT PROJECT / AI VIDEO",
    imagePath: "assets/portfolio/perfume-commercial.jpg",
    link: "contact.html"
},
    {
        id: 2,
        title: "Premium Watch Advertisement",
        category: "CONCEPT PROJECT / BRANDING",
        imagePath: "", // Replace with "assets/images/watch-commercial.jpg" when generated
        link: "contact.html"
    },
    {
        id: 3,
        title: "Restaurant Food Commercial",
        category: "CONCEPT PROJECT / SOCIAL REELS",
        imagePath: "", 
        link: "contact.html"
    },
    {
        id: 4,
        title: "Luxury Real Estate",
        category: "CONCEPT PROJECT / CAMPAIGN",
        imagePath: "", 
        link: "contact.html"
    }
];

// 2. INJECT PORTFOLIO DYNAMICALLY
document.addEventListener("DOMContentLoaded", () => {
    const portfolioGrid = document.getElementById("portfolio-grid");
    
    if (portfolioGrid) {
        portfolioProjects.forEach(project => {
            const projectCard = document.createElement("a");
            projectCard.href = project.link;
            projectCard.className = "portfolio-item";
            
            // Check if image exists, otherwise use the visual placeholder
            const visualContent = project.imagePath 
                ? `<img src="${project.imagePath}" alt="${project.title}" class="portfolio-img">`
                : `<div class="visual-placeholder"><span>AI VISUAL TO BE GENERATED:<br>${project.title}</span></div>`;

            projectCard.innerHTML = `
                ${visualContent}
                <div class="portfolio-content">
                    <span class="portfolio-category">${project.category}</span>
                    <h3 class="portfolio-title">${project.title}</h3>
                </div>
            `;
            portfolioGrid.appendChild(projectCard);
        });
    }

    // 3. STICKY NAV BACKGROUND ON SCROLL
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(5, 5, 5, 0.95)";
            navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
        } else {
            navbar.style.background = "rgba(5, 5, 5, 0.85)";
            navbar.style.boxShadow = "none";
        }
    });
});
