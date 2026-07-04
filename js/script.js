(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    const setNavOpen = (open) => {
      mainNav.classList.toggle("open", open);
      navToggle.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    navToggle.addEventListener("click", () => {
      setNavOpen(!mainNav.classList.contains("open"));
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });
    document.addEventListener("click", (e) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        setNavOpen(false);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        setNavOpen(false);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add("visible"), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el, i) => {
      el.dataset.delay = (i % 4) * 80;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item
        .closest(".faq")
        .querySelectorAll(".faq-item.open")
        .forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-answer").style.maxHeight = null;
          }
        });
      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Testimonial / media slider (arrow controlled) ---------- */
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector(".testimonial-track");
    if (!track) return;
    const cards = Array.from(track.children);
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");
    let index = 0;
    const perView = () => (window.innerWidth >= 760 ? 2 : 1);

    function update() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 22;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    }
    function next() {
      const max = Math.max(cards.length - perView(), 0);
      index = index >= max ? 0 : index + 1;
      update();
    }
    function prev() {
      const max = Math.max(cards.length - perView(), 0);
      index = index <= 0 ? max : index - 1;
      update();
    }
    prevBtn && prevBtn.addEventListener("click", prev);
    nextBtn && nextBtn.addEventListener("click", next);
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Form validation + mailto submit ---------- */
  const MAILTO_EMAIL = "info@athleticalignmentlab.com";

  function collectFormData(form) {
    const fields = [];
    form.querySelectorAll(".form-field").forEach((wrap) => {
      const label = wrap.querySelector("label");
      const field = wrap.querySelector("input, textarea, select");
      if (!field) return;
      const value = field.value.trim();
      if (!value) return;
      fields.push({
        name: field.name,
        label: label
          ? label.textContent.trim().replace(/\s+/g, " ")
          : field.name,
        value,
      });
    });
    return fields;
  }

  function buildMailUrls(fields, form) {
    const body = fields.map((f) => `${f.label}: ${f.value}`).join("\n");
    const name = fields.find((f) => f.name === "name")?.value || "Unknown";
    let subject;

    if (form.classList.contains("partner-contact-form")) {
      const company = fields.find((f) => f.name === "company")?.value;
      subject = company
        ? `New Partnership Inquiry from ${name} - ${company}`
        : `New Partnership Inquiry from ${name}`;
    } else {
      subject = `New Inquiry from ${name}`;
    }

    const mailtoUrl = `mailto:${MAILTO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAILTO_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return { mailtoUrl, gmailUrl };
  }

  function openMailClient(mailtoUrl) {
    const link = document.createElement("a");
    link.href = mailtoUrl;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showMailtoFallback(form, urls) {
    let fallback = form.querySelector(".form-mailto-fallback");
    if (!fallback) {
      fallback = document.createElement("p");
      fallback.className = "form-mailto-fallback";
      form.appendChild(fallback);
    }

    fallback.innerHTML =
      'If your email app did not open, <a href="' +
      urls.mailtoUrl +
      '">open in your email app</a> or ' +
      '<a href="' +
      urls.gmailUrl +
      '" target="_blank" rel="noopener noreferrer">compose in Gmail</a>.';
    fallback.hidden = false;
  }

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    const successMsg = form.querySelector(".form-success");
    const defaultSuccessText = successMsg?.textContent.trim() || "";

    function setError(field, message) {
      const wrap = field.closest(".form-field");
      if (!wrap) return;
      const errorEl = wrap.querySelector(".field-error");
      if (message) {
        wrap.classList.add("has-error");
        if (errorEl) errorEl.textContent = message;
      } else {
        wrap.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function clearMailtoFallback() {
      const fallback = form.querySelector(".form-mailto-fallback");
      if (fallback) {
        fallback.hidden = true;
        fallback.innerHTML = "";
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.querySelectorAll("[required]").forEach((field) => {
        const value = field.value.trim();
        if (!value) {
          setError(field, "This field is required");
          valid = false;
        } else if (field.type === "email" && !emailPattern.test(value)) {
          setError(field, "Enter a valid email address");
          valid = false;
        } else {
          setError(field, "");
        }
      });

      if (!valid) return;

      const fields = collectFormData(form);

      if (form.hasAttribute("data-mailto")) {
        const urls = buildMailUrls(fields, form);
        openMailClient(urls.mailtoUrl);
        showMailtoFallback(form, urls);
      }

      if (successMsg) {
        successMsg.textContent = defaultSuccessText;
        successMsg.classList.add("show");
      }

      window.setTimeout(() => form.reset(), 300);
    });

    form.addEventListener("input", clearMailtoFallback);
  });
})();
