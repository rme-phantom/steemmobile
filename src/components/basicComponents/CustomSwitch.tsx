import React, { useRef } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const headerHeight = 100;
let scrollValue = 0;
let headerVisible = true;
let focused = false;
export default function HeaderSearch() {
    const animation = useRef(new Animated.Value(1)).current;
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, headerHeight / 2 - 2],
    });
    const inputTranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [headerHeight / 4, 0],
    });
    const opacity = animation;
    const onScroll = e => {
        if (focused) return;
        const y = e.nativeEvent.contentOffset.y;
        if (y > scrollValue && headerVisible && y > headerHeight / 2) {
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
            headerVisible = false;
        }
        if (y < scrollValue && !headerVisible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
            headerVisible = true;
        }
        scrollValue = y;
    };
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: headerHeight }}
                onScroll={onScroll}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(x => (
                    <View style={styles.item} key={x} />
                ))}
            </ScrollView>
            <View style={[styles.header]}>
                <Animated.View
                    style={[styles.searchContainer, { transform: [{ translateY }] }]}>
                    <Animated.View
                        style={[
                            styles.inputContainer,
                            { opacity, transform: [{ translateY: inputTranslateY }] },
                        ]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search.."
                            onFocus={() => (focused = true)}
                            onBlur={() => (focused = false)}
                        />
                    </Animated.View>
                </Animated.View>
                <Animated.View style={[styles.firstContainer]}>
                    <Text style={styles.name}>App Name</Text>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        height: 100,
        marginTop: 5,
        marginHorizontal: 5,
        backgroundColor: '#345678',
    },
    header: {
        height: headerHeight / 2,
        width: '100%',
        position: 'absolute',
    },
    firstContainer: {
        height: headerHeight / 2,
        backgroundColor: '#fff',
        elevation: 2,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    searchContainer: {
        height: headerHeight / 2,
        backgroundColor: '#fff',
        width: '100%',
        position: 'absolute',
        elevation: 2,
        padding: 10,
        paddingHorizontal: 15,
        overflow: 'hidden',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#eee',
        borderRadius: 3,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        padding: 0,
        paddingHorizontal: 15,
        fontSize: 15,
    },
});
