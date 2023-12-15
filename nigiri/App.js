//eas build --platform ios
//eas submit -p ios --latest
import registerNNPushToken from 'native-notify';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/components/AppNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App(){
  registerNNPushToken(16776, 'vip8IrtRHBkbyLFDjVhRhR');
  return (
    <AppNavigator />
  );
};
