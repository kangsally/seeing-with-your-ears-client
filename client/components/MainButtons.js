import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function MainButtons(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.left}
        onPress={() => {
          props.onPressBtn('left');
        }}
        accessibilityLabel="left"
      >
        <Entypo name="triangle-left" size={40} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.right}
        onPress={() => {
          props.onPressBtn('right');
        }}
        accessibilityLabel="right"
      >
        <Entypo name="triangle-right" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  right: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEDEC',
    borderLeftWidth: 0.5,
    borderLeftColor: '#868e96'
  },
  left: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEDEC',
    borderRightWidth: 0.5,
    borderRightColor: '#868e96'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
