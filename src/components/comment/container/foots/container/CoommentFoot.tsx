import { HStack, VStack } from "@react-native-material/core";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, MD2Colors, MD3Colors, Menu, Text, Tooltip } from "react-native-paper";
import { AppRoutes } from "../../../../../constants/AppRoutes";
import { abbreviateNumber } from "../../../../../utils/utils";
import { useAppSelector } from "../../../../../constants/AppFunctions";
import Icon, { Icons } from "../../../../Icons";
import { useState } from "react";
import PostRewards from "../../../../basicComponents/PostRewards";


interface Props {
    comment: Feed | Post;
    navigation: any;
    route: any;
    onVotersClick: () => void;
    onUpvoteClick: (isReply?: boolean) => void;
    onDownvoteClick: (isReply?: boolean) => void;
    onCommentClick?: () => void;
    onRewardClick?: () => void;
    rootComment: Post | Feed;
    isPostLoading?: boolean;
    rewardAnchorPosition?: "top" | "bottom" | undefined

}


const CommentFoot = (props: Props) => {
    const { navigation, route, comment, onVotersClick, onUpvoteClick,
        onCommentClick, onDownvoteClick, onRewardClick, rootComment, isPostLoading, rewardAnchorPosition } = props;
    const commentInfo = useAppSelector(state => state.commentReducer.values)[`${comment.author}/${comment.permlink}`] ?? comment;

    const loginInfo = useAppSelector(state => state.loginReducer.value);
    const isUpvoted = loginInfo.login && comment.observer_vote && comment.observer_vote === 1 && comment.observer_vote_percent >= 0;
    const isDownvoted = loginInfo.login && comment.observer_vote && comment.observer_vote === 1 && comment.observer_vote_percent < 0;
    const isResteemed = loginInfo.login && comment.observer_resteem && comment.observer_resteem === 1;
    const [showReward, setShowReward] = useState(false);

    return (<HStack spacing={15} items="center" pv={4}>
        <HStack key={'actions-view'} spacing={8}
            style={{ flexDirection: 'row', alignItems: 'center' }}>

            {comment.status === 'upvoting' ? <ActivityIndicator style={{ borderRadius: 20 }}
                color={MD2Colors.teal500} /> :
                <TouchableOpacity disabled={comment.status === 'downvoting'} onPress={() => onUpvoteClick()}>
                    <Icon   {...props} type={Icons.MaterialCommunityIcons}
                        name={isUpvoted ? 'chevron-up-circle' : 'chevron-up-circle-outline'}
                        color={MD2Colors.teal500} style={{}} />
                </TouchableOpacity>}


            {comment.status === 'downvoting' ? <ActivityIndicator style={{ borderRadius: 20 }}
                color={MD2Colors.red400} /> :
                <TouchableOpacity disabled={comment.status === 'upvoting'} onPress={() => onDownvoteClick()}>
                    <Icon  {...props} type={Icons.MaterialCommunityIcons}
                        name={isDownvoted ? 'chevron-down-circle' : 'chevron-down-circle-outline'}
                        color={MD2Colors.red400} style={{}} />
                </TouchableOpacity>}


            <Menu
                visible={showReward}
                onDismiss={() => {
                    setShowReward(false)
                }}
                anchorPosition={rewardAnchorPosition}
                contentStyle={{
                    padding: 6,
                    borderRadius: 10
                }}

                anchor={<View>
                    <Tooltip title={comment.payout?.toLocaleString('en-US')}>
                        <TouchableOpacity onPress={() => {
                            setShowReward(true);
                            if (onRewardClick)
                                onRewardClick();
                        }}><Text style={{ letterSpacing: 1 }} variant="labelSmall">${abbreviateNumber(comment.payout, 3)}</Text>
                        </TouchableOpacity>
                    </Tooltip>
                </View>
                }>

                <PostRewards comment={comment} />
            </Menu>

        </HStack>


        <HStack items="center" key={'upvotes-view'} spacing={4}
            style={{ flexDirection: 'row', }}>

            <TouchableOpacity
                onPress={onVotersClick} >
                <Icon  {...props} type={Icons.MaterialCommunityIcons}
                    name={'chevron-up'} color={MD3Colors.primary70} style={{}} />
            </TouchableOpacity>
            <View>
                <Tooltip title={comment.upvote_count?.toLocaleString('en-US')}>
                    <Text style={{ letterSpacing: 1 }} variant="labelSmall">
                        {abbreviateNumber(comment.upvote_count)}</Text>
                </Tooltip>
            </View>
        </HStack>

        <HStack key={'comments-view'} spacing={4} items="center">

            {isPostLoading ? <ActivityIndicator style={{ borderRadius: 20 }}
                color={MD2Colors.red400} /> :
                <TouchableOpacity onPress={() => {
                    if (onCommentClick) {
                        onCommentClick()
                    }
                }}>
                    <Icon type={Icons.MaterialCommunityIcons}
                        name={'comment-multiple'} color={MD3Colors.primary70}
                        style={{}} />
                </TouchableOpacity>}
            <View>
                <Tooltip title={comment.children?.toLocaleString('en-US')}>
                    <Text style={{ letterSpacing: 1 }} variant="labelSmall">{abbreviateNumber(comment.children)}</Text>
                </Tooltip>
            </View>

        </HStack>


        <HStack key={'resteem-view'} spacing={4}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            {<TouchableOpacity onPress={() => {
                try {

                    navigation.push(AppRoutes.PAGES.ResteemsPage, { comment: comment });
                }
                catch (e) {
                    console.log('Failed resteem open', String(e))
                }
            }}>
                <Icon type={Icons.MaterialIcons}
                    name={isResteemed ? 'repeat-one' : 'repeat'}
                    color={MD3Colors.primary70} style={{}} />
            </TouchableOpacity>}
            <View>
                <Tooltip title={comment.resteem_count?.toLocaleString('en-US')}>
                    <Text style={{ letterSpacing: 1 }} variant="labelSmall">{abbreviateNumber(comment.resteem_count)}</Text>
                </Tooltip>
            </View>
        </HStack>
    </HStack >)
}

export { CommentFoot }
