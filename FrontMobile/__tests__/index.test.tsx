import * as React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../app/index';

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('contains the title text', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(JSON.stringify(tree)).toContain('Expo Pipeline Test');
  });
});
