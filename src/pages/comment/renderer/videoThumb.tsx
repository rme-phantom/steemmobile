import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
interface Props {
  contentWidth: number;
  uri?: string;
  onPress?: () => void;
}

const VideoThumb = ({contentWidth, uri, onPress}: Props) => {
  return (
    <TouchableHighlight onPress={onPress} disabled={!onPress}>
      <View pointerEvents={'none'}>
        <ImageBackground
          source={{uri}}
          style={{
            ...styles.videoThumb,
            width: contentWidth,
            height: (contentWidth * 9) / 16,
          }}
          resizeMode={'cover'}>
          <MaterialIcons
            style={styles.playButton}
            size={44}
            name="play-arrow"
          />
        </ImageBackground>
      </View>
    </TouchableHighlight>
  );
};

export default VideoThumb;

const styles = StyleSheet.create({
  videoThumb: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c1c5c7',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3c4449',
  },
});
