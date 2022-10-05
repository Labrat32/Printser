import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../views/Profile';
import Store from '../views/Store';
import Single from '../views/Single';
import Login from '../views/Login';
import Upload from '../views/Upload';
import {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@rneui/themed';
import MyFiles from '../views/MyFiles';
import ModifyFile from '../views/ModifyFile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
        backgroundColor: '#262848',
        paddingTop: 12,
        color: '#262848'
      },
    }}>
      <Tab.Screen
        name="Store"
        component={Store}
        options={{tabBarIcon: () => <Icon size={27} name="store" color={'#EEFFFF'} />}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{tabBarIcon: () => <Icon name="person" color={'#EEFFFF'}/>}}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: () => <Icon name="cloud-upload" color={'#EEFFFF'} />,
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator
    screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
        backgroundColor: '#262848',
      },
    }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Back"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="MyFiles" component={MyFiles} />
          <Stack.Screen name="ModifyFile" component={ModifyFile} />
        </>
      ) : (
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
