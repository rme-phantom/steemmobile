import { useContext, useEffect } from "react";
import ActionSheet from "react-native-actions-sheet";
import { PreferencesContext } from "../../contexts/ThemeContext";
import { Button, MD2Colors, Text } from "react-native-paper";
import { MaterialDarkTheme, MaterialLightTheme } from "../../utils/theme";
import AnimatedLottieView from "lottie-react-native";
import { Linking, Platform, View } from "react-native";
import { HStack, VStack } from "@react-native-material/core";
import { closeActionSheet, openActionSheet } from "../../utils/utils";
import { checkVersion } from "react-native-check-version";
import VersionNumber from 'react-native-version-number';

const CheckUpdate = () => {

    const { isThemeDark } = useContext(PreferencesContext);

    useEffect(() => {
        checkVersion().then((version) => {
            const currentVersion = VersionNumber.appVersion;
            if (currentVersion < version.version) {
                openActionSheet('update-sheet');
            }
        });

    }, [])
    return <ActionSheet
        id={'update-sheet'}
        statusBarTranslucent={false}
        gestureEnabled={true}
        drawUnderStatusBar={false}
        indicatorStyle={{ backgroundColor: MD2Colors.grey300 }}
        containerStyle={{
            paddingHorizontal: 12,
            backgroundColor: isThemeDark ? MaterialDarkTheme.colors.background :
                MaterialLightTheme.colors.background, minHeight: 400
        }}
        springOffset={50}
        defaultOverlayOpacity={0.3}
    >

        <VStack spacing={50} center>
            <View>
                <AnimatedLottieView
                    style={{
                        width: 150,
                        height: 150,
                        alignSelf: 'center',
                    }} loop autoPlay
                    source={require('../../../assets/anim/update_anim.json')}
                />
            </View>

            <Text variant='labelMedium'>Update Available!</Text>
            <HStack center spacing={20}>
                <Button mode="text"
                    onPress={() => { closeActionSheet('update-sheet') }}>Remind Later</Button>
                <Button mode="contained"
                    onPress={() => {
                        Linking.openURL(
                            Platform.OS === 'android' ? 'market://details?id=com.steempro.mobile' :
                                'itms-apps://itunes.apple.com/us/app/apple-store/?mt=8'
                        );
                    }}
                >Update</Button>



            </HStack>

        </VStack>
    </ActionSheet>

}

export default CheckUpdate;