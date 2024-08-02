import { VStack, HStack } from "@react-native-material/core";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { MD2Colors, MD3Colors, Menu, Text, Tooltip } from "react-native-paper";
import { CommentPosting } from "../../../../../pages/posting";
import Icon, { Icons } from "../../../../Icons";
import { useAppSelector } from "../../../../../constants/AppFunctions";
import { Role } from "../../../../../utils/community";
import { allowDelete } from "../../../../../utils/StateFunctions";
import { useMemo, useState } from "react";
import { AppConstants } from "../../../../../constants/AppConstants";
import ConfirmationModal from "../../../../basicComponents/ConfirmationModal";
import PostRewards from "../../../../basicComponents/PostRewards";
import { abbreviateNumber } from "../../../../../utils/utils";

interface Props {
    comment: Feed | Post;
    navigation: any;
    route: any;
    onVotersClick: () => void;
    onUpvoteClick: (isReply?: boolean) => void;
    onDownvoteClick: (isReply?: boolean) => void;
    onReplyClick?: (isReply?: boolean) => void;
    onMuteClick: (isReply?: boolean) => void;
    onEditClick: (isReply?: boolean) => void;
    onDeleteClick: (isReply?: boolean) => void;
    onRewardClick?: () => void;
    muteMutation: boolean;
    deleteMutation: boolean;
    rootComment: Post | Feed;

}

const ReplyFoot = (props: Props) => {
    const { comment, onVotersClick, onUpvoteClick,
        onDownvoteClick, onReplyClick, onMuteClick, onEditClick,
        onDeleteClick, muteMutation, deleteMutation, onRewardClick, rootComment } = props;

    const loginInfo = useAppSelector(state => state.loginReducer.value);
    const isUpvoted = loginInfo.login && comment.observer_vote && comment.observer_vote === 1 && comment.observer_vote_percent >= 0;
    const isDownvoted = loginInfo.login && comment.observer_vote && comment.observer_vote === 1 && comment.observer_vote_percent < 0;
    const author = comment.author;
    const username = loginInfo.name;
    const allowReply = Role.canComment(comment.community, comment.observer_role);
    const canEdit = username && username === author;
    const canDelete = !comment.children && username && username === author && allowDelete(comment);
    const isReply = true;
    const canReply = isReply && allowReply && comment['depth'] < 255;
    const canMute = username && Role.atLeast(comment.observer_role, 'mod');
    const [showComment, setShowComment] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [showReward, setShowReward] = useState(false);


    const _handleReplyClick = () => {
        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }
        setIsEdit(false);
        setShowComment(!showComment);
        if (onReplyClick)
            onReplyClick(true)

    }


    const _handleEditClick = () => {
        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }
        setIsEdit(true);
        setShowComment(!showComment);
        onEditClick(true);

    };

    const _handleDeleteClick = async () => {
        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }
        onDeleteClick(true);

    };

    const _handleMuteClick = async (isReply) => {

        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }

        onMuteClick(true);


    };

    const _handleUpvoteClick = () => {
        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }
        onUpvoteClick(true);
    };

    const _handleDownvoteClick = () => {
        if (!loginInfo.login) {
            AppConstants.SHOW_TOAST('Login to continue', '');
            return
        }
        onDownvoteClick(true);
    };

    return useMemo(() => (
        <VStack>
            <HStack spacing={6} items="center">
                <HStack key={'actions-view'} spacing={6} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {comment.status === 'upvoting' ? (
                        <ActivityIndicator style={{ borderRadius: 20 }} color={MD2Colors.teal500} />
                    ) : (
                        <TouchableOpacity disabled={comment.status === 'idle'} onPress={_handleUpvoteClick}>
                            <Icon
                                size={25}
                                {...props}
                                type={Icons.MaterialCommunityIcons}
                                name={isUpvoted ? 'chevron-up-circle' : 'chevron-up-circle-outline'}
                                color={MD2Colors.teal500}
                                style={{}}
                            />
                        </TouchableOpacity>
                    )}

                    {comment.status === 'downvoting' ? (
                        <ActivityIndicator style={{ borderRadius: 20 }} color={MD2Colors.red400} />
                    ) : (
                        <TouchableOpacity disabled={comment.status === 'idle'} onPress={_handleDownvoteClick}>
                            <Icon
                                size={25}
                                {...props}
                                type={Icons.MaterialCommunityIcons}
                                name={isDownvoted ? 'chevron-down-circle' : 'chevron-down-circle-outline'}
                                color={MD2Colors.red400}
                                style={{}}
                            />
                        </TouchableOpacity>
                    )}

                    <Menu
                        visible={showReward}
                        onDismiss={() => {
                            setShowReward(false);
                        }}
                        // anchorPosition="top"
                        contentStyle={{
                            padding: 6,
                            borderRadius: 10,
                        }}
                        anchor={<View>
                            <Tooltip title={comment.payout?.toLocaleString('en-US')}>
                                <TouchableOpacity onPress={() => {
                                    setShowReward(true);
                                    if (onRewardClick) onRewardClick();
                                }}>
                                    <Text style={{ letterSpacing: 1 }} variant="labelSmall">${abbreviateNumber(comment.payout, 3)}</Text>
                                </TouchableOpacity>
                            </Tooltip>
                        </View>
                        }
                    >
                        <VStack>
                            <HStack>
                                <PostRewards comment={comment} />
                            </HStack>
                        </VStack>
                    </Menu>

                    <HStack items="center" key={'upvotes-view'} spacing={4}
                        style={{ flexDirection: 'row' }}>

                        {comment.upvote_count ? <TouchableOpacity
                            onPress={onVotersClick} >
                            <Icon size={20} {...props} type={Icons.MaterialCommunityIcons} name={'chevron-up'} color={MD3Colors.primary70} style={{}} />

                        </TouchableOpacity> : null}

                        {comment.upvote_count ?
                            <View>
                                <Tooltip title={comment.upvote_count?.toLocaleString('en-US')}>
                                    <Text style={{ letterSpacing: 1 }} variant="labelSmall">
                                        {abbreviateNumber(comment.upvote_count)}</Text>
                                </Tooltip>
                            </View>
                            : null}


                    </HStack>

                </HStack>

                <HStack items="center" spacing={6}>
                    <HStack style={{ height: 14, width: 1, backgroundColor: MD2Colors.grey600, opacity: 0.5 }}></HStack>
                    {canReply && (
                        <TouchableOpacity onPress={_handleReplyClick}>
                            <Text variant="labelMedium">{showComment ? 'Cancel' : 'Reply'}</Text>
                        </TouchableOpacity>
                    )}

                    {canMute && (
                        <TouchableOpacity onPress={_handleMuteClick} disabled={muteMutation}>
                            {muteMutation ? (
                                <ActivityIndicator size={15} />
                            ) : (
                                <Text variant="labelMedium">{comment.is_muted ? 'Unmute' : 'Mute'}</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {canEdit && (
                        <TouchableOpacity onPress={_handleEditClick}>
                            <Text variant="labelMedium">Edit</Text>
                        </TouchableOpacity>
                    )}

                    {canDelete && (
                        <TouchableOpacity onPress={() => setConfirmation(!confirmation)} disabled={deleteMutation ?? false}>
                            {deleteMutation ? <ActivityIndicator size={15} /> : <Text variant="labelMedium">Delete</Text>}
                        </TouchableOpacity>
                    )}
                </HStack>
            </HStack>
            {showComment && (
                <CommentPosting
                    {...props}

                    containerStyle={{ marginTop: 10 }}
                    isEdit={isEdit}
                    handleOnComment={() => {
                        setShowComment(false);
                    }}
                    handleOnError={() => { }}
                    {...props}
                    comment={comment as Post}
                />
            )}
            {confirmation && (
                <ConfirmationModal
                    visible={confirmation}
                    setVisible={setConfirmation}
                    body="Do you really want to delete this comment?"
                    primaryText="Delete"
                    handlePrimaryClick={_handleDeleteClick}
                />
            )}
        </VStack>
    ), [comment, showReward, onRewardClick, onVotersClick,
        showComment, canReply, muteMutation, deleteMutation, canEdit, canDelete, confirmation]);
}

export { ReplyFoot }