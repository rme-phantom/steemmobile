import { LayoutAnimation, TouchableOpacity, View, ViewStyle } from "react-native"
import { MD2Colors } from "react-native-paper";

interface Props {
    onPress?: () => void;
    style?: ViewStyle;

}

const ViewBar = (props: Props) => {
    const { onPress, style } = props;
    return (
        <TouchableOpacity
            onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                if (onPress)
                    onPress();
            }} style={[
                {
                    width: 100, height: 10,
                    backgroundColor: MD2Colors.transparent,
                    position: 'absolute', bottom: 0, alignSelf: 'center',
                    justifyContent: 'center', padding: 10

                }, style
            ]}>
            <View style={[
                {
                    width: 80, height: 4,
                    borderRadius: 40, backgroundColor: MD2Colors.white,
                    alignSelf: 'center',
                    opacity: 0.6
                }, style
            ]} />
        </TouchableOpacity>
    )
}

export default ViewBar;