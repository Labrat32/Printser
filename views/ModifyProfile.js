import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, KeyboardAvoidingView, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Button, Card, Input, Text} from '@rneui/themed';
import {mediaUrl} from '../utils/Variables';


const ModifyProfile = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {putUser} = useUser();
  const {user, update, setUpdate} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('https://placekitten.com/640');


  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatarFile = avatarArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
    } catch (error) {
      console.error('fetchAvatar', error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: user.username, password: user.password, email: user.email},
  });

  const onSubmit = async (userData) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putUser(token, userData);

      Alert.alert(response.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('Profile');
          },
        },
      ]);
    } catch (error) {
      console.error('Onsubmit modify profile failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <ScrollView
        style={{
          backgroundColor:'#262848',
          paddingBottom: 50,
        }}
      >
    <Card containerStyle={{flex:1, margin: 0, padding: 0, backgroundColor: '#262848', borderColor: '#262848'}}>
      <Card.Image source={{uri: avatar}} containerStyle={{borderBottomLeftRadius: 50, borderBottomRightRadius: 50, elevation: 10}} style={{height: 200}}/>
      <Text style={{color:'#EEFFFF', marginLeft: 40, fontSize: 16, marginTop: 0}}>Email</Text>
      <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
              inputStyle={{
                marginTop: 2,
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 0,
                margin: 40,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 8,
                color: '#EEFFFF',
                borderWidth: 0.4,
                height: 50,
                paddingLeft: 20,
              }}
                inputContainerStyle={{borderBottomWidth: 0}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
                autoCapitalize="words"
                errorMessage={
                  (errors.title?.type === 'required' && (
                    <Text>This is required.</Text>
                  )) ||
                  (errors.title?.type === 'minLength' && <Text>Min 3 chars!</Text>)
                }
              />
            )}
            name="email"
          />
      <Text style={{color:'#EEFFFF', marginLeft: 40, fontSize: 16, marginTop: 0}}>Username</Text>
        <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
              inputStyle={{
                marginTop: 2,
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 0,
                margin: 40,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 8,
                color: '#EEFFFF',
                borderWidth: 0.4,
                height: 50,
                paddingLeft: 20,
              }}
                inputContainerStyle={{borderBottomWidth: 0}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Username"
                autoCapitalize="words"
                errorMessage={
                  (errors.title?.type === 'required' && (
                    <Text>This is required.</Text>
                  )) ||
                  (errors.title?.type === 'minLength' && <Text>Min 3 chars!</Text>)
                }
              />
            )}
            name="username"
          />
          <Text style={{color:'#EEFFFF', marginLeft: 40, fontSize: 16, marginTop: 0}}>Password</Text>
        <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
              inputStyle={{
                marginTop: 2,
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 0,
                margin: 40,
                backgroundColor: '#262848',
                borderRadius: 30,
                elevation: 8,
                color: '#EEFFFF',
                borderWidth: 0.4,
                height: 50,
                paddingLeft: 20,
              }}
                inputContainerStyle={{borderBottomWidth: 0}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                autoCapitalize="words"
                errorMessage={
                  (errors.title?.type === 'required' && (
                    <Text>This is required.</Text>
                  )) ||
                  (errors.title?.type === 'minLength' && <Text>Min 3 chars!</Text>)
                }
              />
            )}
            name="password"
          />

          <Button
            title="Update"
            titleStyle={{color: '#000000'}}
            buttonStyle={{backgroundColor: '#54C1F0', borderRadius: 30, width: 120, alignSelf: 'center',}}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
      </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyProfile;
