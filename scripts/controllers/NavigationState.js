window.Template.Controllers.NavigationState = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('NavigationState'); }

  // More efficient lookup?
  if (element.querySelectorAll('.Header-nav--primary .Header-nav-item').length > 0) {
    element.classList.add('has-primary-nav');
  }
  if (element.querySelectorAll('.Header-nav--secondary .Header-nav-item').length > 0) {
    element.classList.add('has-secondary-nav');
  }

}];