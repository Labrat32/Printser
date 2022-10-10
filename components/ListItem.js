import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/Variables';
import {ListItem as RNEListItem, Avatar, Button} from '@rneui/themed';
import {ButtonGroup} from '@rneui/base';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';

const ListItem = ({singleMedia, navigation, myFilesOnly}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  // console.log('ListItem: ', singleMedia);

  const doDelete = () => {
    Alert.alert('Delete file', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'DELETE',
        onPress: async () => {
          const token = await AsyncStorage.getItem('userToken');
          await deleteMedia(token, singleMedia.file_id);
          setUpdate(!update);
        },
      },
    ]);
  };

  return (
    <RNEListItem
      containerStyle={{backgroundColor: 'rgba(96, 113, 249, 0.2)', padding: 0, marginLeft: 10, marginRight: 10, margin: 8, borderRadius: 10, height: 180, borderWidth: 0.4, borderColor: '#000000'}}
      bottomDivider
      onPress={() => {
        navigation.navigate('Product', singleMedia);
      }}
    >
      <Avatar
        containerStyle={{height: 180, width: 150}}
        avatarStyle={{borderBottomLeftRadius: 10, borderTopLeftRadius: 10}}
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />
      <RNEListItem.Content>
        <RNEListItem.Title style={{color: '#EEFFFF'}} numberOfLines={1} h4>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle style={{color: '#EEFFFF', marginLeft: 11}} numberOfLines={6}>
          {singleMedia.description}
        </RNEListItem.Subtitle>
        {myFilesOnly && (
          <ButtonGroup
            containerStyle={{width:150, height:50, borderWidth: 0, backgroundColor: 'rgba(96, 113, 249, 0)', marginTop: 5}}
            buttons={[
            <Button
              title={'Modify'}
              titleStyle={{color: '#000000'}}
              onPress={async (index) => {
                if (index === index) {
                  navigation.navigate('ModifyFile', singleMedia);
                }
              }}
            />,
            <Button
            title={'Delete'}
            buttonStyle={{backgroundColor: '#b30000'}}
            titleStyle={{color:'#000000'}}
            onPress={async (index) => {
              if (index !== 0) {
                doDelete();
              }
            }}
            />
          ]}
          />
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
