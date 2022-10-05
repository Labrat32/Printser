import React, {useState} from 'react';
import {ScrollView, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/Variables';
import {Card, ListItem, Text, Avatar} from '@rneui/themed';
import FullSizeImage from '../components/FullSizeImage';
import {Video} from 'expo-av';
import {useEffect} from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag} from '../hooks/ApiHooks';

const Single = ({route}) => {
  const {filename, title, description, user_id, media_type} = route.params;
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
    <ScrollView>
      <Card>
        <Card.Title>{title}</Card.Title>
        <Card.Divider />
        {media_type === 'image' ? (
          <FullSizeImage
            source={{uri: mediaUrl + filename}}
            PlaceholderContent={<ActivityIndicator />}
            style={{marginBottom: 12}}
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
        <Card.Divider />
        <ListItem>
          <Text>{description}</Text>
        </ListItem>
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>{user_id}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
