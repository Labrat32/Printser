import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import List from '../components/List';
import PropTypes from 'prop-types';

const MyFiles = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} myFilesOnly={true} />
    </SafeAreaView>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
