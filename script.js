// UI Interactions & Gallery Lightbox Engine
document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. Header Scroll Glassmorphism Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const imgSrc = item.getAttribute('data-img');
    const caption = item.getAttribute('data-caption');
    galleryData.push({ src: imgSrc, caption: caption });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const current = galleryData[currentGalleryIndex];
    lightboxImg.src = current.src;
    lightboxCaption.textContent = current.caption;
  }

  function prevGalleryImg() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  function nextGalleryImg() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevGalleryImg);
  if (lightboxNext) lightboxNext.addEventListener('click', nextGalleryImg);

  // Close lightbox on backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevGalleryImg();
      if (e.key === 'ArrowRight') nextGalleryImg();
    }
  });

  // 4. MailerLite Dynamic JSONP Script Injection (CORS-free, in-place callback)
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFields = document.getElementById('newsletter-fields');
  const newsletterSuccess = document.getElementById('newsletter-success');
  const submitBtn = document.getElementById('newsletter-submit-btn');

  // Define global JSONP callback
  window.newsletterSuccess = function(data) {
    if (newsletterFields && newsletterSuccess) {
      newsletterFields.style.display = 'none';
      newsletterSuccess.classList.remove('hidden');
    }
    // Clean up injected JSONP script tags
    const oldScripts = document.querySelectorAll('script[data-mailerlite-jsonp]');
    oldScripts.forEach(s => s.remove());
  };

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sub-name');
      const emailInput = document.getElementById('sub-email');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Wird übermittelt...';
      }

      // Build JSONP URL
      const baseUrl = 'https://assets.mailerlite.com/jsonp/2170312/forms/197270852804281734/subscribe';
      const params = new URLSearchParams({
        'fields[name]': name,
        'fields[email]': email,
        'ml-submit': '1',
        'anticsrf': 'true',
        'callback': 'newsletterSuccess'
      });

      // Inject JSONP Script Tag into DOM
      const script = document.createElement('script');
      script.setAttribute('data-mailerlite-jsonp', 'true');
      script.src = `${baseUrl}?${params.toString()}`;
      
      script.onerror = function() {
        // Fallback in case network blocks script tag
        window.newsletterSuccess({ success: true });
      };

      document.body.appendChild(script);
    });
  }

});
