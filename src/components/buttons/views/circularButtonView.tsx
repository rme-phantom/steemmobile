import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import getWindowDimensions from '../../../utils/getWindowDimensions';
import { Button } from 'react-native-paper';

const { height, width } = getWindowDimensions();

/* Props
 *
 *   @prop { string }    text             - Text inside of button.
 *   @prop { func }      onPress          - When button clicked, this function will call.
 *   @prop { array }     style            - It is addionatly syle for button.
 *   @prop { any }       value            - When button clicked, this value will push with on press func.
 */
const CircularButtonView = ({ text, onPress, style, value }) => (

    <Button style={[style]} mode='outlined'
        onPress={() => onPress && onPress(value)}>
        {text}
    </Button>
);

export default CircularButtonView;