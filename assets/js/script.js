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
        if (window.innerWidth <= 1023) { // Checks if in mobile view
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
  

  //////////////////////////////////////////////////
  //h1 growing in size, color changes to background
  ///////////////////////////////////////////////////
  function setupScrollTriggerAnimations() {
    
    gsap.registerPlugin(ScrollTrigger);
  
    // Check if viewport width is under 930px
    if (window.innerWidth < 930) {
      // Exit the function without setting up animations
      console.log("Viewport width is under 930px, skipping animations.");
      return;
    }

    // Your existing code for setting up animations goes here
    let triggerElement = document.querySelector('.section');
    let projectTitle = document.querySelector('.project__title');
    let projectLabelMission = document.querySelector('.project__label--mission'); 
    

    let colorChangeTimeline = gsap.timeline({paused: true})
      .to(triggerElement, {backgroundColor: '#4169E1', duration: 1}, "<0%")
      .to(triggerElement, {backgroundColor: '#00FFFF', duration: 2}, "<20%")
      .to(triggerElement, {backgroundColor: '#2A52BE', duration: 2}, "<40%")    
      .to(triggerElement, {backgroundColor: '#4169E1', duration: 2}, "<60%")
      .to(triggerElement, {backgroundColor: '#2A52BE', duration: 2}, "<80%");  

    // Scroll-triggered timeline
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: triggerElement,
            start: 'top top',
            end: '100%',
            scrub: 1,
            pin: true,
            onEnter: () => {
                // Ensure the color changing doesn't start too early; pause it initially
                colorChangeTimeline.pause();
            },
            onLeave: () => {
              // When leaving the section, resume the color change
              colorChangeTimeline.resume();
          },
          onEnterBack: () => {
              // When entering back, pause the color change
              colorChangeTimeline.pause();
          },
          onLeaveBack: () => {
            // Smoothly transition back to the original background color when scrolling back up
            colorChangeTimeline.pause();
            gsap.to(triggerElement, {backgroundColor: 'transparent', duration: 2}); 
          }
        }
    });

    // Animation for the center message opacity
    tl.fromTo('.center-message', {
          opacity: 0
      }, {
          opacity: 1, 
          duration: 1,
          onStart: () => {
              // Start the color change slightly before the message fades in
              colorChangeTimeline.resume();
          },
          onReverseComplete: () => {
              // If scrolling back before the message fully appears, pause and reset the color animation
              colorChangeTimeline.pause(0);
          }
      })
      
      // Now, immediately after the above animation, add the color transition for .text-fill
      .to('.text-fill', {
          color: '#00BFFF', 
          duration: 1, 
          ease: "none"
      }, "-=0.5");

    // Reset color on initial load
    gsap.to(triggerElement, {backgroundColor: 'transparent', duration: 2});
  

    // Your existing timeline setup for animations
    tl.to(projectLabelMission, {
      rotation: -37,
      transformOrigin: "left top",
      ease: "back.out(1.7)",
      duration: 0.5,
      y: () => window.innerHeight,
      opacity: 0,
    }, '-=2.5');
   
    if (window.innerWidth > 930) {
      tl.to(projectTitle, {
          scale: 90, // Scale was 100
          ease: "none",
          transformOrigin: "50% 45%",
          duration: 2
      }, "<") // Start immediately and scale up
  
      .to(projectTitle, {
          opacity: 0,
          ease: "none",
          duration: 1 
      }, "<50%"); // Start the opacity change at the halfway point of the scaling animation
    }

  }


  //////////////////////////////////////////////////
  //animation for brackets rotating and alternating
  /////////////////////////////////////////////////
  function setupBraketsAnimation() {
      var brakets = document.querySelector('.brakets');
      var symbols = ['{ }', '</>'];
      var currentSymbol = 0;
  
      function animateBrackets() {
          var tl = gsap.timeline();
  
          tl.to(brakets, {
              rotation: 360,
              duration: 2,
              ease: 'bounce.out'
          })
          .to(brakets, {
              y: 50,
              opacity: 0,
              duration: 0.5,
              onComplete: changeSymbol 
          })
          .set(brakets, {
              y: -50,
              rotation: 0 // Reset rotation
          })
          .to(brakets, {
              y: 0,
              opacity: 1,
              duration: 0.5
          });
      }
  
      function changeSymbol() {
          brakets.textContent = symbols[currentSymbol];
          currentSymbol = (currentSymbol + 1) % symbols.length;
      }
  
      animateBrackets();
      setInterval(animateBrackets, 5000);
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


//////////////////////
//STACKING GALLERY
/////////////////////
const initGalleryAnimation = () => {
    const galleryItems = document.querySelectorAll('.gallery__item');
    const caption = document.querySelector('.caption');
    const numItems = galleryItems.length - 1; 

    // ScrollTrigger for the gallery container
    ScrollTrigger.create({
        trigger: "#scrollContainer",
        start: "top top+=10vh", // Changed start to 10vh from the top of the viewport was  "top top",
        end: () => `+=${window.innerHeight * numItems}`,
        scrub: true,
        pin: true,
        anticipatePin: 1
    });

    // Animate gallery items
    for (let i = 1; i < galleryItems.length; i++) {
        gsap.to(galleryItems[i], {
            x: () => `-${i * 100}%`, 
            ease: "none",
            scrollTrigger: {
                trigger: "#scrollContainer",
                start: "top top+=10vh", // Adjusted start position
                end: () => `+=${window.innerHeight * numItems}`,
                scrub: true
            },
        });
    }

    // Animate caption
    gsap.fromTo(caption, 
        { 
            x: '100vw', 
            opacity: 0 
        }, 
        { 
            // x: () => `-${numItems * 100}% + 30px`, 
            x: () => `-${numItems * 100}% + 10px`, 
            opacity: 1, 
            ease: "none",
            scrollTrigger: {
                trigger: "#scrollContainer",
                start: "top top+=10vh", // Adjusted start position for the caption as well
                end: () => `+=${window.innerHeight * numItems}`,
                scrub: true
            },
        }
    );
    

  // Handling touch events for smoother mobile interaction
  let startY = 0;
  let isTouching = false;
  document.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
      isTouching = true;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
      if (!isTouching) return;
  }, { passive: true });

  document.addEventListener('touchend', function() {
      isTouching = false;
  });
};



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

//////////////////////
//HIGHLIGHT TEXT
/////////////////////
function initHighlightedTextAnimation() {
    gsap.registerPlugin(ScrollTrigger);
  
    document.querySelectorAll('.highlight-text').forEach((el) => {
        const words = el.textContent.trim().split(/\s+/); // Improved splitting to handle multiple spaces
        el.innerHTML = words.map(word => `<span>${word.split('').join('</span><span>')}</span>`).join(' ');

        gsap.to(el.querySelectorAll('span'), {
            scrollTrigger: {
                trigger: el,
                start: "center bottom",
                end: "center top",
                scrub: true
            },
            color: '#ffffff', 
            stagger: 0.1,
            ease: 'none'
        });
    });
}


//////////////////////
//ANIMATED BOXES
/////////////////////
const initBoxesAnimation = () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('#whyMe .box').forEach((box, i) => {
        gsap.fromTo(box,
            { x: '100vw', autoAlpha: 0 }, 
            {
                x: 0, 
                autoAlpha: 1, 
                duration: 0.5, 
                ease: "back.out(1.7)", 
                scrollTrigger: {
                    trigger: box, 
                    start: "top 80%", 
                    toggleActions: 'play none none reverse', 
                }
            }
        );
    });
};
  
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
      setupScrollTriggerAnimations();
      setupBraketsAnimation();
      setupCustomCursor();
      setupProjectImageChange();
      setupTextAnimations();
      initGalleryAnimation();
      initializeAnimations();
      initHighlightedTextAnimation();
      initBoxesAnimation();
      setupFooterColorChange();
      setupScrollToTop();
      ScrollTrigger.refresh();
  });
 
