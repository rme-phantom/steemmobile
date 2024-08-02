/* eslint-disable react/no-array-index-key */
import React, {Component} from 'react';
import {Animated, View} from 'react-native';

// Styles
import {StyleSheet} from 'react-native';
import {MD2Colors} from 'react-native-paper';

class PinAnimatedInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.dots = [];

    this.dots[0] = new Animated.Value(0);
    this.dots[1] = new Animated.Value(0);
    this.dots[2] = new Animated.Value(0);
    this.dots[3] = new Animated.Value(0);
  }

  render() {
    const {pin} = this.props;
    const marginBottom = [];

    [...Array(4)].map((item, index) => {
      marginBottom[index] = this.dots[index].interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 20, 0],
      });
    });

    return (
      <View style={[styles.container]}>
        {this.dots.map((val, index) => {
          if (pin.length > index) {
            return (
              <Animated.View
                key={index ?? `passwordItem-${index}`}
                style={[
                  styles.input,
                  styles.inputWithBackground,
                  {bottom: marginBottom[index]},
                ]}
              />
            );
          }
          return (
            <View key={index ?? `passwordItem-${index}`} style={styles.input} />
          );
        })}
      </View>
    );
  }
}
export default PinAnimatedInput;
/* eslint-enable */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  inputWithBackground: {
    backgroundColor: 'rgba(53, 124, 230, 0.8)',
  },
  input: {
    justifyContent: 'center',
    height: 15,
    margin: 10,
    width: 15,
    borderRadius: 20 / 2,
    borderWidth: 1,
    borderColor: 'rgba(53, 124, 230, 0.4)',
    backgroundColor: MD2Colors.transparent,
  },
});
