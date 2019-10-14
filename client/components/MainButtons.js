import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
        <Text style={styles.text}>왼쪽</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.right}
        onPress={() => {
          props.onPressBtn('right');
        }}
        accessibilityLabel="right"
      >
        <Text style={styles.text}>오른쪽</Text>
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
    backgroundColor: 'yellow'
  },
  left: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
