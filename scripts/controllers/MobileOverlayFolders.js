window.Template.Controllers.MobileOverlayFolders = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('MobileOverlayFolders'); }

  element.addEventListener('click', function (e) {

    var target = e.target;

    while (target !== element && target.getAttribute('data-controller-folder-toggle') === null) {
      target = target.parentNode;
    }

    var folderID = target.getAttribute('data-controller-folder-toggle');

    if (folderID) {

      // FolderID, folder is being clicked
      var folder = element.querySelector('[data-controller-folder="' + folderID + '"]');

      if (folder) {
        folder.classList.toggle('is-active-folder');
        element.classList.toggle('has-active-folder');
      }

    }


  });

}];