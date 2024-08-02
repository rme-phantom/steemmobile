import React, { PureComponent } from "react";
import { Card, Text } from "react-native-paper";
import { HStack } from "@react-native-material/core";
import BadgeAvatar from "../../../../basicComponents/BadgeAvatar";
import { AppColors } from "../../../../../constants/AppColors";
import { View } from "react-native";
import TimeAgoWrapper from "../../../../wrappers/TimeAgoWrapper";
import ContentEditedWrapper from "../../../../wrappers/ContentEditedWrapper";
import { CommentMenu } from "../../CommentMenu";

interface Props {
    navigation: any;
    route: any;
    comment: Feed | Post;
    isDetail?: boolean;
    isReply?: boolean;
    isCommunity?: boolean;
    handleTranslate?: (body: string) => void;
    isSearch?: boolean;
}


class ReplyHead extends PureComponent<Props> {

    render() {
        let { comment, isReply, navigation } = this.props;

        comment = isReply ? comment as Post : comment as Feed;


        return (<Card.Title
            style={{ paddingLeft: 0, minHeight: 0, paddingRight: 0 }}
            leftStyle={{
                alignItems: 'center', marginLeft: 4,
                marginRight: 6,
            }}
            left={(props) =>
                <BadgeAvatar {...props} name={comment?.author}
                    navigation={navigation}
                    reputation={comment?.author_reputation}
                    avatarSize={35}
                />
            }
            rightStyle={{ position: 'absolute', right: -10, top: -5 }}
            right={() => <CommentMenu {...this.props} />}
            title={<HStack items="center" spacing={3} >
                <Text variant="labelMedium">{comment?.author}</Text>
                <Text style={{
                    fontSize: 8, textTransform: 'uppercase',
                    opacity: 0.75
                }} variant={'labelSmall'}>{comment?.author_role || 'guest'}</Text>

            </HStack >}
            titleStyle={{ fontWeight: 'bold' }}

            titleVariant='bodyLarge'
            subtitleVariant='bodySmall'
            subtitleStyle={{ marginTop: -5 }}
            subtitle={<HStack spacing={4} >

                {comment?.author_title && <Card style={{ marginEnd: 4 }} mode="contained">
                    <Card.Content style={{
                        paddingHorizontal: 4, paddingVertical: 2,
                        borderColor: AppColors.STEEM, alignItems: 'center',
                    }} >
                        <Text style={{ fontSize: 10, opacity: 0.8 }}>{comment?.author_title}</Text>

                    </Card.Content>

                </Card>}
                <View>
                    <TimeAgoWrapper date={comment?.created * 1000} />
                </View>
                <View>
                    <ContentEditedWrapper createDate={comment?.created * 1000}
                        updateDate={comment?.last_update * 1000} />
                </View>
            </HStack>}


        />)
    }

}

export { ReplyHead }