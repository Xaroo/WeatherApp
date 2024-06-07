import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, Dimensions } from 'react-native';
import WeatherScreen from './components/WeatherScreen';

export default function App() {

  return (

    <View style={styles.container}>
      <Text style={styles.titleText}>WAM, React Native, lab.7</Text>
        <WeatherScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight:0,
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  titleText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffff00',
  }
});
