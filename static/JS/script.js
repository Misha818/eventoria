// Slideshow functionality
let currentSlide = 0;
let slides = []
let dots = [];
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');

let slideInterval;
let isPaused = false;
let slideData = []
let slideImages = []

// Loader variables
const slideLoader = document.getElementById('slide-loader');
let imagesLoaded = 0;
let totalImages = 10;

function updateSlideContent(index) {
    if (slideData.length > 0) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heloButtons = document.querySelectorAll('.hero-buttons a');

        let titleColor = "#fff";
        if (slideData[index].Title_Color !== "") {
            titleColor = slideData[index].Title_Color;
        }

        let subtitleColor = "#fff";
        if (slideData[index].Subtitle_Color !== "") {
            subtitleColor = slideData[index].Subtitle_Color;
        }

        if (heroTitle && heroSubtitle && slideData[index]) {
            heroTitle.textContent = slideData[index].Title;
            heroTitle.style.color = titleColor;
            heroSubtitle.textContent = slideData[index].Subtitle;
            heroSubtitle.style.color = subtitleColor;

            heloButtons[0].href =  window.location.origin + '/buy/' + slideData[index].URL;
            heloButtons[1].href =  slideData[index].URL;
        }
    }
}

function showSlide(index) {
    // Remove active class from all slides and dots

    slides.forEach((slide, i) => {

        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
        updateSlideContent(index);
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

function startSlideshow() {
    if (!isPaused) {
        slideInterval = setInterval(nextSlide, 6000); // 6 seconds
    }
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

function pauseSlideshow() {
    isPaused = true;
    stopSlideshow();
}

function resumeSlideshow() {
    isPaused = false;
    startSlideshow();
}

// Header scroll effect
const header = document.getElementById('header');

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
}

// Language selector
const languageSelector = document.getElementById('language-selector');
const languageButton = document.getElementById('language-button');
const languageDropdown = document.getElementById('language-dropdown');
const languageOptions = document.querySelectorAll('.language-option');

if (languageButton && languageDropdown) {
    languageButton.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('active');
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const flag = option.querySelector('span:first-child').textContent;
            // const code = option.dataset.lang.toUpperCase();
            languageButton.querySelector('span:first-child').textContent = `${flag}`;
            languageDropdown.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            }

            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Intersection Observer for active nav states
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
    rootMargin: `-${header.offsetHeight}px 0px -50% 0px`,
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Initialize everything when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     initializeSlideshow();
// });

// Handle page visibility for slideshow
function visibility_change() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else if (!isPaused) {
            startSlideshow();
        }
    });
}

// Keyboard navigation for accessibility
function accessibility_key_nav() {

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            pauseSlideshow();
            setTimeout(resumeSlideshow, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            pauseSlideshow();
            setTimeout(resumeSlideshow, 3000);
        }
    });
}

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Show success message
    document.getElementById('success-message').style.display = 'block';

    // Reset form
    this.reset();

    // Log form data
    console.log('Form submitted:', { name, email, subject, message });

    // Hide success message after 5 seconds
    setTimeout(() => {
        document.getElementById('success-message').style.display = 'none';
    }, 5000);
});

document.addEventListener('DOMContentLoaded', function () {

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            pauseSlideshow();
            setTimeout(resumeSlideshow, 3000); // Resume after 3 seconds
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            pauseSlideshow();
            setTimeout(resumeSlideshow, 3000); // Resume after 3 seconds
        });
    }

    // Dot navigation
    function dot_navigation() {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                pauseSlideshow();
                setTimeout(resumeSlideshow, 3000); // Resume after 3 seconds
            });
        });
    }

    // Pause on hover
    function pause_on_hover() {

        const heroSection = document.querySelector('.hero');

        if (heroSection) {
            heroSection.addEventListener('mouseenter', pauseSlideshow);
            heroSection.addEventListener('mouseleave', resumeSlideshow);
        }

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        if (heroSection) {
            heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            pauseSlideshow();
            setTimeout(resumeSlideshow, 3000);
        }
    }

    // Initialize slideshow
    function initializeSlideshow() {

        if (slides.length > 0) {
            dot_navigation();
            accessibility_key_nav();
            visibility_change();
            setTimeout(() => {
                if (imagesLoaded === totalImages) {
                    startSlideshow();
                }
            }, 1000);
            pause_on_hover();
        } else {

            // Create a FormData object to hold the files
            let formData = new FormData();
            // Create a new XMLHttpRequest object
            let xhr = new XMLHttpRequest();
            // Configure the request
            xhr.open('POST', '/get_home_slides');
            xhr.setRequestHeader('X-CSRFToken', csrfToken);

            // Define what happens on successful data submission
            xhr.onload = function () {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);

                    if (response.status === '1') {
                        // Slide content data

                        console.log(response.data);
                        totalImages = response.data.length;
                        slideData = response.data
                        // slideData = [
                        //     {
                        //         title: "Professional Learning Events",
                        //         title_color: "yellow",
                        //         subtitle: "Expert-led workshops and training sessions designed to advance your career and skills.",
                        //         subtitle_color: "#FFA500",
                        //     },
                        //     {
                        //         title: "Musical Experiences",
                        //         title_color: "green",
                        //         subtitle: "Live performances, music workshops, and collaborative sessions with talented artists.",
                        //         subtitle_color: "#FFC0CB",
                        //     },
                        //     {
                        //         title: "Community Collaboration",
                        //         title_color: "",
                        //         subtitle: "Team-building activities and networking events that create lasting professional relationships.",
                        //         subtitle_color: "blue",
                        //     }
                        // ];

                        // Image URLs for preloading
                        // slideImages = [
                            //     'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=900&fit=crop',
                            //     'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=900&fit=crop',
                            //     'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&h=900&fit=crop'
                            // ];
                        
                        response.data.forEach(slide => {
                            slideImages.push(slide.IMG);
                        });

                        preloadImages(); // Start loading images
                        slides = document.querySelectorAll('.slide');
                        dots = document.querySelectorAll('.slide-dot');
                        if (slides.length == 1) {
                            dots.forEach(dot => dot.style.display = 'none');
                            nextButton.style.display = 'none';
                            prevButton.style.display = 'none';
                        }
                        initializeSlideshow();
                    }

                    // if (response.status === '0') {
                    //     // Scroll the window to the mistakesDiv with smooth behavior
                    //     mistakesDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // }
                } else {
                    // Handle error response
                    console.error('Error adding category:', xhr.responseText);
                }
            };

            // Send the request with the FormData object
            xhr.send(formData);

        }
    }

    // Fade in animation on scroll
    const fadeElements = document.querySelectorAll('.activity-card, .feature');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    function preloadImages() {
        const slideshowContainer = document.querySelector('.slideshow-container');
        const slideNav = document.querySelector('.slide-nav');

        slideImages.forEach((image, index) => {
            const img = new Image();
            const dot = document.createElement('div');

            // Add the slide class
            img.classList.add('slide');
            img.alt = slideData[index] ? slideData[index].Alt_Text : `Slide ${index + 1}`;
            dot.className = 'slide-dot';
            dot.setAttribute('data-slide', index);

            // Add active class to first image
            if (index === 0) {
                img.classList.add('active');
                dot.classList.add('active');
            }

            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    updateSlideContent(0);
                    hideLoader();
                }
            };

            img.onerror = () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    hideLoader();
                }
            };
            let imageSrc =  window.location.origin + '/static/images/uploads/home_slides/' + image;
            console.log(imageSrc);
            img.src = imageSrc;
            // Add image to the slideshow container

            slideshowContainer.appendChild(img);
            slideNav.appendChild(dot);

        });
    }

    // Hide loader function
    function hideLoader() {
        if (slideLoader) {
            slideLoader.classList.add('hidden');
            setTimeout(() => {
                slideLoader.style.display = 'none';
            }, 500);
        }
    }

    if (1 == 2) {
    }

    initializeSlideshow();


});