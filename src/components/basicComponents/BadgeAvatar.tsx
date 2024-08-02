import { PureComponent } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { Avatar, Badge, MD2Colors, Tooltip } from "react-native-paper";
import { getResizedAvatar } from "../../utils/ImageApis";
import { AppColors } from "../../constants/AppColors";
import { AppRoutes } from "../../constants/AppRoutes";

interface Props {
    name: string;
    reputation?: number;
    avatarSize?: number;
    handleAvatarClick?: (name?: string) => void;
    badgeRight?: number;
    navigation?: any;
    style?: StyleProp<ViewStyle>;
    avatarQuality?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}
class BadgeAvatar extends PureComponent<Props> {

    render() {
        const { name, reputation, handleAvatarClick, avatarSize,
            badgeRight, navigation, style, avatarQuality, disabled } = this.props;
        const reputation_1 = Number(reputation?.toFixed(0));

        // reputation based oolor scheme
        const reputationColorMap = new Map<number, string>([
            [1, MD2Colors.red800],
            [24, MD2Colors.grey800],
            [45, MD2Colors.purple700],
            [60, MD2Colors.deepOrange600],
            [80, MD2Colors.blue900]
        ]);

        let color = MD2Colors.green900;
        for (const [reputation, colorValue] of reputationColorMap) {
            if (reputation_1 <= reputation) {
                color = colorValue;
                break;
            }
        }
        // || AppStrings.ERROR_404
        return (<View style={style}>
            <Tooltip title={name ?? ''}>
                <TouchableOpacity
                    disabled={disabled}
                    style={{ borderRadius: 40, backgroundColor: 'transparent', opacity: 0.9 }}
                    onPress={() => {
                        if (navigation) {
                            navigation.push(AppRoutes.PAGES.ProfilePage, { account: name });
                        } else
                            handleAvatarClick && handleAvatarClick(name)
                    }}>
                    <Avatar.Image style={{ backgroundColor: AppColors.WHITE }}
                        source={{ uri: getResizedAvatar(name, avatarQuality ?? 'small') }} size={avatarSize ?? 40} />
                </TouchableOpacity>
            </Tooltip>
            {reputation && <View style={{ position: 'absolute', right: badgeRight ?? -4, bottom: 0, elevation: 4 }}>
                <View>
                    <Tooltip title={reputation?.toString()} >
                        <Badge size={18} style={{
                            opacity: 0.8,
                            backgroundColor: color, color: 'white'
                        }} >{reputation?.toFixed(0)}</Badge>

                    </Tooltip>
                </View>
            </View>}
        </ View>)
    }
}


export default BadgeAvatar