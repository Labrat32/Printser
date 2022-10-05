import {StyleSheet, Platform} from 'react-native';
export default StyleSheet.create({
  droidSafeArea: {
    backgroundColor: '#272848',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
});
