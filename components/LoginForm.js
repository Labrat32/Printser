import {Controller, useForm} from 'react-hook-form';
import {Image, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useLogin} from '../hooks/ApiHooks';
import {Button, Icon, Input, Text} from '@rneui/themed';
import logo from '../assets/asd.png';

const LoginForm = () => {
  const {isLoggedIn, setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useLogin();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', password: ''},
  });

  const logIn = async (loginCredentials) => {
    try {
      const userData = await postLogin(loginCredentials);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <View style={{marginTop: 60, display: 'flex', borderWidth: 0}}>
      <Image
        source={logo}
        style={{alignSelf: 'center', width: 260, height: 150}}
      />
      <Text
        style={{
          fontSize: 30,
          color: '#EEFFFF',
          marginLeft: 40,
          marginTop: 50,
        }}
      >
        Login
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.6)',
          marginLeft: 40,
          marginTop: 3,
          marginBottom: 20,
        }}
      >
        Please sign in to continue.
      </Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            inputStyle={{
              marginTop: 10,
              margin: 40,
              backgroundColor: '#262848',
              borderRadius: 30,
              elevation: 17,
              color: '#EEFFFF',
              borderWidth: 1,
              height: 50,
              paddingLeft: 20,
            }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
            placeholderTextColor={'#EEFFFF'}
            errorMessage={
              errors.username?.type === 'required' && (
                <Text style={{color: '#EEFFFF'}}>This is required.</Text>
              )
            }
          />
        )}
        name="username"
      />
      <Controller

        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            inputStyle={{
              marginTop: 10,
              margin: 40,
              backgroundColor: '#262848',
              borderRadius: 30,
              borderWidth: 1,
              elevation: 17,
              height: 50,
              paddingLeft: 20,
              color: '#EEFFFF',
            }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={'#EEFFFF'}
            autoCapitalize="none"
            errorMessage={
              errors.password && (
                <Text style={{color: '#EEFFFF'}}>This is required.</Text>
              )
            }
          />
        )}
        name="password"
      />
      <Button
        buttonStyle={{
          display: 'flex',
          alignSelf: 'center',
          width: 140,
          height: 42,
          borderRadius: 30,
          backgroundColor: '#54C1F0',
          marginTop: 30,
        }}
        title="Login"
        onPress={handleSubmit((data) => logIn(data))}
      />
    </View>
  );
};

export default LoginForm;
