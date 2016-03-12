(function(){
  'use strict';
  
  /**
   * All template-level Javascript is namespaced
   * onto the Template namespace.
   *
   * @namespace
   */
  window.Template = window.Template || {};

  /**
   * Template.Constants holds all constants, such
   * as breakpoints, timeouts, etc.
   *
   * @memberof Template
   * @inner
   */
  window.Template.Constants = {
    AUTHENTICATED: document.documentElement.getAttribute('data-authenticated-account'),
    DEBUG: true,
    MOBILE_BREAKPOINT: 640
  };

  /**
   * Template.Data holds all cached values shared
   * between controllers.
   *
   * @memberof Template
   * @inner
   */
  window.Template.Data = {};

  /**
   * Template.Util has some useful utility methods,
   * like a resize end handler.
   *
   * @memberof Template
   * @inner
   */
  window.Template.Util = {

    resizeEnd: function (fn) {

      var RESIZE_TIMEOUT = 100;
      var isDragging = false;
      var _resizeMeasureTimer;

      window.addEventListener('resize', function (){
        if (!isDragging) {
          isDragging = true;
        }

        if (_resizeMeasureTimer) {
          clearTimeout(_resizeMeasureTimer);
        }

        _resizeMeasureTimer = setTimeout(function () {
          fn();

          isDragging = false;
        }, RESIZE_TIMEOUT);
      });
    
    },

    isMobile: function () {

      var UA = {
        Android: function() { return window.navigator.userAgent.match(/Android/i); }, 
        BlackBerry: function() { return window.navigator.userAgent.match(/BlackBerry/i); }, 
        iOS: function() { return window.navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
        Opera: function() { return window.navigator.userAgent.match(/Opera Mini/i); }, 
        Windows: function() { return window.navigator.userAgent.match(/IEMobile/i); }
      };

      return (UA.Android() || UA.BlackBerry() || UA.iOS() || UA.Opera() || UA.Windows());
    }
    
  };

  /**
   * Template.Controllers holds the controller
   * functions, where all the actual Javascript
   * that does stuff is contained.
   *
   * @memberof Template
   * @inner
   */
  window.Template.Controllers = {};
})();