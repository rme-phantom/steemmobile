import { Dimensions } from 'react-native';
import Orientation from 'react-native-orientation-locker';

export const orientations = {
  PORTRAIT: 'PORTRAIT',
  LANDSCAPE_LEFT: 'LANDSCAPE-LEFT',
  LANDSCAPE_RIGHT: 'LANDSCAPE-RIGHT',
  PORTRAIT_UPSIDEDOWN: 'PORTRAIT-UPSIDEDOWN',
  UNKNOWN: 'UNKNOWN',
  LANDSCAPE: 'LANDSCAPE',
};

/**
 * 
 * @returns {
 *  width: width of window based on app orientation ;
 *  height: height of window baed on app orientation ;
 *  nativeWidth: width based on device orientation ;
 *  nativeHeight: height based on deivce orientation ;
 * }
 * 
 */
const getWindowDimensions = () => {
  var initial = Orientation.getInitialOrientation();

  const orientation =  initial;
  const isDeviceRotated = orientation !== orientations.PORTRAIT;

  const nativeDimensions = Dimensions.get('window');

  const width = isDeviceRotated
    ? nativeDimensions.height
    : nativeDimensions.width;
  const height = isDeviceRotated
    ? nativeDimensions.width
    : nativeDimensions.height;

  return {
    width,
    height,
    nativeWidth:nativeDimensions.width,
    nativeHeight:nativeDimensions.height,
  }
} 

export default getWindowDimensions;
