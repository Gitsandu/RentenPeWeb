/**
* Template Name: RentenPe - v4.10.0
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });
  /**
   * Animation on scroll
   */

  var swiper = new Swiper(".mySwiper", {
    loop: true, // Add this line for infinite and continuous sliding
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    autoplay: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 5,
      slideShadows: false,
    },
  });

  

  
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()
document.addEventListener("DOMContentLoaded", function () {
  const contentSections = document.querySelectorAll('.custom-left [data-target]');
  const images = document.querySelectorAll('.custom-right [class^="image"]');
  let currentIndex = 0;
  let transitionTimeout;
 
  // Function to show a specific content and corresponding image
  function showContentAndImage(targetIndex) {
    contentSections.forEach(function (content, index) {
      content.style.display = index === targetIndex ? 'block' : 'none';
    });
 
    images.forEach(function (image, index) {
      image.style.display = index === targetIndex ? 'block' : 'none';
    });
  }
 
  // Function to handle the transition
  function handleTransition() {
    showContentAndImage(currentIndex);
  }
 
  // Function to initiate the transition after scroll stops
  function initiateTransition() {
    clearTimeout(transitionTimeout);
    transitionTimeout = setTimeout(handleTransition, 200); // You can adjust the delay as needed
  }
 
  // Add wheel event listener to the container for scroll detection
  const container = document.querySelector('.subContainer');
  container.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) {
      // Scrolling down
      currentIndex = (currentIndex + 1) % contentSections.length;
      initiateTransition();
    } else if (event.deltaY < 0) {
      // Scrolling up
      currentIndex = (currentIndex - 1 + contentSections.length) % contentSections.length;
      initiateTransition();
    }
  });
 
  // Initially show content1 and image1
  showContentAndImage(currentIndex);
 
  // Add click event listeners to each content section
  contentSections.forEach(function (content) {
    content.addEventListener('click', function () {
      clearTimeout(transitionTimeout); // Stop the transition when a content is clicked
      const targetIndex = parseInt(content.getAttribute('data-target').replace('image', '')) - 1; // Adjust index based on data-target attribute
      showContentAndImage(targetIndex);
    });
  });
});
function toggleExpansion(clickedElement) {
    // Get all submain elements
    const submains = document.querySelectorAll('.submain');

    // Collapse all submains except the clicked one
    submains.forEach((element) => {
        if (element !== clickedElement && element.classList.contains('expanded')) {
            element.classList.remove('expanded');
        }
    });

    // Toggle the clicked submain
    clickedElement.classList.toggle('expanded');
}

function toggleExpansion(cli)