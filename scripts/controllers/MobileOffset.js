
window.Template.Controllers.MobileOffset = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('MobileOffset'); }

  var sync = function () {

    if (window.innerWidth < window.Template.Constants.MOBILE_BREAKPOINT) {

      var offset = 0;
      var elementStyles = window.getComputedStyle(element);

      if (elementStyles.display !== 'none' && elementStyles.position === 'fixed') {
        offset = element.offsetHeight;
      }

      if (parseFloat(elementStyles.bottom) === 0) {
        // Bottom bar
        document.body.style.marginBottom = offset + 'px';

        var mobileInfoBar = document.querySelector('.sqs-mobile-info-bar');

        if (mobileInfoBar) {

          mobileInfoBar.style.bottom = offset + 'px';

        }

      } else {
        // Top bar
        document.body.style.marginTop = offset + 'px';
      }

    } else {
      document.body.style.marginTop = null;
      document.body.style.marginBottom = null;
    }

  };

  // Tweak
  var tweaks = [
    'tweak-mobile-bar-branding-position',
    'tweak-mobile-bar-menu-icon-position',
    'tweak-mobile-bar-cart-position',
    'tweak-mobile-bar-search-icon-position',
    'tweak-mobile-bar-top-fixed'
  ];
  window.SQS.Tweak.watch(tweaks, sync);


  // Resize
  window.Template.Util.resizeEnd(sync);


  // Init
  sync();

}];