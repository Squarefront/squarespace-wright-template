/**
 *
 * @function IndexGallery
 */
window.Template.Controllers.IndexGallery = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('IndexGallery'); }

  var sections = element.querySelectorAll('.Index-gallery-inner');

  if (sections.length === 0) { return false; }

  var lastSection = sections[sections.length - 1];
  var images = element.querySelectorAll('img');
  var isMobile = window.Template.Util.isMobile();

  var promoteLayers = function (hasHoverTransition) {

    var userAgent = window.navigator.userAgent;

    if (hasHoverTransition && !isMobile && userAgent.match(/Safari/i) && !userAgent.match(/Chrome/i)) {

      // Gallery images will jiggle in Safari unless
      // they are layer-promoted. We don't want to
      // layer promote them in all cases becauses
      // creating extra layers is bad for parallax
      // performance, so we have to do this horrible
      // userAgent lookup for Safari specifically.

      // Note: the Chrome condition negates Chrome
      // and Microsoft Edge, which mysteriously has
      // both "Safari" and "Chrome" in its UA string.
      for (var i = 0; i < images.length; i++) {

        // User -webkit-transform to be extra careful
        // not to leak over to other browsers.
        images[i].style.webkitTransform = 'translatez(0)';

      }

    }

  };

  var buildGrid = function () {

    // If there's more than 1 section, ensure there
    // are at least 3 items in the last section
    var lastSection = sections[sections.length - 1];
    var lastSectionItems = lastSection.querySelectorAll('.Index-gallery-item');

    if (sections.length > 1 && lastSectionItems.length < 3) {
      var secondToLastSection = sections[sections.length - 2];
      var secondToLastSectionItems = secondToLastSection.querySelectorAll('.Index-gallery-item');

      for (var i = lastSectionItems.length; i < 3; i ++) {
        lastSection.insertBefore(secondToLastSectionItems[8 - i], lastSection.firstChild);
      }

      secondToLastSection.setAttribute('data-index-gallery-images', 6 + lastSectionItems.length);
      lastSection.setAttribute('data-index-gallery-images', 3);

    } else {

      lastSection.setAttribute('data-index-gallery-images', lastSectionItems.length);

    }

  };

  // Sync function
  var sync = function () {

    var hasHoverTransition = document.body.classList.contains('tweak-index-gallery-hover-style-fade');

    for (var i = 0; i < images.length; i++) {
      window.SQS.ImageLoader.load(images[i], {
        load: true,
        mode: 'fill'
      });
    }

    promoteLayers(hasHoverTransition);

  };

  // Tweak handler
  if (window.Template.Constants.AUTHENTICATED) {
    var tweaks = [
      'tweak-index-gallery-layout',
      'tweak-index-gallery-spacing',
      'tweak-index-gallery-aspect'
    ];
    window.SQS.Tweak.watch(tweaks, sync);
  }

  // Resize handler
  window.Template.Util.resizeEnd(function () {
    sync();
  });

  // Init
  buildGrid();
  sync();
  element.classList.add('loaded');

}];