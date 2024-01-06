(() => {
  const darkTheme = "dark-theme";
  const iconTheme = "fa-sun";
  const counters = document.querySelectorAll('.counter');
  let scrollStarted = false;

  const btn = document.getElementById('menu-btn');
  const overlay = document.getElementById('overlay');
  const menu = document.getElementById('mobile-menu');

  const scrollPage = () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 100 && !scrollStarted) {
      countUp();
      scrollStarted = true;
    } else if (scrollPos < 100 && scrollStarted) {
      reset();
      scrollStarted = false;
    }
  };

  const navToggle = () => {
    btn.classList.toggle('open');
    overlay.classList.toggle('overlay-show');
    document.body.classList.toggle('stop-scrolling');
    menu.classList.toggle('show-menu');
  };

  btn.addEventListener('click', navToggle);
  document.addEventListener('scroll', scrollPage);

  const updateCounter = counter => {
    const target = +counter.getAttribute('data-target');
    const c = +counter.innerText;
    const increment = target / 100;

    if (c < target) {
      counter.innerText = `${Math.ceil(c + increment)}`;
      setTimeout(() => updateCounter(counter), 75);
    } else {
      counter.innerText = target;
    }
  };

  const countUp = () => {
    counters.forEach(counter => {
      counter.innerText = '0';
      updateCounter(counter);
    });
  };

  const reset = () => {
    counters.forEach(counter => (counter.innerHTML = '0'));
  };

  /* ACCORDION SKILLS */
  const skillsContent = document.getElementsByClassName("skills-container-content");
  const skillsHeader = document.querySelectorAll(".skills-container-header");

  const toggleSkills = function () {
    const itemClass = this.parentNode.className;

    for (let i = 0; i < skillsContent.length; i++) {
      skillsContent[i].className = "skills-container-content skills-close";
    }
    if (itemClass === "skills-container-content skills-close") {
      this.parentNode.className = "skills-container-content skills-open";
    }
  };

  skillsHeader.forEach(el => {
    el.addEventListener("click", toggleSkills);
  });

  /* QUALIFICATION TABS */
  const tabs = document.querySelectorAll("[data-target]");
  const tabContents = document.querySelectorAll("[data-content]");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.target);

      tabContents.forEach(tabContent => {
        tabContent.classList.remove("qualification-active");
      });
      target.classList.add("qualification-active");

      tabs.forEach(tab => {
        tab.classList.remove("qualification-active");
      });
      tab.classList.add("qualification-active");
    });
  });

  /* SERVICES MODAL */
  const modalViews = document.querySelectorAll(".services-modal");
  const modalBtns = document.querySelectorAll(".services-button");
  const modalCloses = document.querySelectorAll(".services-modal-close");

  const modal = function (modalClick) {
    modalViews[modalClick].classList.add("active-modal");
  };

  modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener("click", () => {
      modal(i);
    });
  });

  modalCloses.forEach(modalClose => {
    modalClose.addEventListener("click", () => {
      modalViews.forEach(modalView => {
        modalView.classList.remove("active-modal");
      });
    });
  });

  /* PORTFOLIO SWIPER */
  const swiperPortfolio = new Swiper(".portfolio-container", {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  /* TESTIMONIAL */
  const swiperTestimonial = new Swiper(".testimonial-container", {
    loop: true,
    grabCursor: true,
    spaceBetween: 50,

    breakpoints: {
      568: {
        slidesPerView: 2,
      },
    },
  });

  /* SCROLL SECTIONS ACTIVE LINK */
  const sections = document.querySelectorAll("section[id]");

  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(".nav-menu a[href*=" + sectionId + "]")
          .classList.add("active-link");
      } else {
        document
          .querySelector(".nav-menu a[href*=" + sectionId + "]")
          .classList.remove("active-link");
      }
    });
  };

  window.addEventListener("scroll", scrollActive);

  /* CHANGE BACKGROUND HEADER */
  const scrollHeader = () => {
    const nav = document.getElementById("header");

    if (this.scrollY >= 80) nav.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
  };

  window.addEventListener("scroll", scrollHeader);

  /* SHOW SCROLL UP */
  const scrollUp = () => {
    const scrollUp = document.getElementById("scroll-up");

    if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
    else scrollUp.classList.remove("show-scroll");
  };

  window.addEventListener("scroll", scrollUp);

  /* DARK LIGHT THEME */
  const themeButton = document.getElementById("theme-button");

  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";

  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun";

  const loadTheme = () => {
    const selectedTheme = localStorage.getItem("selected-theme");
    const selectedIcon = localStorage.getItem("selected-icon");

    if (selectedTheme) {
      document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
      );
      themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](
        iconTheme
      );
    }
  };

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });

  loadTheme();

  /* SWIPER */
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    keyboard: {
      enabled: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

})();
