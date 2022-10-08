import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Text} from '@rneui/themed';

const Login = ({navigation}) => {
  // props is needed for navigation
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [showRegForm, setShowRegForm] = useState(false);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken != null) {
        const userData = await getUserByToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Login - checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#272848',
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: '#272848',
          flex: 10,
        }}
      >
        {showRegForm ? <RegisterForm /> : <LoginForm />}
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'flex-end',
          marginBottom: 20,
          backgroundColor: '#272848',
        }}
      >
        <Button
          buttonStyle={{
            width: '100%',
            height: 40,
            backgroundColor: '#262848',
            alignSelf: 'center',
          }}
          title={
            showRegForm
              ? 'Already have an account? Sign in!'
              : "Don't have an account? Sign up!"
          }
          onPress={() => {
            setShowRegForm(!showRegForm);
          }}
        ></Button>
      </View>
    </View>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
