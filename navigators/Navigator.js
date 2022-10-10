import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../views/Profile';
import Store from '../views/Store';
import Product from '../views/Product';
import Login from '../views/Login';
import Upload from '../views/Upload';
import {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@rneui/themed';
import MyFiles from '../views/MyFiles';
import ModifyFile from '../views/ModifyFile';
import ModifyProfile from '../views/ModifyProfile';
import PropTypes from 'prop-types';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#262848',
          paddingTop: 8,
          color: '#262848',
          borderTopWidth: 0.2,
          borderTopColor: '#000000'
      },
    }}>
      <Tab.Screen
        name="Store"
        component={Store}
        options={{tabBarIcon: () => <Icon size={27} name="store" color={'#EEFFFF'} />,
        title:'Store',
        headerStyle:{backgroundColor: '#262848', elevation: 15, shadowColor: '#000000', borderBottomWidth: 0.2, borderBottomColor: '#000000'},
        headerTintColor: '#EEFFFF'}}
      />
      <Tab.Screen
        name="Post"
        component={Upload}
        options={{
          tabBarIcon: () => <Icon name="add-circle-outline" color={'#EEFFFF'} />,
          title:'Post',
          headerStyle:{backgroundColor: '#262848', elevation: 15, shadowColor: '#000000', borderBottomWidth: 0.2, borderBottomColor: '#000000'},
          headerTintColor: '#EEFFFF'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{tabBarIcon: () => <Icon name="person" color={'#EEFFFF'}/>,
        title:'Profile',
        headerStyle:{backgroundColor: '#262848', elevation: 15, shadowColor: '#000000', borderBottomWidth: 0.2, borderBottomColor: '#000000'},
        headerTintColor: '#EEFFFF',
        headerRight: () =>
        <Icon
          name='edit'
          color={'#EEFFFF'}
          iconStyle={{fontSize: 33}}
          style={{marginRight: 10}}
          onPress={() => {
            navigation.navigate('ModifyProfile');
          }}
        />,
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
          <Stack.Screen
            options={{
              title:'Product',
              headerStyle:{
                backgroundColor: '#262848',
                elevation: 15,
                shadowColor: '#000000',
                borderBottomWidth: 0.2,
                borderBottomColor: '#000000'
              },
              headerTintColor: '#EEFFFF'
            }}
            name="Product"
            component={Product} />
          <Stack.Screen
            options={{
              title:'My Files',
              headerStyle:{
                backgroundColor: '#262848',
                elevation: 15,
                shadowColor: '#000000',
                borderBottomWidth: 0.2,
                borderBottomColor: '#000000'
              },
              headerTintColor: '#EEFFFF'
            }}
            name="MyFiles"
            component={MyFiles} />
          <Stack.Screen
            options={{
              title:'Modify Post',
              headerStyle:{
                backgroundColor: '#262848',
                elevation: 15,
                shadowColor: '#000000',
                borderBottomWidth: 0.2,
                borderBottomColor: '#000000'
              },
              headerTintColor: '#EEFFFF'
            }}
            name="ModifyFile"
            component={ModifyFile} />
          <Stack.Screen
            options={{
              title:'Modify Profile',
              headerStyle:{
                backgroundColor: '#262848',
                elevation: 15,
                shadowColor: '#000000',
                borderBottomWidth: 0.2,
                borderBottomColor: '#000000'
              },
              headerTintColor: '#EEFFFF'
            }}
            name="ModifyProfile"
            component={ModifyProfile} />
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

Navigator.propTypes = {
  navigation: PropTypes.object,
};

export default Navigator;
