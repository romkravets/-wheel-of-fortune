import React from 'react';
import { render } from 'react-dom';

export const run = () => {
  render(<h1>Hello world</h1>, document.querySelector('#root'));
};
