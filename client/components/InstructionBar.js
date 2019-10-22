import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InstructionBar(props) {
  return (
    <View style={styles.container}>
        <Text style={styles.content}>{props.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginTop: 1,
    flex: 2
  },
  content: {
    fontSize: 20,
    color: 'white'
  }
});
