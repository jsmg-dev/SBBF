// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Close mobile menu when clicking on backdrop
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields (check for empty strings and whitespace)
            if (!data.name || !data.name.trim() || !data.email || !data.email.trim() || !data.message || !data.message.trim()) {
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Send message to phone and email
            sendMessage(data);
            
            // Reset button immediately
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log form data
            console.log('Contact form submitted:', data);
        });
    }
});

// Function to send message to phone and email
function sendMessage(formData) {
    const phoneNumber = '9166010400';
    const email = 'jiten.seng@gmail.com';
    
    try {
        // Format the message
        const message = formatMessage(formData);
        
        // Send WhatsApp message
        sendWhatsAppMessage(phoneNumber, message);
        
        // Send email
        sendEmail(email, formData);
        
        // Log the action
        console.log('Message sent to:', { phone: phoneNumber, email: email });
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('There was an error sending the message. Please try again.', 'error');
    }
}

// Function to format the message for WhatsApp
function formatMessage(data) {
    let message = `*New Contact Form Submission*\n\n`;
    message += `*Name:* ${data.name}\n`;
    message += `*Email:* ${data.email}\n\n`;
    message += `*Message:*\n${data.message}\n\n`;
    
    return encodeURIComponent(message);
}

// Function to send WhatsApp message
function sendWhatsAppMessage(phoneNumber, message) {
    try {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Open WhatsApp in new tab/window
        const whatsappWindow = window.open(whatsappUrl, '_blank');
        
        if (whatsappWindow) {
            console.log('WhatsApp message sent to:', phoneNumber);
        } else {
            console.error('Failed to open WhatsApp window');
            showNotification('Please allow popups to send WhatsApp message.', 'error');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

// Function to send email
function sendEmail(email, data) {
    try {
        const subject = encodeURIComponent(`New Contact Form Submission - ${data.name}`);
        const body = formatEmailBody(data);
        
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
        
        // Create a temporary link and click it
        const emailLink = document.createElement('a');
        emailLink.href = mailtoUrl;
        emailLink.style.display = 'none';
        document.body.appendChild(emailLink);
        emailLink.click();
        document.body.removeChild(emailLink);
        
        console.log('Email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Function to format email body
function formatEmailBody(data) {
    let body = `New Contact Form Submission\n\n`;
    body += `Name: ${data.name}\n`;
    body += `Email: ${data.email}\n\n`;
    body += `Message:\n${data.message}\n\n`;
    body += `---\nThis message was sent from the SBB Foundation website contact form.`;
    
    return body;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
            border-radius: 4px;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Test function to verify message sending
function testMessageSending() {
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message to verify the contact form functionality.'
    };
    
    console.log('Testing message sending with data:', testData);
    sendMessage(testData);
}

// Make test function available globally for debugging
window.testMessageSending = testMessageSending;

// Simple test function to check form validation
function testFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Form found:', contactForm);
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        console.log('Current form data:', data);
        
        // Test with sample data
        document.getElementById('name').value = 'Test User';
        document.getElementById('email').value = 'test@example.com';
        document.getElementById('message').value = 'This is a test message.';
        
        console.log('Form filled with test data');
        return true;
    } else {
        console.log('Form not found!');
        return false;
    }
}

window.testFormValidation = testFormValidation;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Force show the target section on mobile
            forceShowSection(target.id);
            
            // Small delay to ensure section is visible before scrolling
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.about-card, .solution-card, .portfolio-item, .career-card, .contact-form, .contact-item');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Parallax effect for hero floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 150);
    }
    
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add a subtle entrance animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
});

// Counter animation for metrics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '%';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '%';
        }
    }
    
    updateCounter();
}

// Observe metrics for counter animation
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metric = entry.target;
            const text = metric.textContent;
            const number = parseInt(text.match(/\d+/)[0]);
            animateCounter(metric, number);
            metricsObserver.unobserve(metric);
        }
    });
});

// Add counter animation to metrics
document.querySelectorAll('.metric').forEach(metric => {
    if (metric.textContent.includes('%')) {
        metricsObserver.observe(metric);
    }
});

// Add hover effects to cards
document.querySelectorAll('.solution-card, .about-card, .career-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Apply reveal animation to sections (disable on mobile for better performance)
document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'home' && window.innerWidth > 768) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        sectionObserver.observe(section);
    }
});

// Function to force show a section on mobile
function forceShowSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && window.innerWidth <= 768) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.visibility = 'visible';
        section.style.display = 'block';
        section.style.transition = 'none';
    }
}

// Handle window resize to ensure mobile sections stay visible
window.addEventListener('resize', () => {
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'home' && window.innerWidth <= 768) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'none';
        }
    });
});

// Add active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Gallery Carousel Functionality

// Image Modal Functions
function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modal.style.display = 'block';
    modalImage.src = imageSrc;
    modalCaption.textContent = caption;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
document.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeImageModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const carouselTabs = document.querySelectorAll('.gallery-carousel-tab');
    const carouselContainers = document.querySelectorAll('.carousel-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let autoSlideInterval;
    let currentCarousel = document.querySelector('.carousel-container.active');
    
    // Tab Switching
    carouselTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and containers
            carouselTabs.forEach(t => t.classList.remove('active'));
            carouselContainers.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding carousel
            const tabName = tab.getAttribute('data-tab');
            const targetCarousel = document.getElementById(`${tabName}-carousel`);
            if (targetCarousel) {
                targetCarousel.classList.add('active');
                currentCarousel = targetCarousel;
                currentIndex = 0;
                updateCarousel();
                resetAutoSlide();
            }
        });
    });
    
    // Update Carousel Position
    function updateCarousel() {
        const track = currentCarousel.querySelector('.carousel-track');
        const slides = currentCarousel.querySelectorAll('.carousel-slide');
        const slideWidth = slides[0].offsetWidth;
        const gap = 20;
        const offset = -(currentIndex * (slideWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
    }
    
    // Next Button
    nextBtn.addEventListener('click', () => {
        const slides = currentCarousel.querySelectorAll('.carousel-slide');
        const maxIndex = slides.length - getVisibleSlides();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
            resetAutoSlide();
        }
    });
    
    // Previous Button
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoSlide();
        }
    });
    
    // Get number of visible slides based on screen width
    function getVisibleSlides() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 4;
    }
    
    // Auto Slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const slides = currentCarousel.querySelectorAll('.carousel-slide');
            const maxIndex = slides.length - getVisibleSlides();
            
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        }, 3000); // Slide every 3 seconds
    }
    
    // Reset Auto Slide
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause auto slide on hover
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carouselWrapper.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Update carousel on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Initial update
    updateCarousel();
});
