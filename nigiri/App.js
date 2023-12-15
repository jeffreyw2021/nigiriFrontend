//eas build --platform ios
//eas submit -p ios --latest
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/components/AppNavigator';
import { View, ActivityIndicator } from 'react-native';

const App = () => {
  return (
    <AppNavigator />
  );
};

export default App;
