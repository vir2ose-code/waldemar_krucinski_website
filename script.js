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

  // 4. Newsletter & Contact Form Simulation
  const newsletterForm = document.getElementById('newsletter-form');
  const formFeedback = document.getElementById('form-feedback');

  if (newsletterForm && formFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sub-name').value.trim();
      const email = document.getElementById('sub-email').value.trim();

      if (!name || !email) return;

      formFeedback.className = 'p-4 rounded-xl text-center text-xs font-medium bg-[#928f51]/15 border border-[#928f51]/40 text-[#d6c587] block animate-fade-in';
      formFeedback.innerHTML = `Vielen Dank, <strong>${name}</strong>! Deine Anmeldung (${email}) wurde erfolgreich übermittelt.`;

      newsletterForm.reset();

      setTimeout(() => {
        formFeedback.classList.add('hidden');
      }, 6000);
    });
  }

});
