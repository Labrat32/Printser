import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/Variables';
import {ListItem as RNEListItem, Avatar} from '@rneui/themed';
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
      containerStyle={{backgroundColor: 'rgba(96, 113, 249, 0.2)', elevation: 16, padding: 10, marginLeft: 20, marginRight: 20, margin: 8, borderRadius: 10, height: 180, borderBottomWidth: 0}}
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      <Avatar
        containerStyle={{height: 140, width: 140}}
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />
      <RNEListItem.Content>
        <RNEListItem.Title numberOfLines={1} h4>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1}>
          {singleMedia.description}
        </RNEListItem.Subtitle>
        {myFilesOnly && (
          <ButtonGroup
            buttons={['Modify', 'Delete']}
            onPress={async (index) => {
              if (index === 0) {
                navigation.navigate('ModifyFile', singleMedia);
              } else {
                doDelete();
              }
            }}
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