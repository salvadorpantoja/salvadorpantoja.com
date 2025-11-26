
function setupMobileMenu(buttonId, menuId, openIconId, closeIconId) {
  const menuButton = document.getElementById(buttonId);
  const mobileMenu = document.getElementById(menuId);
  const iconOpen = document.getElementById(openIconId);
  const iconClose = document.getElementById(closeIconId);

  if (menuButton && mobileMenu && iconOpen && iconClose) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isOpen);
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
      menuButton.setAttribute('aria-expanded', isOpen.toString());
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function setDynamicYear(elementId) {
    const copyrightElement = document.getElementById(elementId);
    if (copyrightElement) {
        copyrightElement.innerHTML = `&copy; ${new Date().getFullYear()} Salvador Pantoja. All rights reserved.`;
    }
}

function setupProjectCarousel() {
    const CARDS_PER_SLIDE = 4;
    const originalCardsContainer = document.getElementById('original-project-cards');
    const slidesWrapper = document.getElementById('project-slides-wrapper');
    const prevButton = document.getElementById('prev-project-slide');
    const nextButton = document.getElementById('next-project-slide');
    const indicatorsContainer = document.getElementById('project-slide-indicators');
    const carouselMainContainer = document.getElementById('project-carousel-container');

    if (!originalCardsContainer || !slidesWrapper || !prevButton || !nextButton || !indicatorsContainer || !carouselMainContainer) {
        console.warn('Carousel elements not found. Skipping setup.');
        if(carouselMainContainer) carouselMainContainer.classList.add('hidden'); // Hide if essential parts missing
        return;
    }

    const projectCards = Array.from(originalCardsContainer.children);
    
    if (projectCards.length === 0) {
        carouselMainContainer.classList.add('hidden'); // Hide carousel if no projects
        originalCardsContainer.remove(); 
        return;
    }

    let slides = [];
    let currentIndex = 0;

    // Create slides
    for (let i = 0; i < projectCards.length; i += CARDS_PER_SLIDE) {
        const slide = document.createElement('div');
        slide.className = 'project-slide hidden opacity-0 transition-opacity duration-500 ease-in-out grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch p-1';
        
        const chunk = projectCards.slice(i, i + CARDS_PER_SLIDE);
        chunk.forEach(cardHTML => {
            const cardClone = cardHTML.cloneNode(true);
            cardClone.classList.remove('hover:scale-105', 'transition-transform', 'duration-300'); // Remove individual hover zoom
            // Ensure cards take full height within the grid cell by being flex containers themselves
            cardClone.classList.add('flex', 'flex-col'); 
            slide.appendChild(cardClone);
        });
        slidesWrapper.appendChild(slide);
        slides.push(slide);
    }
    originalCardsContainer.remove(); // Remove the original container after processing

    // Create indicators
    if (slides.length > 1) { // Only show indicators if there's more than one slide
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.setAttribute('aria-label', `Go to slide ${index + 1}`);
            button.className = 'indicator w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-red-400';
            button.addEventListener('click', () => {
                showSlide(index);
            });
            indicatorsContainer.appendChild(button);
        });
    }


    function updateIndicators() {
        if (slides.length <= 1) {
            indicatorsContainer.classList.add('hidden');
            return;
        }
        indicatorsContainer.classList.remove('hidden');
        const indicators = indicatorsContainer.children;
        Array.from(indicators).forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('bg-red-500');
                indicator.classList.remove('bg-neutral-600', 'hover:bg-neutral-500');
            } else {
                indicator.classList.remove('bg-red-500');
                indicator.classList.add('bg-neutral-600', 'hover:bg-neutral-500');
            }
        });
    }
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden', 'opacity-0');
                slide.classList.add('opacity-100');
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.classList.add('hidden', 'opacity-0'); // 'hidden' sets display:none
                slide.classList.remove('opacity-100');
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        currentIndex = index;
        updateControls();
        updateIndicators();
    }

    function updateControls() {
        if (slides.length <= 1) {
            prevButton.classList.add('hidden');
            nextButton.classList.add('hidden');
            indicatorsContainer.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
            nextButton.classList.remove('hidden');
            // No need to disable, it will loop
            // prevButton.disabled = currentIndex === 0; // For non-looping
            // nextButton.disabled = currentIndex === slides.length - 1; // For non-looping
        }
    }

    prevButton.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1; // Loop to last slide
        }
        showSlide(newIndex);
    });

    nextButton.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0; // Loop to first slide
        }
        showSlide(newIndex);
    });

    if (slides.length > 0) {
        showSlide(0); // Initialize first slide
    } else {
        carouselMainContainer.classList.add('hidden'); // Ensure hidden if no slides generated
    }
}

function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-submission-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill out all fields.';
        formStatus.style.color = 'rgb(239 68 68)'; // red-500
        return;
      }
      
      const mailtoEmail = 'info@salvadorpantoja.com';
      const mailtoSubject = encodeURIComponent(subject);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      const mailtoLink = `mailto:${mailtoEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      try {
        window.location.href = mailtoLink;
        formStatus.textContent = 'Your email client should open. Please send the message from there.';
        formStatus.style.color = 'rgb(34 197 94)'; // green-500
        contactForm.reset(); // Clear the form
      } catch (error) {
        console.error('Failed to open mailto link:', error);
        formStatus.textContent = 'Could not open email client. Please copy details manually.';
        formStatus.style.color = 'rgb(239 68 68)'; // red-500
      }
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu('mobile-menu-button', 'mobile-menu', 'icon-open', 'icon-close');
  setDynamicYear('footer-copyright');
  setupProjectCarousel();
  setupContactForm();

  setupMobileMenu('mobile-menu-button-template', 'mobile-menu-template', 'icon-open-template', 'icon-close-template');
  setDynamicYear('footer-copyright-template');
});
