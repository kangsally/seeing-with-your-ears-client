import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MainScreen from '../MainScreen';
Enzyme.configure({ adapter: new Adapter() });

describe('MainScreen snapshot', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(<MainScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('MainScreen components', () => {
  const wrapper = shallow(<MainScreen />);
  it('should render a MainButton component', () => {
    expect(wrapper.find('MainButtons')).toHaveLength(1);
  });
  
  it('should render a InstructionBar component', () => {
    expect(wrapper.find('InstructionBar')).toHaveLength(1);
  });

  it('should render a View component', () => {
    expect(wrapper.find('View')).toHaveLength(3);
  });
});
