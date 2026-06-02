// page-transition.js — Light Organic Reveal
document.addEventListener('DOMContentLoaded', () => {
    const curtain = document.getElementById('curtain-transition');
    
    // Add initial entering state
    document.body.classList.add('page-entering');
    
    // Open the curtain after page loads
    setTimeout(() => {
        if (curtain) {
            curtain.classList.add('is-loaded');
        }
        // Trigger content entrance
        requestAnimationFrame(() => {
            document.body.classList.add('page-entered');
        });
    }, 200);

    // Clean up classes after animation completes
    setTimeout(() => {
        document.body.classList.remove('page-entering');
    }, 1400);

    // Intercept internal link clicks
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.defaultPrevented) return;

            const nextElement = link.nextElementSibling;
            const isMobileSubmenuTrigger = link.classList.contains('mobile-link') &&
                nextElement &&
                nextElement.classList.contains('mobile-submenu');
            const clickedSubmenuIcon = e.target.closest && e.target.closest('.mobile-submenu-icon');

            if (isMobileSubmenuTrigger && clickedSubmenuIcon) {
                e.preventDefault();
                return;
            }

            const targetUrl = link.href;
            const currentHost = window.location.host;

            // Only react to internal links, skip anchors and blank targets
            if (
                targetUrl &&
                targetUrl.includes(currentHost) &&
                !link.hasAttribute('download') &&
                link.getAttribute('target') !== '_blank' &&
                !targetUrl.includes('#')
            ) {
                e.preventDefault();

                if (curtain) {
                    // Reset state, then trigger close
                    curtain.classList.remove('is-loaded');
                    curtain.classList.add('is-closing');
                }

                // Wait for close animation before navigating
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 650);
            }
        });
    });
});
