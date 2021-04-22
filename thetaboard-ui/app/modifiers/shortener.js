import { modifier } from 'ember-modifier';

export default modifier(function shortener(element, params) {
  let address = Array.isArray(params) ? params[0] : params;
  if (address) {
    const front = address.substr(0, 6);
    const end = address.substr(-4);
    address = `${front}...${end}`;
  }
  element.innerText = address;
});
