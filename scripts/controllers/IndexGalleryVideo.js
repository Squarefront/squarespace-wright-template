window.Template.Controllers.IndexGalleryVideo = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('IndexGalleryVideo'); }

  var video = element.querySelector('.sqs-video-wrapper');

  if (video) {
    
    video.parentNode.removeChild(video);

    element.addEventListener('click', function (e) {
      e.preventDefault();

      // WARNING: Y.Squarespace.Lightbox2 is an
      // unstable API meant strictly for internal
      // Squarespace use.

      var lightbox = new Y.Squarespace.Lightbox2({
        content: Y.one(video),
        controls: {
          previous: false,
          next: false
        }
      });

      lightbox.render();

    });

  }

}];