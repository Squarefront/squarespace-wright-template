window.Template.Controllers.OverlayOffset = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('OverlayOffset'); }

  var header = element.querySelector('.Header--overlay');

  var offsetContainer = element.querySelector('.Index-page--has-image:first-child');
  var offsetElement = element.querySelector('.Index-page--has-image:first-child .Index-page-content');

  if (!offsetContainer) {
    offsetContainer = element.querySelector('.Intro--has-image');
    offsetElement = element.querySelector('.Intro--has-image .Intro-content');
  }

  var sync = function () {
    
    if (header && offsetContainer && offsetElement) {

      if (window.innerWidth > window.Template.Constants.MOBILE_BREAKPOINT) {
        offsetElement.style.marginTop = header.offsetHeight + 'px';
      } else {
        offsetElement.style.marginTop = 0;
      }

      offsetContainer.classList.add('loaded');

    }

  };

  // Resize
  window.Template.Util.resizeEnd(function () {
    sync();
  });

  // Init
  sync();

}];