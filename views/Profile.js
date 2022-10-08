import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, Card, ListItem, Icon, Avatar} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';

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
        <Card.Image source={{uri: avatar}} containerStyle={{borderBottomLeftRadius: 50, borderBottomRightRadius: 50}} style={{height: 200}}/>

        <ListItem containerStyle={styles.lists}>
          <Avatar icon={{name: 'person', type: 'material'}} containerStyle={{backgroundColor: '#262848'}}/>
          <View style={{display:'flex', flexDirection: 'column'}}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)'}}>Full name</Text>
            <Text style={{color: '#EEFFFF', marginLeft: 15}}>{user.full_name}</Text>
          </View>
        </ListItem>

        <ListItem containerStyle={styles.lists}>
          <Avatar icon={{name: 'contact-mail', type: 'material'}} containerStyle={{backgroundColor: '#262848'}}/>
          <View style={{display:'flex', flexDirection: 'column'}}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)'}}>Email</Text>
            <Text style={{color: '#EEFFFF', marginLeft: 15}}>{user.email}</Text>
          </View>
        </ListItem>

        <ListItem containerStyle={styles.lists}>
          <Avatar icon={{name: 'person', type: 'material'}} containerStyle={{backgroundColor: '#262848'}}/>
          <View style={{display:'flex', flexDirection: 'column'}}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)'}}>Username</Text>
            <Text style={{color: '#EEFFFF', marginLeft: 15}}>{user.username}</Text>
          </View>
        </ListItem>

        <ListItem containerStyle={styles.lists}>
          <Avatar icon={{name: 'person', type: 'material'}} containerStyle={{backgroundColor: '#262848'}}/>
          <View style={{display:'flex', flexDirection: 'column'}}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)'}}>Hometown</Text>
            <Text style={{color: '#EEFFFF', marginLeft: 15}}></Text>
          </View>
        </ListItem>

        <ListItem containerStyle={styles.lists}>
          <Avatar icon={{name: 'person', type: 'material'}} containerStyle={{backgroundColor: '#262848'}}/>
          <View style={{display:'flex', flexDirection: 'column'}}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)'}}>Password</Text>
            <Text style={{color: '#EEFFFF', marginLeft: 15}}>{user.password}</Text>
          </View>
        </ListItem>

        <View style={{flexDirection:'row', alignSelf: 'center'}}>
          <Button
          buttonStyle={{
            display: 'flex',
            width: 140,
            height: 42,
            borderRadius: 30,
            backgroundColor: '#EEFFFF',
            margin: 20,
            elevation: 15
          }}
            title={'My Files'}
            titleStyle={{color: '#000000'}}
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
              backgroundColor: '#EEFFFF',
              margin: 20,
              elevation: 15,
            }}
            title={'Logout'}
            titleStyle={{color: '#000000'}}
            onPress={logout} />
          </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  lists: {
    backgroundColor: '#262848',
    elevation: 14,
    borderRadius: 30,
    marginTop: 20,
    padding: 6,
    borderWidth: 0.6,
    borderColor: '#000000',
    marginLeft: 15,
    marginRight: 15
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
