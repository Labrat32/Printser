import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Button, Icon} from '@rneui/themed';

const Store = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Icon name='add-circle-outline' size={42}  style={{display: 'flex', alignSelf: 'flex-end', bottom: 1}} color={'#EEFFFF'} onPress={() => {navigation.navigate('Upload');}}/>
      <List navigation={navigation}></List>
    </SafeAreaView>
  );
};

Store.propTypes = {
  navigation: PropTypes.object,
};

export default Store;
