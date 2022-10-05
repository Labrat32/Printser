import {StyleSheet, Platform} from 'react-native';
export default StyleSheet.create({
  droidSafeArea: {
    backgroundColor: '#272848',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    flex: 1,
  },
});
