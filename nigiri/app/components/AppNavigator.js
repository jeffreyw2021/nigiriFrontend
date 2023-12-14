import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Home from '../screens/Home';
import Add from '../screens/add';
import VibrationSelect from '../components/vibration';
import AddBreakpoint from '../screens/addBreakpoint';
import Detail from '../screens/detail';
import EditInfo from '../screens/editInfo';
import Edit from '../screens/edit';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const forSlideFromLeft = ({ current, layouts, next }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.width, 0],
          }),
        },
      ],
    },
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 1000, // Adjust duration for slower animation, default is usually 500ms
          easing: Easing.out(Easing.poly(4)), // This is an easing function, you can customize it as needed
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 1000, // Also adjust for closing animation if needed
          easing: Easing.out(Easing.poly(4)),
        },
      },
    },
  };
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} options={{ cardStyleInterpolator: forSlideFromLeft }} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="AddBreakpoint" component={AddBreakpoint} />
        <Stack.Screen name="Vibration" component={VibrationSelect} options={{ cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS }} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="EditInfo" component={EditInfo} />
        <Stack.Screen name="Edit" component={Edit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
