
window.Template.Controllers.MobileOverlayToggle = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('MobileOverlayToggle'); }

  // Click handler
  element.addEventListener('click', function (e) {

    e.preventDefault();

    // Check to see if overlay is already open

    if (document.body.classList.contains('is-mobile-overlay-active')) {

      // Reset position of body, remove active class, set scroll top
      document.body.classList.remove('is-mobile-overlay-active');
      document.body.style.top = null;
      window.scrollTo(0, window.Template.Data.scrollPos);
    
    } else {

      // Get position of body and store in var
      window.Template.Data.scrollPos = document.body.scrollTop;

      // Not active, add the class
      document.body.classList.add('is-mobile-overlay-active');
      document.body.style.top = -1 * window.Template.Data.scrollPos + 'px';

    }

  });

  // Tweak - add overlay active class if
  // you're below the mobile breakpoint
  var tweaks = [
    'tweak-mobile-overlay-slide-origin',
    'tweak-mobile-overlay-back-color',
    'tweak-mobile-overlay-close-show',
    'tweak-mobile-overlay-close-background-color',
    'tweak-mobile-overlay-close-icon-color',
    'tweak-mobile-overlay-menu-color',
    'tweak-mobile-overlay-menu-indicator-color',
    'tweak-mobile-overlay-menu-primary-font',
    'tweak-mobile-overlay-menu-primary-text-color',
    'tweak-mobile-overlay-menu-secondary-font',
    'tweak-mobile-overlay-menu-secondary-text-color'
  ];
  window.SQS.Tweak.watch(function (tweak) {
    var isMobileActive = window.innerWidth < window.Template.Constants.MOBILE_BREAKPOINT &&
                         tweak.name &&
                         tweaks.indexOf(tweak.name) >= 0;
    
    document.body.classList.toggle('is-mobile-overlay-active', isMobileActive);
  });

  // Resize handler - remove overlay active
  // class if you're above the mobile breakpoint
  window.Template.Util.resizeEnd(function () {
    if (window.innerWidth > window.Template.Constants.MOBILE_BREAKPOINT) {
      document.body.classList.remove('is-mobile-overlay-active');
    }
  });

}];