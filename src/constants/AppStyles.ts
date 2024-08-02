import {Dimensions, StyleSheet} from 'react-native';
import {AppColors} from './AppColors';

const {width, height} = Dimensions.get('window');

export const AppStyles = StyleSheet.create({
  thumbLargeStyle: {
    marginTop: 5,
    height: height / 6,
    width: '100%',
    backgroundColor: AppColors.WHITE,
    borderRadius: 4,
  },
  thumbSmallStyle: {
    marginTop: 5,
    width: width / 6,
    height: height / 15,
    backgroundColor: AppColors.WHITE,
    borderRadius: 4,
    elevation: 1,
    opacity: 0.8,
  },
  tabFocused: {
    borderRadius: 20,
    backgroundColor: AppColors.RED,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: -5,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabUnFocused: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: -5,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardStyle: {
    backgroundColor: AppColors.CARD_COLOR,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  bottomTabStyle: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 5,
    marginHorizontal: 20,
    // Max Height...
    height: 50,
    borderRadius: 10,
    // Shadow...
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    paddingHorizontal: 20,
    zIndex: 2,
    elevation:4
  },

});
