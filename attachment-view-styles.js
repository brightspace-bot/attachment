import '@brightspace-ui/core/components/colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const viewStyles = css`
  #content {
    border: 1px solid var(--d2l-color-mica);
    border-radius: 6px;
  }

  :host([immersive]) #content {
    border: none;
  }
`;
