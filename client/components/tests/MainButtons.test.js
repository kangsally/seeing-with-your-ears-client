import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MainButtons from '../MainButtons';
Enzyme.configure({ adapter: new Adapter() });

describe('TouchableOpacity component', () => {
  const props = {
    onPressBtn: jest.fn()
  };

  const wrapper = shallow(<MainButtons {...props} />);
//   const component = wrapper.find('TouchableOpacity');
//   const leftButton = component.get(0);
//   const rightButton = component.get(1);

  it('should render two buttons', () => {
    expect(wrapper.find('TouchableOpacity')).toHaveLength(2);
  });

//   it('should call function when press on buttons', () => {
//     expect(leftButton.simulate('onPress')).toBe('result');
//   });

});
