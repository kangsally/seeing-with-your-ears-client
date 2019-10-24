import * as Speech from 'expo-speech';

export const startTospeak = thingTosay => {
  Speech.speak(thingTosay);
};

export const stopToSpeak = () => {
  Speech.stop();
};
