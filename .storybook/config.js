import { configure, addDecorator } from '@storybook/polymer';
import { withA11y } from '@storybook/addon-a11y';
import { initializeRTL } from 'storybook-addon-rtl';

import '@storybook/addon-console';
import { render } from 'lit-html';

import '@brightspace-ui/core/components/typography/typography.js';

initializeRTL();

const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

const litDecorator = (story) => {
  const el = document.createElement('section'); // this element probably can br reused.
  document.documentElement.style.fontSize = "20px";
  el.classList.add('d2l-typography');
  // el.style.fontSize = "20px"
  render(story(), el);
  return el;
}

// const providerDecorator = (story) => {
//   const el = document.createElement('d2l-stub-unfurl-provider'); // this element probably can br reused.
//   el.setAttribute('endpoint', 'http://localhost/api/v2/unfurl');
//   el.setAttribute('trusted', true);
//   render(story(), el);
//   return el;
// }

addDecorator(withA11y);
addDecorator(litDecorator);
// addDecorator(providerDecorator);
configure(loadStories, module);
