import React from 'react';
import { StyleSheet, View } from 'react-native';
import times from 'lodash/times';

import getWindowDimensions from '../../../utils/getWindowDimensions';
import { CircularButton } from '../../buttons';
import { Button, IconButton } from 'react-native-paper';
import { Icons } from '../../Icons';
import { HStack } from '@react-native-material/core';

const { width } = getWindowDimensions();

const NumericKeyboard = ({ onPress }) => (
    <View style={styles.container}>
        <View style={styles.buttonGroup}>
            {times(9, (i) => (
                <CircularButton
                    key={i}
                    style={styles.button}
                    text={i + 1}
                    value={i + 1}
                    onPress={onPress}
                />
            ))}
        </View>
        <HStack style={styles.lastButtonGroup} items='center'>

            <Button mode='text' style={styles.button}
                onPress={() => onPress && onPress('clear')}>
                <Icons.MaterialIcons name='close' size={18} />
            </Button>


            <CircularButton
                style={styles.button}
                text={0}
                value={0}
                onPress={(value) => onPress && onPress(value)}
            />

            <Button mode='text' style={styles.button}
                onPress={() => onPress && onPress('trim')}>
                <Icons.MaterialIcons name='backspace' size={18} />
            </Button>


        </HStack>
    </View >
);

export default NumericKeyboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width / 1.8,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    lastButtonGroup: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
    },
    iconButton: {
        fontSize: 25,
        color: 'blue',
    },
    buttonWithoutBorder: {

        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderColor: 'rgba(53, 124, 230, 0.2)',
        marginBottom: 10,
    },

})