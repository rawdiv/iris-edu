document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links > a:not(.dropbtn)');
    const dropBtns = document.querySelectorAll('.dropbtn');
    const dropdowns = document.querySelectorAll('.dropdown');
    const isMobile = window.innerWidth <= 768;

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Close all dropdowns when menu is closed
            if (!this.classList.contains('active')) {
                closeAllDropdowns();
            }
        });
    }

    // Function to close all dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
            const btn = dropdown.querySelector('.dropbtn');
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0)';
            }
        });
    }

    // Toggle dropdown on mobile and desktop
    dropBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (isMobile) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const isOpen = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        const content = d.querySelector('.dropdown-content');
                        if (content) content.style.display = 'none';
                        const icon = d.querySelector('i');
                        if (icon) icon.style.transform = 'rotate(0)';
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                const content = this.nextElementSibling;
                content.style.display = isOpen ? 'none' : 'block';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = isOpen ? 'rotate(0)' : 'rotate(180deg)';
                }
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newIsMobile = window.innerWidth <= 768;
            if (isMobile !== newIsMobile) {
                // If breakpoint is crossed, reload the page to reinitialize the menu
                window.location.reload();
            }
        }, 250);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropbtn') && !e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
                closeAllDropdowns();
            }
        });
    });

    // Sticky navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    };

    // Counter animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the faster
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    };


    // Check if counter is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Run animations when elements come into view
    const handleScroll = () => {
        animateOnScroll();
        
        // Only animate counters when they come into view
        const counterSection = document.querySelector('.stats-section');
        if (counterSection && isInViewport(counterSection)) {
            animateCounters();
            window.removeEventListener('scroll', handleScroll);
        }
    };

    // Initial check in case elements are already in view
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);


    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
