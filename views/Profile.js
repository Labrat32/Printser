import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, Card, ListItem, Icon, Avatar} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {TextComponent, View} from 'react-native';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('https://placekitten.com/640');
  const {getFilesByTag} = useTag();

  console.log(isLoggedIn);

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

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  return (
    <View style={{flex:1, backgroundColor: '#272848'}}>
      <Card containerStyle={{backgroundColor: '#262848', borderWidth: 0, elevation: 0, margin: 0, padding: 0, flex: 1}}>
        <Card.Image source={{uri: avatar}} containerStyle={{borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}/>
        <ListItem containerStyle={{backgroundColor: '#262848'}}>
          <Avatar
            icon={{name: 'person', type: 'material'}}
            containerStyle={{backgroundColor: '#262848'}}
          />
          <Text style={{color: '#EEFFFF'}}>Full name: {user.full_name}</Text>
        </ListItem>
        <ListItem containerStyle={{backgroundColor: '#262848'}}>
          <Avatar
            icon={{name: 'contact-mail', type: 'material'}}
            containerStyle={{backgroundColor: '#262848'}}
          />
          <Text style={{color: '#EEFFFF'}}>{user.email}</Text>
        </ListItem>
        <ListItem containerStyle={{backgroundColor: '#262848'}}>
          <Avatar
            icon={{name: 'person', type: 'material'}}
            containerStyle={{backgroundColor: '#262848'}}
          />
        <Text style={{color: '#EEFFFF'}}>{user.username}</Text>
        </ListItem>
        <Card.Title style={{color: '#EEFFFF'}}>
          id: {user.user_id}
        </Card.Title>


        <View style={{flexDirection:'row', alignSelf: 'center'}}>
          <Button
          buttonStyle={{
            display: 'flex',
            width: 140,
            height: 42,
            borderRadius: 30,
            backgroundColor: '#54C1F0',
          }}
            title={'MyFiles'}
            onPress={() => {
              navigation.navigate('MyFiles');
            }}
          />
          <Button
            buttonStyle={{
              display: 'flex',
              width: 140,
              height: 42,
              borderRadius: 30,
              backgroundColor: '#54C1F0',
            }}
            title={'Logout'}
            onPress={logout} />
          </View>
      </Card>
    </View>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
