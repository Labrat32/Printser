import React, {useContext, useState} from 'react';
import {ScrollView, ActivityIndicator, View} from 'react-native';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/Variables';
import {Card, ListItem, Text, Avatar} from '@rneui/themed';
import FullSizeImage from '../components/FullSizeImage';
import {Video} from 'expo-av';
import {useEffect} from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Product = ({route}) => {
  const {filename, title, description, user_id, username, media_type } = route.params;
  const {user} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('https://placekitten.com/140');
  const {getFilesByTag} = useTag();

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user_id);
      const avatarFile = avatarArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
    } catch (error) {
      console.error('fetchAvatar', error.message);
    }
  };


  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {}
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {}
  };

  const showFullscreenVideo = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {}
  };

  useEffect(() => {
    fetchAvatar();
    unlock();
    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      if (evt.orientationInfo.orientation > 2) {
        showFullscreenVideo();
      }
    });

    return () => {
      lock();
      ScreenOrientation.removeOrientationChangeListener(orientSub);
    };
  }, [videoRef]);

  return (
    <ScrollView style={{padding:0, backgroundColor: '#262848'}}>
      <Card containerStyle={{backgroundColor: '#262848', margin: 0, borderWidth:0, padding: 0}}>
        {media_type === 'image' ? (
          <FullSizeImage
            source={{uri: mediaUrl + filename}}
            PlaceholderContent={<ActivityIndicator />}
            style={{marginBottom: 12, borderBottomLeftRadius: 45, borderBottomRightRadius: 45}}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: mediaUrl + filename}}
            style={{width: 200, heigth: 200}}
            onError={(error) => {
              console.log('Video error:', error);
            }}
            useNativeControls
          />
        )}
        <Card.Title  style={{color: '#EEFFFF', alignSelf: 'flex-start', marginLeft: 20, fontSize: 26}}>{title}</Card.Title>
        <ListItem containerStyle={{backgroundColor: '#262848'}}>
          <Text style={{color: '#EEFFFF', marginLeft: 25}}>{description}</Text>
        </ListItem>
        <ListItem containerStyle={{display: 'flex', flexDirection:'column', backgroundColor: '#262848', margin: 10, borderRadius: 10, borderWidth: 1, borderColor: '#000000', elevation: 4}}>
          <View style={{flexDirection: 'row', display: 'flex', padding: 5, borderBottomWidth: 1, borderBottomColor: '#EEFFFF'}}>
            <Text style={{color: '#EEFFFF', fontSize: 17, marginRight: 170, marginTop: 5}}>Seller info</Text>
            <Avatar avatarStyle={{borderRadius: 15}} source={{uri: avatar}}/>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: '#EEFFFF', marginTop: 10, borderRightWidth: 1, borderRightColor: '#EEFFFF', marginRight: 30, paddingRight: 30}}>Userid</Text>
              <Text style={{color: '#EEFFFF', marginTop: 10, borderRightWidth: 1, borderRightColor: '#EEFFFF', marginRight: 30}}>Contact</Text>
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: '#EEFFFF', marginTop: 10}}>{user_id}</Text>
              <Text style={{color: '#EEFFFF', marginTop: 10}}>{}</Text>
            </View>
          </View>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Product.propTypes = {
  route: PropTypes.object,
};

export default Product;
