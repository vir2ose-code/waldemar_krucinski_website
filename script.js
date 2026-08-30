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

  // 4. Asynchronous MailerLite Newsletter Submission via Fetch
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Wird übermittelt...';
      }

      const formData = new FormData(newsletterForm);
      const actionUrl = newsletterForm.getAttribute('action');

      const renderSuccessMessage = () => {
        newsletterForm.innerHTML = `
          <div class="p-8 rounded-lg bg-neutral-950/90 border-2 border-[#928f51] text-center shadow-2xl space-y-4 animate-fade-in">
            <div class="w-14 h-14 rounded-full bg-[#928f51]/20 text-[#d6c587] flex items-center justify-center text-2xl mx-auto border border-[#928f51]/60 shadow-lg shadow-[#928f51]/10">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h4 class="font-montserrat font-extrabold text-xl text-neutral-100 gold-metallic-text tracking-tight">
              Vielen Dank für dein Abonnement!
            </h4>
            <p class="text-sm text-neutral-300 font-light leading-relaxed max-w-md mx-auto">
              Bitte prüfe dein E-Mail-Postfach zur Bestätigung.
            </p>
          </div>
        `;
      };

      try {
        await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
        renderSuccessMessage();
      } catch (err) {
        console.warn('Fetch submission notice:', err);
        renderSuccessMessage();
      }
    });
  }

});
