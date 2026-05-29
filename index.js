

document.addEventListener('DOMContentLoaded', () => {

  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.dataset.tab;
      const content = document.getElementById(`tab-${target}`);
      if (content) content.classList.add('active');
    });
  });



  const hamburger = document.getElementById('hamburgerBtn');
  const mainNav   = document.getElementById('mainNav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }


  
  const pickupDateInput = document.getElementById('pickupDate');
  const returnDateInput = document.getElementById('returnDate');

  if (pickupDateInput && returnDateInput) {
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const fmt = d => d.toISOString().split('T')[0];
    pickupDateInput.value = fmt(today);
    pickupDateInput.min   = fmt(today);
    returnDateInput.value = fmt(tomorrow);
    returnDateInput.min   = fmt(tomorrow);

    
    pickupDateInput.addEventListener('change', () => {
      const pickup = new Date(pickupDateInput.value);
      const ret    = new Date(returnDateInput.value);
      if (ret <= pickup) {
        const next = new Date(pickup);
        next.setDate(pickup.getDate() + 1);
        returnDateInput.value = fmt(next);
      }
      returnDateInput.min = pickupDateInput.value;
    });
  }



  const LOCATIONS = [
    'New York, NY – JFK Airport',
    'New York, NY – LaGuardia Airport',
    'Los Angeles, CA – LAX Airport',
    'Los Angeles, CA – Downtown',
    'Chicago, IL – O\'Hare Airport',
    'Chicago, IL – Midway Airport',
    'Miami, FL – International Airport',
    'Miami, FL – South Beach',
    'San Francisco, CA – SFO Airport',
    'Las Vegas, NV – McCarran Airport',
    'Dallas, TX – DFW Airport',
    'Atlanta, GA – Hartsfield Airport',
    'Seattle, WA – Sea-Tac Airport',
    'Boston, MA – Logan Airport',
    'Orlando, FL – International Airport',
    'Denver, CO – International Airport',
    'Phoenix, AZ – Sky Harbor Airport',
    'Washington, DC – Dulles Airport',
    'Houston, TX – Hobby Airport',
    'Nashville, TN – International Airport',
  ];

  const locationInput    = document.getElementById('location');
  const autocompleteList = document.getElementById('autocompleteList');

  function renderSuggestions(query) {
    if (!autocompleteList) return;
    autocompleteList.innerHTML = '';
    if (!query.trim()) {
      autocompleteList.classList.remove('open');
      return;
    }
    const matches = LOCATIONS.filter(loc =>
      loc.toLowerCase().includes(query.toLowerCase())
    );
    if (!matches.length) {
      autocompleteList.classList.remove('open');
      return;
    }
    const ul = document.createElement('ul');
    matches.forEach(loc => {
      const li = document.createElement('li');
      // Highlight matching part
      const idx  = loc.toLowerCase().indexOf(query.toLowerCase());
      const before = loc.slice(0, idx);
      const match  = loc.slice(idx, idx + query.length);
      const after  = loc.slice(idx + query.length);
      li.innerHTML = `${before}<strong>${match}</strong>${after}`;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent input blur first
        locationInput.value = loc;
        autocompleteList.classList.remove('open');
      });
      ul.appendChild(li);
    });
    autocompleteList.appendChild(ul);
    autocompleteList.classList.add('open');
  }

  if (locationInput) {
    locationInput.addEventListener('input', () => renderSuggestions(locationInput.value));
    locationInput.addEventListener('focus', () => renderSuggestions(locationInput.value));
    locationInput.addEventListener('blur', () => {
      setTimeout(() => autocompleteList.classList.remove('open'), 150);
    });
  }

  const diffReturn      = document.getElementById('diffReturn');
  const diffReturnGroup = document.getElementById('diffReturnGroup');

  if (diffReturn && diffReturnGroup) {
    diffReturn.addEventListener('change', () => {
      diffReturnGroup.style.display = diffReturn.checked ? 'flex' : 'none';
    });
  }

  const bookingForm  = document.getElementById('bookingForm');
  const searchModal  = document.getElementById('searchModal');
  const modalClose   = document.getElementById('modalClose');
  const modalMsg     = document.getElementById('modalMsg');

  function openModal(msg = 'Please wait while we find the best deals for you.') {
    if (!searchModal) return;
    modalMsg.textContent = msg;
    searchModal.classList.add('open');
  }

  function closeModal() {
    if (!searchModal) return;
    searchModal.classList.remove('open');
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const loc     = locationInput ? locationInput.value.trim() : '';
      const pickup  = pickupDateInput ? pickupDateInput.value : '';
      const ret     = returnDateInput ? returnDateInput.value : '';

      if (!loc) {
        shakeInput(locationInput);
        locationInput.focus();
        return;
      }
      if (!pickup) {
        shakeInput(pickupDateInput);
        return;
      }
      if (!ret) {
        shakeInput(returnDateInput);
        return;
      }

      openModal(`Searching cars in "${loc}" from ${formatDate(pickup)} to ${formatDate(ret)}…`);

      // Simulate async search — reset after 3 seconds
      setTimeout(closeModal, 3000);
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeModal();
    });
  }
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function shakeInput(el) {
    if (!el) return;
    el.style.transition = 'transform 0.08s ease';
    const moves = [6, -6, 5, -5, 3, -3, 0];
    let i = 0;
    const shake = () => {
      if (i < moves.length) {
        el.style.transform = `translateX(${moves[i]}px)`;
        i++;
        setTimeout(shake, 60);
      } else {
        el.style.transform = '';
      }
    };
    el.style.borderColor = '#e53e3e';
    shake();
    setTimeout(() => { el.style.borderColor = ''; }, 800);
  }

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  document.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', () => {
      const city = card.querySelector('strong')?.textContent || '';
      if (locationInput) locationInput.value = city;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Flash the booking card
      const bookingCard = document.querySelector('.booking-card');
      if (bookingCard) {
        bookingCard.style.outline = '2.5px solid var(--hertz-yellow)';
        setTimeout(() => { bookingCard.style.outline = ''; }, 1200);
      }
    });
  });

  const revealTargets = document.querySelectorAll('.feature-card, .dest-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      observer.observe(el);
    });
  }

  const topNav = document.querySelector('.top-nav');
  window.addEventListener('scroll', () => {
    if (!topNav) return;
    if (window.scrollY > 10) {
      topNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.14)';
    } else {
      topNav.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
    }
  }, { passive: true });

});