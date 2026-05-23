document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = document.getElementById('mobile-menu-icon');

    if (!mobileBtn || !mobileMenu || !mobileIcon) {
        return;
    }

    const setMenuOpen = (open) => {
        mobileMenu.classList.toggle('hidden', !open);
        mobileBtn.setAttribute('aria-expanded', String(open));
        mobileIcon.classList.toggle('fa-bars', !open);
        mobileIcon.classList.toggle('fa-xmark', open);
        document.body.classList.toggle('is-menu-open', open);
    };

    mobileBtn.addEventListener('click', () => {
        setMenuOpen(mobileMenu.classList.contains('hidden'));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });
});
