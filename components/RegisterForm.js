import {Controller, useForm} from 'react-hook-form';
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useLogin, useUser} from '../hooks/ApiHooks';
import {Button, Icon, Input, Text} from '@rneui/themed';
import {ScrollView} from 'react-native';

const RegisterForm = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);
  const {checkUsername, postUser} = useUser();
  // const {postLogin} = useLogin();
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', full_name: '', email: '', password: ''},
    mode: 'onBlur',
  });

  const register = async (userData) => {
    delete userData.confirmPassword;
    console.log('Register userdata', userData);
    try {
      const result = await postUser(userData);
      console.log(result);
    } catch (error) {
      console.error('Registerform error', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{
          paddingBottom: 200,
        }}
      >
      <View style={{marginTop: 70}}>
        <Text
          style={{
            fontSize: 40,
            color: '#EEFFFF',
            marginLeft: 30,
          }}
        >
          Create Account
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.6)',
            marginLeft: 35,
            marginTop: 3,
            marginBottom: 40,
          }}
        >
          Please fill the input fields.
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 2,
            validate: async (value) => {
              const available = await checkUsername(value);
              return available ? true : 'Username unavailable!';
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputStyle={{
                marginLeft: 30,
                marginRight: 30,
                marginTop: 0,
                marginBottom: 0,
                height: 50,
                backgroundColor: '#262848',
                elevation: 10,
                color: '#EEFFFF',
                borderRadius: 30,
                borderWidth: 0.4,
                paddingLeft: 20,
              }}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              autoCapitalize="none"
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              errorMessage={
                (errors.username?.type === 'required' && (
                  <Text style={{color: '#EEFFFF'}}>This is required.</Text>
                )) ||
                (errors.username?.type === 'minLength' && <Text style={{color: '#EEFFFF'}}>Min 2.</Text>) ||
                (errors.username?.type === 'validate' && (
                  <Text style={{color: '#EEFFFF'}}>{errors.username.message}</Text>
                ))
              }
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: false,
            minLength: 3,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputStyle={{
                marginLeft: 30,
                marginRight: 30,
                marginTop: 0,
                marginBottom: 0,
                height: 50,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 10,
                color: '#EEFFFF',
                borderWidth: 0.4,
                paddingLeft: 20,
              }}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={false}
              placeholder="Fullname"
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            />
          )}
          name="full_name"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value: /^[a-z0-9.]{2,128}@[a-z0-9.]{5,128}/i,
              message: 'Must be valid email.',
            },
            message: 'Must be valid email.',
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputStyle={{
                marginLeft: 30,
                marginRight: 30,
                marginTop: 0,
                marginBottom: 0,
                height: 50,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 10,
                color: '#EEFFFF',
                borderWidth: 0.4,
                paddingLeft: 20,
              }}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={false}
              placeholder="Email"
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              autoCapitalize="none"
              errorMessage={errors.email && <Text style={{color: '#EEFFFF'}}>{errors.email.message}</Text>}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Required'},
            minLength: {value: 5, message: 'Min length 5. chars'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputStyle={{
                marginLeft: 30,
                marginRight: 30,
                marginTop: 0,
                marginBottom: 0,
                height: 50,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 10,
                color: '#EEFFFF',
                borderWidth: 0.4,
                paddingLeft: 20,
              }}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              autoCapitalize="none"
              errorMessage={
                errors.password && <Text style={{color: '#EEFFFF'}}>{errors.password.message}</Text>
              }
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (value === getValues('password')) {
                return true;
              } else {
                return 'Does not match password.';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Input
                inputStyle={{
                  marginLeft: 30,
                  marginRight: 30,
                  marginTop: 0,
                  marginBottom: 0,
                  height: 50,
                  backgroundColor: '#262848',
                  borderRadius: 30,
                  elevation: 10,
                  color: '#EEFFFF',
                  borderWidth: 0.4,
                  paddingLeft: 20,
                }}
                inputContainerStyle={{borderBottomWidth: 0}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder=" Confirm password"
                placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                autoCapitalize="none"
                errorMessage={
                  errors.confirmPassword && (
                    <Text style={{color: '#EEFFFF'}}>{errors.confirmPassword.message}</Text>
                  )
                }
              />
            </TouchableWithoutFeedback>
          )}
          name="confirmPassword"
        />

        <Button
          buttonStyle={{
            display: 'flex',
            alignSelf: 'center',
            width: 140,
            height: 42,
            borderRadius: 30,
            backgroundColor: '#54C1F0',
            marginTop: 10,
          }}
          title="Register"
          onPress={handleSubmit((data) => register(data))}
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default RegisterForm;
