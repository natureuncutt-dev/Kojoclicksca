/**
 * KOJOCLICKS — Main Interactive Script
 * Direction: Whitman x Hovig Hagopian
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initViewSwitcher();
  initFilterTabs();
  initVideoHoverCards();
  initVideoModal();
  initPhotoLightbox();
  initMobileDrawer();
  initBookingForm();
});

/* ==========================================================================
   1. LIVE LOCAL TIME CLOCK (Toronto / Canada)
   ========================================================================== */
function initLiveClock() {
  const clockElement = document.getElementById('liveTime');
  if (!clockElement) return;

  function updateTime() {
    const now = new Date();
    const options = {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    clockElement.textContent = `TORONTO ${timeString} EST`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. VIEW MODE SWITCHER (Grid vs List - Hovig Hagopian Signature)
   ========================================================================== */
function initViewSwitcher() {
  const btnGrid = document.getElementById('viewGridBtn');
  const btnList = document.getElementById('viewListBtn');
  const gridContainer = document.getElementById('projectsGrid');
  const listContainer = document.getElementById('projectsList');

  if (!btnGrid || !btnList || !gridContainer || !listContainer) return;

  btnGrid.addEventListener('click', () => {
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    gridContainer.classList.remove('hidden');
    listContainer.classList.remove('active');
  });

  btnList.addEventListener('click', () => {
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    gridContainer.classList.add('hidden');
    listContainer.classList.add('active');
  });
}

/* ==========================================================================
   3. CATEGORY FILTER TABS
   ========================================================================== */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gridCards = document.querySelectorAll('.project-card');
  const listItems = document.querySelectorAll('.list-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter Grid Cards
      gridCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Filter List Items
      listItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. VIDEO HOVER CARDS (Autoplay muted loop on hover)
   ========================================================================== */
function initVideoHoverCards() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

/* ==========================================================================
   5. FULLSCREEN CINEMA THEATER MODAL
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideoPlayer');
  const modalTitle = document.getElementById('modalTitle');
  const modalCat = document.getElementById('modalCategory');
  const modalMeta = document.getElementById('modalMeta');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || !modalVideo) return;

  function openModal(title, cat, meta, videoSrc) {
    if (modalTitle) modalTitle.textContent = title || 'Selected Project';
    if (modalCat) modalCat.textContent = cat || 'Cinematography';
    if (modalMeta) modalMeta.textContent = meta || 'Directed & Shot by Kojo Adejumo';

    modalVideo.src = videoSrc || 'assets/videos/showreel-preview.mp4';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
  }

  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    document.body.style.overflow = '';
  }

  // Trigger from project cards with data-video
  document.querySelectorAll('[data-video-modal]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const title = trigger.getAttribute('data-title');
      const cat = trigger.getAttribute('data-category-label');
      const meta = trigger.getAttribute('data-meta');
      const videoSrc = trigger.getAttribute('data-video-src');
      openModal(title, cat, meta, videoSrc);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.classList.contains('video-modal-container')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. PHOTO LIGHTBOX
   ========================================================================== */
function initPhotoLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'KOJOCLICKS Photography';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.photo-title');
      const category = card.querySelector('.photo-category');
      const caption = `${title ? title.textContent : ''} — ${category ? category.textContent : ''}`;
      if (img) openLightbox(img.src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggle || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   8. BOOKING & INQUIRY FORM + WHATSAPP DIRECT ACTION
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('projectInquiryForm');
  const whatsappBtn = document.getElementById('directWhatsAppBtn');

  // WhatsApp direct button
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', e => {
      e.preventDefault();
      const message = encodeURIComponent("Hello Kojo! I saw your KOJOCLICKS portfolio and would like to discuss a project with you.");
      window.open(`https://wa.me/1?text=${message}`, '_blank');
    });
  }

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('[name="client_name"]').value.trim();
    const email = form.querySelector('[name="client_email"]').value.trim();
    const phone = form.querySelector('[name="client_phone"]').value.trim();
    const projectType = form.querySelector('[name="project_type"]').value;
    const location = form.querySelector('[name="project_location"]').value.trim();
    const message = form.querySelector('[name="project_message"]').value.trim();

    if (!name || !email) {
      alert('Please provide your name and email address.');
      return;
    }

    // Compose formatted WhatsApp link option
    const inquiryText = `New Inquiry from KOJOCLICKS.ca:
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${projectType}
Location: ${location}
Vision: ${message}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>✓ INQUIRY RECEIVED — REDIRECTING...</span>`;
    submitBtn.style.background = '#22c55e';
    submitBtn.style.color = '#000';

    setTimeout(() => {
      // Offer WhatsApp quick launch or standard confirmation
      const waUrl = `https://wa.me/1?text=${encodeURIComponent(inquiryText)}`;
      const confirmWa = confirm("Thank you, " + name + "! Your project inquiry is ready.\n\nWould you like to send this directly to Kojo on WhatsApp right now?");
      if (confirmWa) {
        window.open(waUrl, '_blank');
      }
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.color = '';
    }, 600);
  });
}
