import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeButton(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.center}
        onPress={() => {
          props.onPressBtn('center');
        }}
        accessibilityLabel="center"
      >
        <MaterialCommunityIcons name={props.icon} size={70} />
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
  center: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEDEC'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
