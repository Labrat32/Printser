import React from 'react';
import {Input, Button, Text, Card, Icon} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {Alert, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {applicationTag} from '../utils/Variables';
import {KeyboardAvoidingView} from 'react-native';

const Upload = ({navigation}) => {
  const [mediafile, setMediaFile] = useState(null);
  const [mediatype, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {title: '', description: ''},
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setMediaFile(result.uri);
      setMediaType(result.type);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediafile.split('/').pop();
    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    formData.append('file', {
      uri: mediafile,
      name: filename,
      type: mediatype + '/' + extension,
    });

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const mediaResponse = await postMedia(token, formData);
      const tag = {file_id: mediaResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);

      Alert.alert(mediaResponse.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            resetForm();
            setUpdate(!update);
            navigation.navigate('Store');
          },
        },
      ]);
    } catch (error) {
      console.error('onsubmit upload failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMediaFile(null);
    setMediaType(null);
    setValue('title', '');
    setValue('description', '');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{
          backgroundColor: '#262848',
          paddingBottom: 200,
        }}
      >
    <Card containerStyle={{flex:1, margin: 0, padding:0, backgroundColor: '#262848', borderWidth:0 }}>
      <Card.Image containerStyle={{borderBottomLeftRadius: 45, borderBottomRightRadius: 45, elevation: 10, backgroundColor: '#EEFFFF'}} source={{uri: mediafile || false}} style={{height: 200}}>
      <Button buttonStyle={{backgroundColor: 'transparent', borderRadius: 30, width: 120, alignSelf: 'center', margin:10, marginTop: 75}} titleStyle={{color: '#000000', fontSize: 14}} title="Choose image" onPress={pickImage}>Add Image
      <Icon name="add-circle-outline" color={'#000000'} style={{marginLeft: 3}} />
      </Button>
      </Card.Image>
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
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 0,
              backgroundColor: '#262848',
              borderRadius: 30,
              elevation: 10,
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
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            autoCapitalize="words"
            errorMessage={
              (errors.title?.type === 'required' && (
                <Text style={{color: '#EEFFFF'}}>This is required.</Text>
              )) ||
              (errors.title?.type === 'minLength' && <Text style={{color: '#EEFFFF'}}>Min 3 chars!</Text>)
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
              marginTop: 0,
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 0,
              backgroundColor: '#262848',
              borderRadius: 30,
              elevation: 10,
              color: '#EEFFFF',
              borderWidth: 0.4,
              height: 200,
              paddingLeft: 20,

            }}
            multiline={true}
            numberOfLines={5}
            inputContainerStyle={{borderBottomWidth: 0}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Description: Hometown, Printer type, Print area, price/h"
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
          />
        )}
        name="description"
      />

      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 30}}>
        <Button buttonStyle={{backgroundColor: '#EEFFFF', borderRadius: 30, width: 120}} title="Reset" titleStyle={{color: '#000000'}} onPress={resetForm} />
        <Button
          buttonStyle={{backgroundColor: '#54C1F0', borderRadius: 30, width: 120}}
          title="Make a post"
          titleStyle={{color: '#000000'}}
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Card>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
