(function () {
  "use strict";

  const problemPrev = document.getElementById("problemPrev");
  const problemNext = document.getElementById("problemNext");
  const problemImage = document.getElementById("problemImage");
  const problemSubtitle = document.getElementById("problemSubtitle");
  const problemDesc = document.getElementById("problemDesc");
  const problemTextContent = document.getElementById("problemTextContent");

  if (
    problemPrev &&
    problemNext &&
    problemImage &&
    problemSubtitle &&
    problemDesc
  ) {
    const problems = [
      {
        image: "img/AAL-stretch-female-03.png",
        subtitle: "Something always hurts",
        desc: "You're constantly adjusting—avoiding certain movements, favoring one side, or pushing through discomfort. Over time, it starts creating new issues elsewhere.",
      },
      {
        image: "img/AAL-stretch-male-01.png",
        subtitle: "Mobility feels limited",
        desc: "You're stretching, foam rolling, and doing mobility work, but the stiffness always returns. Your body feels locked up, limiting your range of motion and overall performance.",
      },
      {
        image: "img/AAL-stretch-female-01.png",
        subtitle: "Recovery is taking longer",
        desc: "Minor tweaks and soreness linger much longer than they used to. Your body struggles to bounce back from workouts, leaving you feeling fatigued and prone to injury.",
      },
    ];

    let currentProblem = 0;
    const dots = document.querySelectorAll(".problem-dots .dot");

    function updateProblem(index) {
      problemImage.style.opacity = 0;
      problemTextContent.style.opacity = 0;

      setTimeout(() => {
        problemImage.src = problems[index].image;
        problemSubtitle.textContent = problems[index].subtitle;
        problemDesc.textContent = problems[index].desc;

        problemImage.style.opacity = 1;
        problemTextContent.style.opacity = 1;
        
        // Update dots if they exist
        if (dots.length > 0) {
          dots.forEach((dot, i) => {
            if (i === index) dot.classList.add("active");
            else dot.classList.remove("active");
          });
        }
      }, 300);
    }

    problemPrev.addEventListener("click", () => {
      currentProblem = (currentProblem - 1 + problems.length) % problems.length;
      updateProblem(currentProblem);
    });

    problemNext.addEventListener("click", () => {
      currentProblem = (currentProblem + 1) % problems.length;
      updateProblem(currentProblem);
    });
    
    // Dot click listeners
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          currentProblem = index;
          updateProblem(currentProblem);
        });
      });
    }

    // Swipe support for mobile
    const problemGrid = document.querySelector('.problem-grid');
    if (problemGrid) {
      let touchStartX = 0;
      let touchEndX = 0;

      problemGrid.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchEndX = touchStartX; // reset
      }, { passive: true });

      problemGrid.addEventListener('touchmove', e => {
        touchEndX = e.touches[0].clientX;
      }, { passive: true });

      problemGrid.addEventListener('touchend', e => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchEndX = e.changedTouches[0].clientX;
        }
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
          // Swiped left, go next
          currentProblem = (currentProblem + 1) % problems.length;
          updateProblem(currentProblem);
        }
        if (touchEndX - touchStartX > swipeThreshold) {
          // Swiped right, go prev
          currentProblem = (currentProblem - 1 + problems.length) % problems.length;
          updateProblem(currentProblem);
        }
      }
    }
  }

  /* ==========================================================================
     Package Mobile Carousel Logic
     ========================================================================== */
  const packageGrid = document.querySelector(".package-grid");
  const packageCards = document.querySelectorAll(".package-card");
  const packageDots = document.querySelectorAll(".package-dots .dot");
  
  if (packageGrid && packageCards.length > 0) {
    let currentPackage = 1; // Start with the middle card ("Maintain") active

    function updatePackages(index) {
      // Remove all state classes
      packageCards.forEach(card => {
        card.classList.remove("active", "prev", "next");
      });
      if (packageDots.length > 0) {
        packageDots.forEach(dot => dot.classList.remove("active"));
      }

      // Add appropriate classes based on the current index
      packageCards[index].classList.add("active");
      
      const prevIndex = (index - 1 + packageCards.length) % packageCards.length;
      const nextIndex = (index + 1) % packageCards.length;
      
      packageCards[prevIndex].classList.add("prev");
      packageCards[nextIndex].classList.add("next");

      if (packageDots.length > 0 && packageDots[index]) {
        packageDots[index].classList.add("active");
      }
    }

    // Initialize layout for mobile if window is small, otherwise reset
    function checkPackageLayout() {
      if (window.innerWidth <= 860) {
        updatePackages(currentPackage);
      } else {
        // Desktop: remove all mobile classes
        packageCards.forEach(card => card.classList.remove("active", "prev", "next"));
      }
    }

    checkPackageLayout();
    window.addEventListener("resize", checkPackageLayout, { passive: true });

    // Swipe Support
    let pTouchStartX = 0;
    let pTouchEndX = 0;

    packageGrid.addEventListener('touchstart', e => {
      if (window.innerWidth > 860) return;
      pTouchStartX = e.touches[0].clientX;
      pTouchEndX = pTouchStartX;
    }, { passive: true });

    packageGrid.addEventListener('touchmove', e => {
      if (window.innerWidth > 860) return;
      pTouchEndX = e.touches[0].clientX;
    }, { passive: true });

    packageGrid.addEventListener('touchend', e => {
      if (window.innerWidth > 860) return;
      if (e.changedTouches && e.changedTouches.length > 0) {
        pTouchEndX = e.changedTouches[0].clientX;
      }
      handlePackageSwipe();
    }, { passive: true });

    function handlePackageSwipe() {
      const swipeThreshold = 50;
      if (pTouchStartX - pTouchEndX > swipeThreshold) {
        // Swiped left, go next
        currentPackage = (currentPackage + 1) % packageCards.length;
        updatePackages(currentPackage);
      }
      if (pTouchEndX - pTouchStartX > swipeThreshold) {
        // Swiped right, go prev
        currentPackage = (currentPackage - 1 + packageCards.length) % packageCards.length;
        updatePackages(currentPackage);
      }
    }

    // Dot click listeners
    if (packageDots.length > 0) {
      packageDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          if (window.innerWidth <= 860) {
            currentPackage = index;
            updatePackages(currentPackage);
          }
        });
      });
    }
  }
})();
