////////////////////////////////
// PAGE TRANSITION
////////////////////////////////
class Cell {
  constructor(row, column) {
      this.DOM = { el: document.createElement('div') };
      gsap.set(this.DOM.el, { willChange: 'opacity, transform' });
      this.row = row;
      this.column = column;
  }
}

class Overlay {
  constructor(DOM_el, customOptions = {}) {
      this.DOM = { el: DOM_el };
      this.cells = [];
      this.options = Object.assign({}, {
          rows: 10,
          columns: 10,
      }, customOptions);
      this.DOM.el.style.setProperty('--columns', this.options.columns);
      this.cells = new Array(this.options.rows).fill().map((_, i) => {
          return new Array(this.options.columns).fill().map((_, j) => {
              const cell = new Cell(i, j);
              this.DOM.el.appendChild(cell.DOM.el);
              return cell;
          });
      });
  }

  show(customConfig = {}) {
      return new Promise((resolve) => {
          const config = Object.assign({}, {
              transformOrigin: '50% 50%',
              duration: 0.5,
              ease: 'none',
              stagger: {
                  grid: [this.options.rows, this.options.columns],
                  from: 0,
                  each: 0.05,
                  ease: 'none'
              }
          }, customConfig);
          gsap.set(this.DOM.el, { opacity: 1 });
          gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), {
              scale: 0,
              opacity: 0,
              transformOrigin: config.transformOrigin
          }, {
              duration: config.duration,
              ease: config.ease,
              scale: 1.01,
              opacity: 1,
              stagger: config.stagger,
              onComplete: resolve
          });
      });
  }
}

function initPageTransitions() {
  const overlayEl = document.querySelector('.overlay');
  const overlay = new Overlay(overlayEl, { rows: 7, columns: 13 });
  let isAnimating = false;

  document.querySelectorAll('.external-link').forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          if (isAnimating) return;
          isAnimating = true;
          const href = e.currentTarget.getAttribute('href');
          
          overlay.show({
              duration: 0.3,
              ease: 'power1.inOut',
              stagger: {
                  grid: [overlay.options.rows, overlay.options.columns],
                  from: 'end',
                  each: 0.035
              }
          }).then(() => {
              window.location = href;
          });
      });
  });

  window.addEventListener('pageshow', () => {
      gsap.set(overlayEl, { opacity: 0 });
      isAnimating = false;
  });
}


//////////////////////////////////
// MAIN NAV
//////////////////////////////////
function setupMainNav() {
    const mainHeader = document.querySelector('.js-header');
  if (!mainHeader) return;

  const trigger = mainHeader.querySelector('.js-header__trigger');
  const nav = mainHeader.querySelector('.js-header__nav');
  let focusMenu = false;

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    toggleNavigation(!nav.classList.contains('header__nav--is-visible'));
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true' && isVisible(trigger)) {
      focusMenu = trigger;
      trigger.click();
    }

    if (event.key === 'Tab' && trigger.getAttribute('aria-expanded') === 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) {
      trigger.click();
    }
  });

  window.addEventListener('resize', debounce(() => {
    if (!isVisible(trigger) && mainHeader.classList.contains('header--expanded')) {
      toggleNavigation(false);
    }
  }, 500));

  function isVisible(element) {
    return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  }

  function toggleNavigation(bool) {
    nav.classList.toggle('header__nav--is-visible', bool);
    mainHeader.classList.toggle('header--expanded', bool);
    trigger.setAttribute('aria-expanded', bool);
    if (bool) {
      nav.querySelector('[href], input:not([disabled]), button:not([disabled])').focus();
    } else if (focusMenu) {
      focusMenu.focus();
      focusMenu = false;
    }
  }
  
  //closing menu when nav item is clicked
  const menuItems = nav.querySelectorAll('.header__item a'); 
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1023) { // Check if we are in mobile view
        toggleNavigation(false);
      }
    });
  });

  // Event listener for closing the menu when clicking outside
  document.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const withinNav = nav.contains(clickedElement);
    const isTrigger = trigger.contains(clickedElement);

    if (window.innerWidth <= 1023 && !withinNav && !isTrigger && nav.classList.contains('header__nav--is-visible')) {
      toggleNavigation(false);
    }
  });

  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }
}

/////////////////////////
//LOGO ANIMATING IN
/////////////////////////
gsap.to('.logo', {
    duration: 1, 
    opacity: 1, 
    onComplete: () => {
      document.querySelector('.logo').classList.add('loaded');
    }
  });

/////////////////////////////
//HIGHLIGHT TEXT
//////////////////////////
function initHighlightedTextAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  // Find all elements with the class 'highlight-text'
  document.querySelectorAll('.highlight-text').forEach((el) => {
      // Split the text content into individual letters
      const text = el.textContent;
      const letters = text.split("").map(letter => `<span>${letter}</span>`).join("");
      el.innerHTML = letters; 

      // Animate each span
      gsap.to(el.querySelectorAll('span'), {
          scrollTrigger: {
              trigger: el,
              start: "top 80%", 
              end: "bottom 50%",
              scrub: true,
          },
          color: '#ffffff', 
          stagger: 0.03, 
          ease: "none",
      });
  });
}


//////////////////////////////////////////////////
//custom cursor
/////////////////////////////////////////////////
function setupCustomCursor() {
    const customCursor = document.getElementById('custom-cursor');

    // Define a list of colors for the cursor.
    const cursorColors = ['#4169E1', '#6a1b9a', '#ff9100']; // Add more colors as needed

    const showCursor = (event) => {
        let itemIndex = Array.from(document.querySelectorAll('.js-stack-cards__item')).indexOf(event.currentTarget);
        customCursor.style.opacity = 1;
        customCursor.textContent = "Loyihani ko'rish";
        customCursor.style.backgroundColor = cursorColors[itemIndex % cursorColors.length];
        updateCursorPosition(event);
    };

    const hideCursor = () => {
        customCursor.style.opacity = 0;
    };

    const updateCursorPosition = (event) => {
        customCursor.style.left = `${event.clientX}px`;
        customCursor.style.top = `${event.clientY}px`;
    };

    document.querySelectorAll('.js-stack-cards__item').forEach(item => {
        item.addEventListener('mouseenter', showCursor);
        item.addEventListener('mousemove', showCursor);
        item.addEventListener('mouseleave', hideCursor);
    });
}

////////////////////////////////////////////////////////////
//change featured project images
////////////////////////////////////////////////////////////
function setupProjectImageChange() {
    const projectContainers = document.querySelectorAll('.project-container');

    gsap.registerPlugin(ScrollTrigger);

    projectContainers.forEach(container => {
        const oldImage = container.querySelector('.old-image');
        const newImage = container.querySelector('.new-image');
    
        gsap.to(oldImage, {
          scrollTrigger: {
            trigger: container,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              gsap.to(oldImage, { scale: 1.2, opacity: 0, duration: 1, ease: "expo.inOut", delay: 0.7 });
              gsap.to(newImage, { scale: 1, opacity: 1, duration: 1, ease: "expo.inOut", delay: 0.4 });
            },
            onLeaveBack: () => {
              gsap.to(oldImage, { scale: 1, opacity: 1, duration: 1, ease: "expo.inOut" });
              gsap.to(newImage, { scale: 1.4, opacity: 0, duration: 1, ease: "expo.inOut" });
            }
          }
        });
      });
}

////////////////////////////////////////////////////////////
//text animation on featured projects
////////////////////////////////////////////////////////////
function setupTextAnimations() {
    const projectContainers = document.querySelectorAll('.project-container');

    gsap.registerPlugin(ScrollTrigger);

    projectContainers.forEach(container => {
      const trackingExpands = container.querySelectorAll('.tracking-in-expand');
      const textFocuses = container.querySelectorAll('.text-focus-in');

      trackingExpands.forEach(trackingExpand => {
          gsap.to(trackingExpand, {
              scrollTrigger: {
                  trigger: container,
                  start: "top center",
                  onEnter: () => {
                      gsap.to(trackingExpand, { letterSpacing: '0em', opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: "cubic-bezier(0.215, 0.610, 0.355, 1.000)" });
                  },
                  onLeaveBack: () => {
                      gsap.to(trackingExpand, { letterSpacing: '-0.5em', opacity: 0, filter: 'blur(12px)', duration: 0.7, ease: "cubic-bezier(0.215, 0.610, 0.355, 1.000)" });
                  }
              }
          });
      });

      textFocuses.forEach(textFocus => {
          gsap.to(textFocus, {
              scrollTrigger: {
                  trigger: container,
                  start: "top center",
                  onEnter: () => {
                      gsap.to(textFocus, { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: "cubic-bezier(0.550, 0.085, 0.680, 0.530)" });
                  },
                  onLeaveBack: () => {
                      gsap.to(textFocus, { opacity: 0, filter: 'blur(12px)', duration: 0.8, ease: "cubic-bezier(0.550, 0.085, 0.680, 0.530)" });
                  }
              }
          });
      });
  });
}


/////////////////////////////
// ALL PROJECTS
//////////////////////////
function setupProjects() {
  gsap.registerPlugin(ScrollTrigger);

  // Simple ScrollTrigger for demonstration
  document.querySelectorAll('.content--sticky').forEach(section => {
      ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom top',
      });

      // Target the image within the section for a separate animation
      const img = section.querySelector('.content__img--small');
      if (img) {
          gsap.fromTo(img, {
              autoAlpha: 0, 
              y: 50,
          }, {
              autoAlpha: 1, 
              y: 0, 
              duration: 1, 
              ease: 'none', 
              scrollTrigger: {
                  trigger: img, 
                  start: "top bottom", 
                  end: "center center", 
                  scrub: true, 
              }
          });
      }
  });
}

/////////////////////////////
//FOOTER BG COLOR CHANGE
//////////////////////////
function setupFooterColorChange() {
    document.addEventListener('scroll', () => {
        const footer = document.querySelector('.main-footer');
        const aboveFooter = document.querySelector('.above-footer');
        const windowHeight = window.innerHeight;
        const footerRect = footer.getBoundingClientRect();
        const startTransitionPoint = windowHeight + (footerRect.height * 2); // Adjust this value as needed
  
        let opacity = 0;
        if (footerRect.bottom <= startTransitionPoint) {
            // Calculate opacity based on distance of the footer bottom from the start point
            const delta = startTransitionPoint - footerRect.bottom;
            opacity = Math.min(delta / (footerRect.height * 2), 1);
        }
  
        aboveFooter.style.setProperty('--gradient-opacity', opacity);
    });
  }
  
  /////////////////////////////////////////////
  //SCROLL TO TOP
  /////////////////////////////////////////////////
  function setupScrollToTop() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
  
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
  
    const progressBar = document.querySelector('.progress-bar');
    const btnTop = document.querySelector('.btn-top');
    const progressRing = document.querySelector('.progress-ring__circle');
    const circumference = progressRing.r.baseVal.value * 2 * Math.PI;
  
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;
  
    window.addEventListener('scroll', () => {
    let scroll = window.scrollY;
    let height = document.documentElement.scrollHeight - window.innerHeight;
    let scrollPercent = (scroll / height) * 100;
  
    progressBar.style.visibility = scroll > 100 ? 'visible' : 'hidden';
    progressBar.style.opacity = scroll > 100 ? 1 : 0;
  
    const offset = circumference - scrollPercent / 100 * circumference;
    progressRing.style.strokeDashoffset = offset;
    });
  
    btnTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

// Wrap all the initialization in a single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    initPageTransitions();
    setupMainNav();
    initHighlightedTextAnimation();
    setupCustomCursor();
    setupProjectImageChange();
    setupTextAnimations();
    setupProjects();
    setupFooterColorChange();
    setupScrollToTop();
    ScrollTrigger.refresh();

});

