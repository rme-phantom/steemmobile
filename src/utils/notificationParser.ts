import { AppRoutes } from '../constants/AppRoutes';
import { isAccountCommunity } from './CommunityValidation';
import { empty_comment } from './placeholders';

export interface NotificationSDS {
    "id": number,
    "time": number,
    "type": string,
    "is_read": number,
    "is_update": number,
    "account": string,
    "author": string,
    "permlink": string,
    "voted_rshares": number,
}
export const notificationParser = (notification?: NotificationSDS) => {
    if (!notification) return {
        routeName: '',
        params: {},
    };
    const { author, permlink, type, account, time } = notification;

    let routeName = '';
    let params;

    switch (type) {
        case 'new_community':
        case 'set_role':
        case 'set_props':
        case 'set_label':
        case 'subscribe':
        case 'follow':
        case 'reply':
        // const permlink = splitted[1];
        // navigation.push(AppRoutes.PAGES.ReplyDetailPage, {
        //     type: 'profie',
        //     comment: empty_comment(author, permlink),
        //     feed_api: 'getAccounPost',
        // });
        // break 
        case 'restteem':
        case 'mention':
        case 'vote':
        case 'mute_post':
        case 'unmute_post':
        case 'pin_post':
        case 'reply_comment':
        case 'unpin_post':
        case 'flag_post':
            // if there is no permlink
            if (!permlink) {

                // if the account is the community hive-
                const is_community = isAccountCommunity(account);
                if (is_community) {
                    routeName = AppRoutes.PAGES.CommunityPage;
                    params = { account: account, category: account, permlink, time }
                } else {
                    routeName = AppRoutes.PAGES.ProfilePage;
                    params = { account: account, permlink, time }
                }

            } else {
                routeName = AppRoutes.PAGES.CommentDetailPage;
                params = { author: author, permlink, time, comment: empty_comment(author, permlink) }


            }
            break;

        case 'error':
            break;
    }
    // profess url for post/content




    return {
        routeName,
        params
    };
};
