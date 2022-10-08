import React from 'react';
import {Input, Button, Text, Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Alert, Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {mediaUrl} from '../utils/Variables';

const ModifyFile = ({navigation, route}) => {
  const file = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const {putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: file.title, description: file.description},
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(token, data, file.file_id);

      Alert.alert(response.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            setUpdate(!update);
              navigation.navigate('MyFiles');
          },
        },
      ]);
    } catch (error) {
      console.error('onsubmit modify file failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{
          backgroundColor:'#262848',
          paddingBottom: 50,
        }}
      >
    <Card containerStyle={{flex:1, margin: 0, backgroundColor: '#262848', borderColor: '#262848'}}>
      <Card.Image source={{uri: mediaUrl + file.filename}} style={{height: 200}}/>
      <Text style={{color:'#EEFFFF', marginLeft: 40, fontSize: 16, marginTop: 20}}>Title</Text>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
          inputStyle={{
            marginTop: 10,
            marginLeft: 30,
            marginRight: 30,
            marginBottom: 0,
            margin: 40,
            backgroundColor: '#262848',
            borderRadius: 30,
            elevation: 17,
            color: '#EEFFFF',
            borderWidth: 0.4,
            height: 50,
            paddingLeft: 20,
          }}
            inputContainerStyle={{borderBottomWidth: 0}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Title"
            autoCapitalize="words"
            errorMessage={
              (errors.title?.type === 'required' && (
                <Text>This is required.</Text>
              )) ||
              (errors.title?.type === 'minLength' && <Text>Min 3 chars!</Text>)
            }
          />
        )}
        name="title"
      />
      <Text style={{color:'#EEFFFF', marginLeft: 40, fontSize: 16}}>Description</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
            <Input
            inputStyle={{
              display: 'flex',
              marginTop: 10,
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 0,
              margin: 40,
              backgroundColor: '#262848',
              borderRadius: 30,
              elevation: 17,
              color: '#EEFFFF',
              borderWidth: 0.4,
              height: 200,
              paddingLeft: 20,
            }}
            inputContainerStyle={{borderBottomWidth: 0}}
              multiline={true}
              numberOfLines={5}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description"
            />
        )}
        name="description"
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

ModifyFile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyFile;
