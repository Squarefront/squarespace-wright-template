
window.Template.Controllers.Parallax = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('Parallax'); }

  // Get parallax container and image

  // Define settings
  var parallaxOffset = 500;
  var windowHeight;
  var isMobile = window.Template.Util.isMobile();

  var matrix = [];

  var isParallaxEnabled = function () {

    var isEnabled = window.SQS.Tweak.getValue('tweak-overlay-parallax-enabled') === 'true' ? true : false;

    var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
    var isUIWebView = !window.navigator.standalone && !window.navigator.userAgent.match(/Safari/i);
    var isChrome = window.navigator.userAgent.match(/CriOS/i);

    if (isMobile && isIOS && isUIWebView || isMobile && isIOS && isChrome) {
      // UIWebView, no continuous scroll so no parallax
      isEnabled = false;
    }

    return isEnabled;
  };

  var initParallax = function (callback) {

    console.log('initParallax');

    // Construct matrix (necessary for image loading
    // even when parallax isn't enabled)
    var originalDOMNodes = element.querySelectorAll('[data-parallax-original-element]');


    for (var i = 0; i < originalDOMNodes.length; i++) {
      
      // Get original parallax node, image wrapper, and img
      var originalNode = originalDOMNodes[i];
      var imageWrapper = originalNode.querySelector('[data-parallax-image-wrapper]');
      var image = imageWrapper.querySelector('img');

      // Construct object to be pushed to matrix
      var matrixItem = {
        originalNode: originalNode,
        imageWrapper: imageWrapper,
        image: image,
        focalPoint: parseFloat(image.getAttribute('data-image-focal-point').split(',')[1])
      };

      // Push to matrix
      matrix.push(matrixItem);

      // Sync
      if (callback) { callback(); }

    }

  };

  var updateMatrixItem = function (i) {

    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    var matrixItem = matrix[i];
    var rect = matrixItem.originalNode.getBoundingClientRect();

    var currentDims = {
      top: rect.top + scrollTop,
      left: rect.left,
      width: matrixItem.originalNode.offsetWidth,
      height: matrixItem.originalNode.offsetHeight
    };

    for (var prop in currentDims) {

      if (matrixItem[prop] !== currentDims[prop]) {

        matrixItem.top = currentDims.top;
        matrixItem.right = rect.right;
        matrixItem.bottom = rect.bottom + scrollTop;
        matrixItem.left = currentDims.left;
        matrixItem.width = currentDims.width;
        matrixItem.height = currentDims.height;

        return true;
      }

    }

    return false;

  };

  var updateAllMatrixItems = function () {

    var resync;

    for (var i = 0; i < matrix.length; i++) {
      if (updateMatrixItem(i)) {
        resync = true;
      }
    }

    return resync;

  };

  var timedSync = function (timeouts) {

    timeouts = timeouts instanceof Array ? timeouts : [50, 500, 5000];
    timeouts.forEach(function (delay) {
      setTimeout(sync, delay);
    });

  };

  var sync = function () {

    // Cache window height for performance
    var parallaxHost = document.body.querySelector('[data-parallax-host]');
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    windowHeight = window.innerHeight;

    if (updateAllMatrixItems()) {

      console.log('sync');

      for (var i = 0; i < matrix.length; i++) {

        var matrixItem = matrix[i];

        if (isParallaxEnabled()) {

          if (matrixItem.imageWrapper.parentNode === matrixItem.originalNode) {

            // Get all the images to be parallaxed from
            // the original nodes and move into a separate
            // container (for performance purposes).
          
            // Get parallax id
            var id = matrixItem.originalNode.getAttribute('data-parallax-id');

            // Match with proper node in parallax image
            // container, and add it to matrix item
            var parallaxItem = parallaxHost.querySelector('[data-parallax-item][data-parallax-id="' + id + '"]');
            matrixItem.parallaxItem = parallaxItem;

            // Move imageWrapper to its new home
            parallaxItem.appendChild(matrixItem.imageWrapper);

          }

          // Get information from the DOM about the 
          // original nodes that the parallax images came
          // from, and style the proxy parallaxItem so
          // that it appears in the same place visually.
          // updateMatrixItem(i);

          // Apply styles to parallaxItem so it has the right position
          matrixItem.parallaxItem.style.top = matrixItem.top + 'px';
          matrixItem.parallaxItem.style.left = matrixItem.left + 'px';
          matrixItem.parallaxItem.style.width = matrixItem.width + 'px';
          matrixItem.parallaxItem.style.height = matrixItem.height + 'px';

          // Offset top of imageWrapper to allow for room to scroll
          matrixItem.imageWrapper.style.top = (-1 * parallaxOffset) + 'px';

          // Load image
          window.SQS.ImageLoader.load(matrixItem.image, {
            load: true,
            mode: 'fill'
          });

          // Add loaded class
          matrixItem.imageWrapper.classList.add('loaded');

        } else {

          if (matrixItem.imageWrapper.parentNode !== matrixItem.originalNode) {

            // Parallax is off, but the imageWrapper is not
            // in its original node, so move it back.
            matrixItem.originalNode.appendChild(matrixItem.imageWrapper);

          }

          if (matrixItem.parallaxItem) {

            // Parallax is off, but was on at some point.
            // Clear styles from all affected elements.
            matrixItem.parallaxItem.style.top = null;
            matrixItem.parallaxItem.style.left = null;
            matrixItem.parallaxItem.style.width = null;
            matrixItem.parallaxItem.style.height = null;

          }

          // Clear offset top
          matrixItem.imageWrapper.style.top = null;

          // Clear transforms
          matrixItem.image.style.webkitTransform = null;
          matrixItem.image.style.msTransform = null;
          matrixItem.image.style.transform = null;

        }

        // Load images
        window.SQS.ImageLoader.load(matrixItem.image, {
          load: true,
          mode: 'fill'
        });

        // Add loaded class
        matrixItem.imageWrapper.classList.add('loaded');

      }

      // Calculate proper position of images by calling scroll
      if (isParallaxEnabled()) {
        scroll(scrollTop);
      }

      // On first sync, scroll needs to be bound
      if (!scrollCallback) {
        bindScroll();
      }

    }

  };

  var scroll = function (scrollTop) {

    scrollTop = scrollTop || (document.documentElement.scrollTop || document.body.scrollTop);

    if (isParallaxEnabled()) {

      for (var i = 0; i < matrix.length; i++) {

        var matrixItem = matrix[i];

        // Check range
        if (scrollTop + windowHeight > matrixItem.top && scrollTop < matrixItem.bottom) {

          // In view, find the 'parallax proportion' -
          // the percentage of the total vertical screen
          // space that has elapsed since the element
          // scrolled into view vs when it would scroll
          // out of view.
          var parallaxProportion = 1 - ((matrixItem.top + (matrixItem.height) * matrixItem.focalPoint - scrollTop) / windowHeight);

          // if (window.Template.Constants.DEBUG) { console.log(parallaxProportion); }

          // Apply this proportion (max of 1) to the 
          // parallax offset, which is the total number
          // of invisible pixels that can be scrolled.
          // var transformValue = (parallaxProportion * parallaxOffset) + (matrixItem.top - scrollTop - parallaxOffset);
          // var transformValueString = 'translatey(' + transformValue + 'px)';
          var imageTransformString = 'translatey(' + (parallaxProportion * parallaxOffset) + 'px)';

          // Sync to DOM
          matrixItem.image.style.webkitTransform = imageTransformString;
          matrixItem.image.style.msTransform = imageTransformString;
          matrixItem.image.style.transform = imageTransformString;
          
          // Offset fixed container
          var parallaxItemTransformString = 'translatey(' + (-1 * scrollTop) + 'px)';
          matrixItem.parallaxItem.style.webkitTransform = parallaxItemTransformString;
          matrixItem.parallaxItem.style.msTransform = parallaxItemTransformString;
          matrixItem.parallaxItem.style.transform = parallaxItemTransformString;

        } else {

          // Out of range

          var parallaxItemTransformString = 'translate3d(' + (-1 * matrixItem.width - matrixItem.left) + 'px, 0, 0)';
          matrixItem.parallaxItem.style.webkitTransform = parallaxItemTransformString;
          matrixItem.parallaxItem.style.msTransform = parallaxItemTransformString;
          matrixItem.parallaxItem.style.transform = parallaxItemTransformString;

        }

      }

    }

  };


  var scrollCallback;

  var bindScroll = function () {

    // Bind scroll
    var scrolling = false;
    var scrollTimeout;

    scrollCallback = function () {

      scroll(window.pageYOffset);

      if (scrolling === true) {
        window.requestAnimationFrame(scrollCallback);
      }

    };

    window.addEventListener('scroll', function () {

      if (scrolling === false) {
        scrolling = true;
        document.documentElement.style.pointerEvents = 'none';

        scrollCallback();

      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(function () {
        scrolling = false;
        document.documentElement.style.pointerEvents = 'auto';
      }, 100);

    });

  };


  // Tweak handler
  var tweaks = [
    'tweak-overlay-parallax-enabled',
    'tweak-site-width-option',
    'tweak-site-width'
  ];
  window.SQS.Tweak.watch(tweaks, sync);

  // Resize handler
  window.Template.Util.resizeEnd(timedSync);

  // Init
  initParallax(function() {

    // Sync
    timedSync();

  });

  // Mutation observer
  var mew = new window.templateMutationObserver({
    callback: sync
  });

}];