import { modifier } from 'ember-modifier';

export default modifier(function autoscroll(element /*, params, hash*/) {
  return element.scrollBy(0, 9999999);
});
