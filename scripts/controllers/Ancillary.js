/**
 * The Ancillary controller will generate 
 * an instance of Ancillary or collapsed
 * Ancillary with the controller element
 * as the base.
 *
 * @function Ancillary
 */
window.Template.Controllers.Ancillary = ['element', function (element) {

  if (window.Template.Constants.DEBUG) { console.log('Ancillary'); }

  // Get settings from DOM for this particular Ancillary base
  var collapse = element.getAttribute('data-nc-collapsible') !== null;
  var minWidth = parseFloat(element.getAttribute('data-nc-min'));
  var maxWidth = parseFloat(element.getAttribute('data-nc-max'));

  // Layout var will contain the Ancillary class
  var layout;

  if (collapse) {

    // Collapsed Ancillary, with min and max width
    layout = new window.AncillaryCollapse({
      base: element,
      minWidth: minWidth,
      maxWidth: maxWidth,
      onLoad: function () {
        element.classList.add('loaded');
      }
    });

  } else {

    // Non-collapsed ancillary, min and max width are irrelevant
    layout = new window.Ancillary({
      base: element,
      onLoad: function () {
        element.classList.add('loaded');
      }
    });
  }
  
}];