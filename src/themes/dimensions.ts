//library
import {Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//components
//screens
//constants

export const {width, height} = Dimensions.get('window');

export const widthRem = width / 100;
export const heightRem = height / 100;

export const screenRem = widthRem + heightRem;
export {wp, hp};
