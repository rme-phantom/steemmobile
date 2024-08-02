import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {VStack} from '@react-native-material/core';
import AnimatedLottieView from 'lottie-react-native';
import {MaterialDarkTheme} from '../../utils/theme';

const ErrorFallbackPage = (props: {error: Error; resetError: Function}) => {
  return (
    <VStack
      fill
      style={{
        width: '100%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: MaterialDarkTheme.colors.background,
      }}
      spacing={10}>
      <View>
        <AnimatedLottieView
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
          }}
          loop
          autoPlay
          source={require('../../../assets/anim/error_cross_anim.json')}
        />
      </View>
      <VStack spacing={6} justify="center" items="center">
        <Text variant="titleLarge" style={{color: 'white'}}>
          Something went wrong!
        </Text>
        <Text variant="bodySmall" style={{color: 'white'}}>
          {props?.error?.message}
        </Text>
      </VStack>
      <Button
        style={{marginTop: 10}}
        mode="contained-tonal"
        onPress={() => props.resetError()}>
        Try again
      </Button>
    </VStack>
  );
};
export default ErrorFallbackPage;
