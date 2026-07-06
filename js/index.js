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
})();
