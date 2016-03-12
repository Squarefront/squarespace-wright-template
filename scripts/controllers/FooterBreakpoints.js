
window.Template.Controllers.FooterBreakpoints = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('FooterBreakpoints'); }



  var navGroups = element.querySelectorAll('.Footer-nav-group');
  var nav = element.querySelector('.Footer-nav');

  var breakpoints = {
    mid: Number.MAX_VALUE,
    full: Number.MAX_VALUE
  };

  var doesFit = function () {

    var navWidth = parseFloat(window.getComputedStyle(nav).width);
    var navGroupsTotalWidth = 0;

    for (var i = 0; i < navGroups.length; i++) {
      var navGroup = navGroups[i];
      var navGroupWidth = navGroup.offsetWidth;
      navGroupsTotalWidth += navGroupWidth;

      if (element.classList.contains('Footer--mid')) {
        // Already in mid
        if (navGroupWidth > navWidth) {
          return false;
        }
      } else if (navGroupsTotalWidth > navWidth) {
        // Not in mid, total width exceeds
        return false;
      }
    }

    return true;

  };

  var sync = function () {

    var isColumns = document.body.classList.contains('tweak-footer-layout-columns');

    if (isColumns) {

      if (window.innerWidth > breakpoints.mid) {

        // Known to be mid
        element.classList.remove('Footer--compact');

        if (window.innerWidth > breakpoints.full) {

          // Known to be full
          element.classList.remove('Footer--mid');

          return;

        }

      }

      // Unknown, try full
      element.classList.remove('Footer--compact');
      element.classList.remove('Footer--mid');

      if (doesFit()) {

        // Fits in full
        if (window.innerWidth < breakpoints.full) {
          breakpoints.full = window.innerWidth;
        }

      } else {

        // Try mid
        element.classList.add('Footer--mid');

        if (doesFit()) {

          // Fits in mid
          if (window.innerWidth < breakpoints.mid) {
            breakpoints.mid = window.innerWidth;
          }

        } else {

          // Compact
          element.classList.add('Footer--compact');

        }

      }

    }

  };

  // Init
  sync();

  var tweaks = [
    'tweak-footer-layout',
    'tweak-footer-business-info-show',
    'tweak-footer-business-hours-show'
  ];
  window.SQS.Tweak.watch(tweaks, function (tweak) {

    // Reset breakpoints
    breakpoints.mid = Number.MAX_VALUE;
    breakpoints.full = Number.MAX_VALUE;

    // Sync
    sync();
  });

  // Resize
  window.Template.Util.resizeEnd(function () {
    sync();
  });

}];