let csrf = csrfToken;
const emailRequired = document.getElementById('emailRequired').value;
const invalidEmail = document.getElementById('invalidEmail').value;
const subscribeText = document.getElementById('subscribe').textContent;
const submitText = document.getElementById('message').textContent;
const redFields = document.getElementById('redFields').value;
const newEventsText = document.getElementById('newEventsText').value;
const newEventsText1 = document.getElementById('newEventsText1').value;


function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const value = email.trim();

    const re = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    return re.test(value);
    }


function myLoader(color, gearID) {
    if (color === undefined) {
    color = 'crimson'
    }

    if (gearID === undefined) {
    gearID = 'gear'
    }
    let loader = document.createElement('div'); // Create a div element for the loader
    loader.id = gearID;
    loader.style.color = color;
    loader.style.fontSize = '20px';
    loader.style.display = 'inline-block';
    loader.textContent = '⚙';
    return loader;
}


function rotate(gearElement) {
    let angle = 0;
    setInterval(() => {
        angle = (angle + 5) % 360; 
        gearElement.style.transform = `rotate(${angle}deg)`;
    }, 50); 

}


function errorMC_view(mode) {
    if (mode === 0) {
        // document.getElementById('error-message').classList.add('hidden')
        document.getElementById('error-message').style.border = '1px solid #10b981';
        document.getElementById('error-message').style.color = '#10b981';
        document.getElementById('error-message').style.background = 'rgba(16, 185, 129, 0.1)';
        document.getElementById('error-message').style.display = 'none';
    }
    
    if (mode === 1) {
        // document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-message').style.border = '1px solid red';
        document.getElementById('error-message').style.color = 'red';
        document.getElementById('error-message').style.background = 'rgb(185 16 16 / 10%)';
        document.getElementById('error-message').style.display = 'block';
    }
}
// Subscribe function
let sFlag = false;
document.querySelector('#subscribe').addEventListener('click', function() {
    if (sFlag) {
    return;
    }

    let csrfToken = csrf;

sFlag = true;
document.getElementById('subscribe-message').classList.add('hidden')
document.getElementById('subscribe-message').style.border = '1px solid #10b981';
document.getElementById('subscribe-message').style.color = '#10b981';
document.getElementById('subscribe-message').style.background = 'rgba(16, 185, 129, 0.1)';
let Email = document.getElementById('subscribe-email').value;
if (Email === '') {
    document.getElementById('subscribe-message').textContent = emailRequired;
    document.getElementById('subscribe-message').classList.remove('hidden');
    document.getElementById('subscribe-message').style.border = '1px solid red';
    document.getElementById('subscribe-message').style.color = 'red';
    document.getElementById('subscribe-message').style.background = 'rgb(185 16 16 / 10%)';
    document.getElementById('subscribe-message').style.display = 'block';
    sFlag = false;
    return;
}

if (!isValidEmail(Email)) {
    document.getElementById('subscribe-message').textContent = invalidEmail;
    document.getElementById('subscribe-message').classList.remove('hidden');
    document.getElementById('subscribe-message').style.border = '1px solid red';
    document.getElementById('subscribe-message').style.color = 'red';
    document.getElementById('subscribe-message').style.background = 'rgb(185 16 16 / 10%)';
    document.getElementById('subscribe-message').style.display = 'block';
    sFlag = false;
    return;
}


let loader = myLoader('#e1d7cc');    

    document.getElementById('subscribe').innerHTML = '';
    document.getElementById('subscribe').appendChild(loader);

    let gearElement = document.getElementById('gear');
    if (!gearElement) {
        gearElement.remove();
        document.getElementById('subscribe').textContent = subscribeText;
        sFlag = false;
        return;
    } 

    rotate(gearElement);

    let formData = new FormData();

    formData.append('Email', Email)     

    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // Configure the request
    xhr.open('POST', '/subscribe');
    xhr.setRequestHeader('X-CSRFToken', csrfToken);

    // Define what happens on successful data submission
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            gearElement.remove();
            document.getElementById('subscribe').textContent = subscribeText;
            if (response.status === '1') {
                let content = response.answer;
                document.querySelector('#subscribe-message').innerHTML = content;
                document.querySelector('#subscribe-message').style.color = 'green';
                
            }
            
            if (response.status === '0') {
            let content = response.answer;
            document.querySelector('#subscribe-message').innerHTML = content;
            }
            
            document.querySelector('#subscribe-message').classList.remove('hidden');
            document.querySelector('#subscribe-message').style.display = 'block';
        } 
        sFlag = false;
    };

    // Define what happens in case of error
    xhr.onerror = function () {
        console.error('Request failed.');
    };

    // Send the request with the JSON data
    xhr.send(formData);
});

let cmFlag = false;
document.getElementById('message').addEventListener('click', function() {
    event.preventDefault();
    if (cmFlag) {
    return;
    } 

    scrollTarget = document.querySelector('#contacts');
    
    cmFlag = true;
    let loader = myLoader('#e1d7cc');    
    
    document.getElementById('message').innerHTML = '';
    document.getElementById('message').appendChild(loader);

    let gearElement = document.getElementById('gear');
    if (!gearElement) {
        gearElement.remove();
        document.getElementById('message').textContent = subscribeText;
        cmFlag = false;
        return;
    } 

    rotate(gearElement);

    let errorMC = document.getElementById('error-message');
    // errorMC.classList.add('hidden');
    // errorMC.style.display = 'none';
    errorMC_view(0)

    const form = document.querySelector('.messageForm');

    let isValid = true;
    let errorMessages = [];
    
    // Get all input and textarea elements inside the form
    const elements = form.querySelectorAll('input, textarea');
    let formData = new FormData();

    
    elements.forEach(function(element) {
    // Get the element's ID and trimmed value
    const id = element.getAttribute('id');
    const value = element.value.trim();
    
    // Log values for debugging purposes
    console.log(`Element ID: ${id}, Value: ${value}`);
    
    // Check if the value exists (non-empty)
    if (value === '') {
        isValid = false;
        // errorMessages.push(`The field '${id}' is required.`);
        document.getElementById(id).style.border = '1px solid red';
    }
    
    // If the element is an email input, perform email validation
    if (element.type === 'email' && value !== '') {
        // Simple email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
        isValid = false;
        document.getElementById(id).style.border = '1px solid red';
        document.getElementById(id).style.color = 'red';
        errorMessages.push(invalidEmail);
        }
    }

    formData.append(id, value); 
    });
    
    // If there are validation errors, display them and do not proceed
    if (!isValid) {
    errorMC.innerHTML = `<p>${redFields}` + '</p><p>' + errorMessages.join('</p>');
    errorMC_view(1)
    gearElement.remove();
    document.getElementById('message').textContent = submitText;
    cmFlag = false;
    scrollTarget.scrollIntoView({ behavior: 'smooth' });
    return;  // Stop here if any error was found
    }
    
    // Otherwise, the form is valid. You can process the form data or submit it.
    form.querySelectorAll('input, textarea').forEach(function(element) {
    element.style.border = '1px solid #ccc'; // Reset border color
    element.style.color = '#000'; // Reset text color
    });          

    formData.append('languageID', languageID); 

    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    let csrfToken = csrf;
    // Configure the request
    xhr.open('POST', '/client-message');
    xhr.setRequestHeader('X-CSRFToken', csrfToken);

    // Define what happens on successful data submission
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            gearElement.remove();
            document.getElementById('message').textContent = submitText;
            // cmFlag = false;
            if (response.status === '1') {
                let content = response.answer;
                errorMC.innerHTML = content;
                errorMC.style.color = 'green';
                
            }
            
            if (response.status === '0') {
                let content = response.answer;
                errorMC.style.color = 'red';
                errorMC.innerHTML = content;
            }
            
            errorMC.classList.remove('hidden');
            errorMC.style.display = 'block';
            scrollTarget.scrollIntoView({ behavior: 'smooth' });

        } 
        cmFlag = false;
    };

    // Define what happens in case of error
    xhr.onerror = function () {
        console.error('Request failed.');
    };

    // Send the request with the JSON data
    xhr.send(formData);
});




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
        const heroButtons = document.querySelectorAll('.hero-buttons a');

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

            // heroButtons[0].href =  window.location.origin + '/buy/' + slideData[index].URL;
            heroButtons[0].href =  slideData[index].URL;
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

// Create the observer to watch sections and update nav links with active class
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
                csrfToken = JSON.parse(xhr.responseText).csrfToken;
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);

                    if (response.status === '1') {
                        // Slide content data

                        totalImages = response.data.length;
                        if (totalImages === 0) {
                            slideData = [
                                    {
                                        "Alt_Text": "",
                                        "IMG": "defauld_bg.png",
                                        "Subtitle": '',
                                        "Subtitle_Color": "rgb(43, 39, 39, 1)",
                                        "Title": newEventsText,
                                        "Title_Color": "rgb(43, 39, 39, 1)",
                                        "URL": "/about"
                                    }
                                ]
                            slideImages.push(slideData[0].IMG);
                            totalImages = 1;
                            // font-family: 'Kurland', cursive, Georgia, 'Times New Roman', Times, serif;
                            document.querySelector('.hero-title').style.fontFamily = "'Kurland', cursive, Georgia, 'Times New Roman', Times, serif";    
                        } else {

                            slideData = response.data
                            
                            response.data.forEach(slide => {
                                slideImages.push(slide.IMG);
                            });
                            
                        }

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

    const services = [{
        "name": "get-activities",
        "target": "activities-grid",
        "RefKey": 1
    }]
    const learnMoreText = document.getElementById('learn-more').value;
    const applyNowText = document.getElementById('apply-now').value;
    function get_services(services, start, limit) {
        services.forEach(service => {
            let formData = new FormData();
            formData.append('RefKey', service.RefKey); 
            formData.append('start', start); 
            formData.append('limit', limit);

            let xhr = new XMLHttpRequest();
            xhr.open('POST', `/` + service.name);
            xhr.setRequestHeader('X-CSRFToken', csrfToken); 
            xhr.onload = function () {
                csrfToken = JSON.parse(xhr.responseText).csrfToken;
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.status === '1') {
                        let targetDiv = document.getElementById(service.target);
                        if (service.target == 'activities-grid') {
                            let cards = "";
                            response.data.forEach(activity => {    
                                const card = document.createElement('div');
                                card.className = "activity-card";
                                
                                // Create the content container
                                const content = document.createElement("div");
                                content.className = "activity-content";
                                
                                // Title
                                const title = document.createElement("h3");
                                title.className = "activity-title";
                                title.textContent = activity.Title;
                                
                                // Description
                                const desc = document.createElement("p");
                                desc.className = "activity-description";
                                desc.textContent = activity.Description;
                                
                                // Buttons container
                                const btnContainer = document.createElement("div");
                                btnContainer.className = "activity-buttons";
                                
                                // Buttons
                                const learnMore = document.createElement("a");
                                learnMore.href = activity.Url;
                                learnMore.className = "btn-text";
                                learnMore.textContent = learnMoreText;
                                
                                // const applyNow = document.createElement("a");
                                // applyNow.href = "#";
                                // applyNow.className = "btn-text";
                                // applyNow.textContent = applyNowText;
                                
                                // Append buttons
                                btnContainer.appendChild(learnMore);
                                // btnContainer.appendChild(applyNow);
                                
                                // Put together content
                                content.appendChild(title);
                                content.appendChild(desc);
                                content.appendChild(btnContainer);
                                
                                // Image
                                const img = document.createElement("img");
                                img.src = window.origin + "/static/images/pr_thumbnails/" + activity.Thumbnail;
                                img.alt = activity.AltText;
                                img.style.width = "100%";
                                
                                // Put everything in the card
                                card.appendChild(content);
                                card.appendChild(img);

                                targetDiv.append(card);
                            });
                        }
                        
                    }
                    
                } else {
                    // Handle error response
                    console.error('Error adding category:', xhr.responseText);
                }
            };
            xhr.send(formData);
        });
    }

    get_services(services, 0, 4);

    document.querySelectorAll('.language-option').forEach(function (opt) {
        opt.addEventListener('click', function () {

        let refKey = '';
        if (document.getElementById('RefKey')) {
            refKey = document.getElementById('RefKey').value;
        }
        window.location.href = '/setlang?lang=' + this.getAttribute('data-lang') + '&RefKey=' + refKey;

        });
    });

    function headerScroll() {
        console.log(scrollTo)
        if (scrollTo) {
    
            let target_to_navigate = document.getElementById(scrollTo);
            if (target_to_navigate) {
                setTimeout(() => {
                    let num = 0;
                    const screenWidth = window.screen.width;
                    if (screenWidth < 801) {
                        num = 10;
                    }
                    
                    // Get the header height
                    const header = document.querySelector('#header');
                    const headerHeight = header ? header.offsetHeight : 0;

                    // Calculate target element's top position relative to the document
                    const targetRect = target_to_navigate.getBoundingClientRect();
                    const scrollTarget = targetRect.top + window.pageYOffset - headerHeight - num;
                    
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }, 1500);
                
                        
                    }
                };

    }
    headerScroll();
});