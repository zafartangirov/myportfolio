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
//PANELS
/////////////////////////////
  // gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

	// 	let panelsSection = document.querySelector("#panels"),
	// 		panelsContainer = document.querySelector("#panels-container"),
	// 		tween;
	// 	document.querySelectorAll(".anchor").forEach(anchor => {
	// 		anchor.addEventListener("click", function (e) {
	// 			e.preventDefault();
	// 			let targetElem = document.querySelector(e.target.getAttribute("href")),
	// 				y = targetElem;
	// 			if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
	// 				let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
	// 					totalMovement = (panels.length - 1) * targetElem.offsetWidth;
	// 				y = Math.round(tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
	// 			}
	// 			gsap.to(window, {
	// 				scrollTo: {
	// 					y: y,
	// 					autoKill: false
	// 				},
	// 				duration: 1
	// 			});
	// 		});
	// 	});

	// 	/* Panels */
	// 	const panels = gsap.utils.toArray("#panels-container .panel");
	// 	tween = gsap.to(panels, {
	// 		xPercent: -100 * (panels.length - 1),
	// 		ease: "none",
	// 		scrollTrigger: {
	// 			trigger: "#panels-container",
	// 			pin: true,
	// 			start: "top top",
	// 			scrub: 1,
	// 			snap: {
	// 				snapTo: 1 / (panels.length - 1),
	// 				inertia: false,
	// 				duration: { min: 0.1, max: 0.1 }
	// 			},
	// 			end: () => "+=" + (panelsContainer.offsetWidth - innerWidth)
	// 		}
	// 	});


  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

let panelsSection = document.querySelector("#panels"),
    panelsContainer = document.querySelector("#panels-container"),
    tween;

document.querySelectorAll(".anchor").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        let targetElem = document.querySelector(e.target.getAttribute("href")),
            y = targetElem;
        if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
            let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
                totalMovement = (panels.length - 1) * targetElem.offsetWidth;
            y = Math.round(tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
        }
        gsap.to(window, {
            scrollTo: {
                y: y,
                autoKill: false
            },
            duration: 1
        });
    });
});

/* Panels */
const panels = gsap.utils.toArray("#panels-container .panel");
tween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: "#panels-container",
        pin: true,
        start: "top top",
        scrub: 1,
        snap: {
            snapTo: (value) => {
                let snapPoints = 1 / (panels.length - 1);
                return Math.round(value / snapPoints) * snapPoints;
            },
            duration: { min: 0.5, max: 1.5 },  // Increased duration for smoother snapping
            inertia: true
        },
        end: () => "+=" + (panelsContainer.offsetWidth - innerWidth)
    }
});

/////////////////////////////
//IMAGE SCALING BIGGER
/////////////////////////////
function initializeAnimations() {
  gsap.registerPlugin(ScrollTrigger, Flip);

  class ExpandImageEffect {
      constructor(el) {
          if (!el || !(el instanceof HTMLElement)) {
              throw new Error('Invalid element provided.');
          }

          this.wrapElement = el;
          this.image = this.wrapElement.querySelector('.type__expand-img');
          this.textBlock = this.wrapElement.nextElementSibling;
          this.initializeEffect();
      }

      initializeEffect() {
          this.scroll();
      }

      scroll() {
          this.wrapElement.classList.add('type--open');
          const flipstate = Flip.getState(this.image);
          this.wrapElement.classList.remove('type--open');

          Flip.to(flipstate, {
              ease: 'sine',
              simple: true,
              scrollTrigger: {
                  trigger: this.wrapElement,
                  start: 'center bottom',
                  end: 'center top',
                  scrub: true,
              }
          })
          .fromTo(this.textBlock, {
              lineHeight: 1.2,
              willChange: 'line-height'
          }, {
              ease: 'sine.inOut',
              yPercent: -40,
              skewX: -2,
              lineHeight: 2,
              opacity: 0.2,
              scrollTrigger: {
                  trigger: this.textBlock,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true
              }
          }, 0)
      }
  }

  document.querySelectorAll('[data-expand-3]').forEach(el => {
      new ExpandImageEffect(el);
  });
}    

/////////////////////////////
//TEXT ANINATION
/////////////////////////////
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.hx').forEach((element) => {
    let words = element.innerText.split(' ');
    element.innerHTML = words.map(word => 
        `<span class="word">${word.split('').map(char => 
            `<span class="char">${char}</span>`).join('')}</span>`
    ).join(' ');
});

class HighlightEffect {
    constructor(el) {
        this.el = el;
        this.chars = el.querySelectorAll('.char');
        this.timeline = this.createTimeline();
    }

    createTimeline() {
        const timeline = gsap.timeline({
            paused: true,  // Start paused so it only plays on hover
            defaults: { duration: 0.1 }  
        });

        // Animation for changing to the first color
        timeline.to(this.chars, {
            stagger: 0.01,
            color: getComputedStyle(this.el).getPropertyValue('--color-highlight-end'),
            ease: 'power2.out'
        });

        // Animation for changing to the second color and scaling up
        timeline.to(this.chars, {
            stagger: 0.01,
            color: getComputedStyle(this.el).getPropertyValue('--color-highlight-end-alt'),
            scale: 2,
            ease: 'power2.in',
            duration: 0.05
        });

        // Immediately start scaling back to normal size
        timeline.to(this.chars, {
            stagger: 0.01,
            scale: 1,
            ease: 'power2.out',
            duration: 0.05
        });

        return timeline;
    }
}

// Attach hover handlers to the <a> tag that contains .hx-4 elements
document.querySelectorAll('a.role').forEach(a => {
    const hxElement = a.querySelector('.hx-4');
    if (!hxElement) return;
    
    const highlightEffect = new HighlightEffect(hxElement);

    a.addEventListener('mouseenter', () => {
        highlightEffect.timeline.play();
    });

    a.addEventListener('mouseleave', () => {
        highlightEffect.timeline.reverse();
    });
});

/////////////////////////////
//REVEAL IMAGE
/////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
  class HoverImgFx8 {
      constructor(el) {
          this.DOM = {el: el};
          this.DOM.reveal = document.createElement('div');
          this.DOM.reveal.className = 'hover-reveal';
          this.DOM.reveal.innerHTML = `<div class="hover-reveal__deco"></div><div class="hover-reveal__inner"><div class="hover-reveal__img" style="background-image:url(${this.DOM.el.dataset.img})"></div></div>`;
          this.DOM.el.appendChild(this.DOM.reveal);
          this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
          this.DOM.revealInner.style.overflow = 'hidden';
          this.DOM.revealDeco = this.DOM.reveal.querySelector('.hover-reveal__deco');
          this.DOM.revealImg = this.DOM.reveal.querySelector('.hover-reveal__img');
          this.initEvents();
      }
      initEvents() {
          this.positionElement = (ev) => {
              const mousePos = this.getMousePos(ev);
              const docScrolls = {
                  left: document.body.scrollLeft + document.documentElement.scrollLeft,
                  top: document.body.scrollTop + document.documentElement.scrollTop
              };
              this.DOM.reveal.style.top = `${mousePos.y + 20 - docScrolls.top}px`;
              this.DOM.reveal.style.left = `${mousePos.x + 20 - docScrolls.left}px`;
          };
          this.mouseenterFn = (ev) => {
              this.positionElement(ev);
              this.showImage();
          };
          this.mousemoveFn = ev => requestAnimationFrame(() => {
              this.positionElement(ev);
          });
          this.mouseleaveFn = () => {
              this.hideImage();
          };

          this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
          this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
          this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
      }
      showImage() {
          gsap.killTweensOf([this.DOM.revealInner, this.DOM.revealImg, this.DOM.revealDeco]);
          gsap.set(this.DOM.el, { zIndex: 1000 });
          gsap.set(this.DOM.reveal, { opacity: 1 });
          gsap.fromTo(this.DOM.revealDeco, { x: '15%', y: '50%', scaleY: 3, opacity: 0 },
              { duration: 0.6, ease: "power3.inOut", scaleY: 1, opacity: 1, y: '-15%' });
          gsap.fromTo(this.DOM.revealInner, { y: '100%', rotation: 3, opacity: 0 },
              { duration: 0.8, ease: "power3.out", rotation: 0, y: '0%', opacity: 1, delay: 0.4 });
          gsap.fromTo(this.DOM.revealImg, { scale: 1.4 },
              { duration: 1.3, ease: "power3.out", scale: 1, delay: 0.4 });
      }
      hideImage() {
          gsap.to([this.DOM.revealDeco, this.DOM.revealInner], {
              duration: 0.2, ease: "power3.in", opacity: 0, onComplete: () => {
                  gsap.set(this.DOM.el, { zIndex: 999 });
                  gsap.set(this.DOM.reveal, { opacity: 0 });
              }
          });
      }
      getMousePos(e) {
          let posx = 0;
          let posy = 0;
          if (!e) e = window.event;
          if (e.pageX || e.pageY) {
              posx = e.pageX;
              posy = e.pageY;
          } else if (e.clientX || e.clientY) {
              posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
              posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
          }
          return { x: posx, y: posy }
      }
  }

  document.querySelectorAll('[data-fx="8"] > a, a[data-fx="8"]').forEach(link => new HoverImgFx8(link));
});


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
  initializeAnimations();
  initHighlightedTextAnimation();
  setupFooterColorChange();
  setupScrollToTop();

});
