import React from 'react';
import {Input, Button, Text, Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {Alert} from 'react-native';
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
            // navigation.navigate('MyFiles');
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
    <Card containerStyle={{flex:1, margin: 0, backgroundColor: '#262848', borderColor: '#262848'}}>
      <Card.Image source={{uri: mediaUrl + file.filename}} style={{height: 200}}/>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
          inputStyle={{
            marginTop: 30,
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
      <Controller
        control={control}
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
  );
};

ModifyFile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyFile;
