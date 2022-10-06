import React from 'react';
import {Input, Button, Text, Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {Alert, View} from 'react-native';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {applicationTag} from '../utils/Variables';

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
    <Card containerStyle={{flex:1, margin: 0, padding:0, backgroundColor: '#262848', borderWidth:0 }}>
      <Card.Image containerStyle={{borderBottomLeftRadius: 45, borderBottomRightRadius: 45, elevation:10, backgroundColor: '#EEFFFF'}} source={{uri: mediafile || false}}>
      <Button buttonStyle={{backgroundColor: 'transparent', borderRadius: 30, width: 120, alignSelf: 'center', margin:10, marginTop: 50}} titleStyle={{color: '#000000', fontSize: 14}} title="Choose image" onPress={pickImage} />
      </Card.Image>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Title"
            placeholderTextColor={'#EEFFFF'}
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
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Description"
            placeholderTextColor={'#EEFFFF'}
          />
        )}
        name="description"
      />
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 30}}>
        <Button buttonStyle={{backgroundColor: '#54C1F0', borderRadius: 30, width: 120}} title="Reset" onPress={resetForm} />
        <Button
          buttonStyle={{backgroundColor: '#54C1F0', borderRadius: 30, width: 120}}
          title="Upload media"
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Card>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
