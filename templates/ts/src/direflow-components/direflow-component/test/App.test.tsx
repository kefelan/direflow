import React from 'react';
import { createRoot } from 'react-dom/client';
import { unmountComponentAtNode } from 'react-dom';
import renderer from 'react-test-renderer';
import App from '../App';

const reactProps = {
  componentTitle: 'Component Test',
  sampleList: ['Mock', 'Test', 'Data'],
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<App {...reactProps} />);
  unmountComponentAtNode(div);
});

it('matches snapshot as expected', () => {
  const renderTree = renderer.create(<App {...reactProps} />).toJSON();
  expect(renderTree).toMatchSnapshot();
});
