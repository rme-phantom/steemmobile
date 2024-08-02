import { PureComponent } from "react";
import { AppColors } from "../../constants/AppColors";
import { Card, Text, Tooltip } from "react-native-paper";
import { StyleProp, View, ViewStyle } from "react-native";

interface Props {
    title: string;
    cardMode?: 'elevated' | 'outlined' | 'contained';
    cardStyle?: StyleProp<ViewStyle>;

}

export class AuthorTitleCard extends PureComponent<Props> {
    render() {
        const { title, cardMode, cardStyle } = this.props;
        return (title && <Card mode={cardMode ?? "elevated"}>
            <Card.Content style={[{
                paddingHorizontal: 4, paddingVertical: 2,
                borderColor: AppColors.STEEM, alignItems: 'center'

            }, cardStyle]} >
                <View>
                    <Tooltip title={title}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 10, opacity: 0.8,
                                maxWidth: 170,
                                alignSelf: 'center'
                            }}>{title}</Text>
                    </Tooltip>
                </View>
            </Card.Content>
        </Card >
        )
    }
}
