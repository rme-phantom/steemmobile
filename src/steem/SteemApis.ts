import moment from 'moment';
import {AppConstants} from '../constants/AppConstants';
import {AppFunctions} from '../constants/AppFunctions';
import firestore from '@react-native-firebase/firestore';
import {getNotificationSettings} from '../utils/user';
import {pushFcmToken} from '../services/NotificationService';
// import TronWeb from 'tronweb';

export const getFeedBy = async (
  API: string,
  username: string | undefined | null,
  observer: string = 'null',
  SIGNAL?: AbortSignal,
  LIMIT: number = 1000,
): Promise<Feed[]> => {
  try {
    // construct the API endpoint with the provided parameters
    const R_API = `/feeds_api/${API}/${
      username ? username + '/' : ''
    }${observer}/250/${LIMIT}`;

    console.log(R_API);
    // make the HTTP request and wait for the response
    const promotedFeed: Feed[] = [];
    // if (API === 'getActivePostsByTrending') {
    //   const promoted = await getPromotedPosts(observer);
    //   if (promoted) promotedFeed.push(...promoted);
    // }

    if (API === 'getActiveCommunityPostsByTrending') {
      const pinnedPosts = await getCommunityPinned(
        username! || 'null',
        observer,
      );
      if (pinnedPosts) promotedFeed.push(...pinnedPosts);
    }

    const response = await fetch(AppConstants.SDS_API(R_API), {signal: SIGNAL});

    // if the response is successful, parse the JSON and check if it's valid
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        // map the response to the desired format and return it
        const parsed = AppFunctions.MapSDS(result) as Feed[];
        const unionArray = promotedFeed.concat(parsed);
        // const set1 = new Set(promotedFeed);
        // const unionArray = Array.from(new Set([...set1, ...parsed]));
        return promotedFeed?.length >= 1 ? unionArray : parsed;
      } else {
        // if the response is not valid, throw an error with the message from the server
        throw new Error(result.error!);
      }
    } else {
      // if the response is not successful, throw an error with the HTTP status code
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    // log and re-throw any errors that occur
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getPromotedFeed = async (
  observer: string,
  limit: number = 1,
): Promise<Feed[]> => {
  try {
    const API = 'getActivePostsByAuthor';
    // construct the API endpoint with the provided parameters

    // make the HTTP request and wait for
    let PROMOTED_ACCOUNTS: string[] = [];
    const promotedFeed: Feed[] = [];

    let limit = 1;
    try {
      let fireStoreResult = await firestore()
        .collection('App')
        .doc('promoted')
        .get();
      if (fireStoreResult.exists) {
        // get promoted accounts and limit settings from firestore
        PROMOTED_ACCOUNTS = fireStoreResult.data()?.authors as string[];
        limit = fireStoreResult.data()?.limit;
      } else {
        PROMOTED_ACCOUNTS = [];
      }
    } catch (e) {
      PROMOTED_ACCOUNTS = [];
    }

    for (const account of PROMOTED_ACCOUNTS) {
      const R_API = `/feeds_api/${API}/${
        account ? account + '/' : ''
      }${observer}/250/${limit || limit}`;

      console.log(R_API);
      const response = await fetch(AppConstants.SDS_API(R_API));
      if (response.ok) {
        const result = await response.json();
        if (AppFunctions.ValidateSDS(result)) {
          // map the response to the desired format and return it
          const parsed = AppFunctions.MapSDS(result);
          promotedFeed.push(...parsed);
        } else {
          continue;
        }
      } else {
        continue;
      }
    }

    return promotedFeed;
  } catch (error: any) {
    // log and re-throw any errors that occur
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getPromotedPosts = async (observer?: string): Promise<Feed[]> => {
  try {
    let PROMOTED_POSTS: string[] = [];
    const promotedFeed: Feed[] = [];
    try {
      let fireStoreResult = await firestore()
        .collection('App')
        .doc('promoted_posts')
        .get();
      if (fireStoreResult.exists) {
        // get promoted accounts and limit settings from firestore
        PROMOTED_POSTS = fireStoreResult.data()?.posts as string[];
      } else {
        PROMOTED_POSTS = [];
      }
    } catch (e) {
      PROMOTED_POSTS = [];
    }

    for (const post of PROMOTED_POSTS) {
      const R_API = post;
      console.log('Fetching promoted', R_API);

      const author = post.split('/')[0];
      const permlink = post.split('/')[1];

      const response = await getSimplePost(author, permlink, true, observer);
      if (response) {
        promotedFeed.push({...response, promoted: 1});
      } else {
        continue;
      }
    }
    return promotedFeed;
  } catch (error: any) {
    // log and re-throw any errors that occur
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommunityPinned = async (
  community: string,
  observer = 'null',
): Promise<Feed[]> => {
  try {
    const R_API = `/communities_api/getCommunityPinnedPosts/${community}/${observer}/250`;

    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Feed[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommentWithReplies = async (
  comment: Feed | Post | {author: string; permlink: string},
  observer = 'null',
  signal?: AbortSignal | undefined,
): Promise<Post[]> => {
  try {
    const R_API = `/posts_api/getPostWithReplies/${comment.author}/${comment.permlink}/true/${observer}`;

    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API), {signal: signal});
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Post[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getComment = async (
  comment: Feed,
  observer = 'null',
  signal?: AbortSignal | undefined,
): Promise<Post> => {
  try {
    const R_API1 = `/posts_api/getPost/${'steemit'}/${'firstpost'}/true/${observer}`;

    const R_API = `/posts_api/getPost/${comment.author}/${comment.permlink}/true/${observer}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API), {signal: signal});
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Post;
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getPostReplies = async (
  author: string,
  permlink: string,
  observer: string = 'null',
  withVotes: boolean = true,
): Promise<Post[]> => {
  try {
    const R_API = `/posts_api/getPostReplies/${author}/${permlink}/${withVotes}/${observer}`;
    console.log(R_API);
    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Post[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch global variables:', error);
    throw new Error(error);
  }
};

export const getCommunityReport = async (
  COMMUNITY: string,
): Promise<CommunityReport[]> => {
  try {
    const R_API = `/feeds_api/getActiveCommunityReport/${COMMUNITY}`;
    console.log(R_API);
    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as CommunityReport[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getSearchedContent = async (
  query: string,
  observer = 'null',
  api?: string,
): Promise<Feed[]> => {
  try {
    const R_API = `/content_search_api/${
      api ? api : 'getPostsByText'
    }/${query}/any/${observer}/250/time/DESC/500`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Feed[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getAccountsByPrefix = async (
  prefix: string,
  observer: string = 'null',
): Promise<[{name: string; reputation: number; json_metadata: string}]> => {
  try {
    const R_API = `/accounts_api/getAccountsByPrefix/${prefix}/${observer}/name,reputation,json_metadata,posting_json_metadata/250`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as [
          {name: string; reputation: number; json_metadata: string},
        ];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommentReplies = async (
  comment: Feed,
  observer = 'null',
  signal?: AbortSignal | undefined,
): Promise<Post[]> => {
  try {
    const R_API = `/posts_api/getPostReplies/${comment.author}/${comment.permlink}/true/${observer}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API), {signal: signal});
    if (response.ok) {
      const result = await response.json();
      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Post[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getAccountExt = async (
  username: string,
  observer: string = 'null',
): Promise<AccountExt> => {
  try {
    const R_API = `/accounts_api/getAccountExt/${username}/${observer}`;
    console.log(R_API);
    let notiSettings;
    try {
      notiSettings = await getNotificationSettings(username);
    } catch {
      notiSettings = AppConstants.DEFAULT_NOTIFICATION_SETTINGS;
    }

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result) as AccountExt;
        parsed.notification =
          notiSettings || AppConstants.DEFAULT_NOTIFICATION_SETTINGS;
        return parsed;
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getAccountCommunities = async (
  username: string,
  observer: string = 'null',
): Promise<Community[]> => {
  try {
    const R_API = `/communities_api/getCommunitiesBySubscriber/${username}/${observer}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Community[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getRankedCommunities = async (
  observer: string = 'null',
): Promise<Community[]> => {
  try {
    const R_API = `/communities_api/getCommunitiesByRank/${observer}/1000`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Community[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getRankedWitness = async (
  observer: string = 'null',
): Promise<Witness[]> => {
  try {
    const R_API = `/witnesses_api/getWitnessesByRank/${observer}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Witness[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};
export const getSDSNotifications = async (
  USERNAME: string,
): Promise<SDSNotification[]> => {
  try {
    const R_API = `/notifications_api/getNotificationsByStatusAccount/all/${USERNAME}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as SDSNotification[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommentVotes = async (
  AUTHOR: string,
  PERMLINK: string,
): Promise<PostVote[]> => {
  try {
    const R_API = `/posts_api/getVotes/${AUTHOR}/${PERMLINK}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as PostVote[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommentResteems = async (
  AUTHOR: string,
  PERMLINK: string,
): Promise<PostResteem[]> => {
  try {
    const R_API = `/post_resteems_api/getResteems/${AUTHOR}/${PERMLINK}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as PostResteem[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};
export const getFollowers = async (AUTHOR: string): Promise<string[]> => {
  try {
    const R_API = `/followers_api/getFollowers/${AUTHOR}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as string[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getFollowings = async (AUTHOR: string): Promise<string[]> => {
  try {
    const R_API = `/followers_api/getFollowing/${AUTHOR}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as string[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getIncomingDelegations = async (
  AUTHOR: string,
): Promise<Delegation[]> => {
  try {
    const R_API = `/delegations_api/getIncomingDelegations/${AUTHOR}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Delegation[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getOutgoingDelegations = async (
  AUTHOR: string,
): Promise<Delegation[]> => {
  try {
    const R_API = `/delegations_api/getOutgoingDelegations/${AUTHOR}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Delegation[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getExpiringDelegations = async (
  AUTHOR: string,
): Promise<DelegationExpiring[]> => {
  try {
    const R_API = `/delegations_api/getExpiringDelegations/${AUTHOR}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as DelegationExpiring[];
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getCommunity = async (
  username: string,
  observer: string = 'null',
): Promise<Community> => {
  try {
    const R_API = `/communities_api/getCommunity/${username}/${observer}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Community;
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getLastReadTime = async (USERNAME: string): Promise<number> => {
  try {
    const start_date = moment().subtract(30, 'days').unix();
    const end_date = moment().unix();

    const R_API = `/account_history_api/getHistoryByOpTypesTime/${USERNAME}/custom_json/${start_date}-${end_date}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result) as AccountHistory[];
        const filtered = parsed.filter(item => item.op[1]['id'] === 'notify');
        const date = filtered.reverse()[0].time;

        return date;
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getAccountHistory = async (
  USERNAME: string,
): Promise<AccountHistory[]> => {
  try {
    const start_date = moment().subtract(30, 'days').unix();
    const end_date = moment().unix();
    const filters = `withdraw_vesting,cancel_transfer_from_savings,claim_reward_balance,fill_convert_request,fill_order,fill_transfer_from_savings,fill_vesting_withdraw,
transfer,transfer_from_savings,transfer_to_savings,transfer_to_vesting`;

    const R_API = `/account_history_api/getHistoryByOpTypesTime/${USERNAME}/${filters}/${start_date}-${end_date}`;
    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result) as AccountHistory[];
        return parsed?.reverse();
      } else {
        throw new Error(result.error!);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getSimplePost = async (
  username: string,
  permlink: string,
  withVotes?: boolean,
  observer?: string,
): Promise<Post | undefined> => {
  try {
    const R_API = `/posts_api/getPost/${username}/${permlink}/${
      withVotes ?? true
    }/${observer ?? 'null'}`;

    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));
    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Post;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    // throw new Error(error);
    return undefined;
  }
};
export const loadSteemGlobals = async (): Promise<SteemProps> => {
  const R_API = `/steem_requests_api/getSteemProps`;
  console.log(R_API);
  const response = await fetch(AppConstants.SDS_API(R_API));
  if (response.ok) {
    const result = await response.json();

    if (AppFunctions.ValidateSDS(result)) {
      const parsed = AppFunctions.MapSDS(result) as SteemProps;
      return parsed;
    } else {
      throw new Error(result.error!);
    }
  } else {
    throw new Error(`HTTP error: ${response.status}`);
  }
};

interface TrxType {
  time: number;
  from: string;
  to: string;
  amount: number;
  unit: string;
}

export const getClubStatus = async (
  account: string,
  DURATION: number,
): Promise<ClubData | undefined> => {
  const date_from = moment().subtract(DURATION, 'months').unix();
  const date_to = moment().unix();
  const R_API = `/stats_api/getClubStats/${account}/${date_from}-${date_to}`;
  console.log(R_API);
  const response = await fetch(AppConstants.SDS_API(R_API));
  if (response.ok) {
    const result = await response.json();
    if (AppFunctions.ValidateSDS(result)) {
      const parsed = AppFunctions.MapSDS(result);

      const trx_out_cols = parsed['transfers_out']['cols'];
      const trx_in_cols = parsed['transfers_in']['cols'];
      const vest_in_cols = parsed['vesting_in']['cols'];
      const vest_out_cols = parsed['vesting_out']['cols'];

      const trx_in_row = parsed['transfers_in']['rows'] as any[];
      const trx_out_row = parsed['transfers_out']['rows'] as any[];
      const trx_vest_in_row = parsed['vesting_in']['rows'] as any[];
      const trx_vest_out_row = parsed['vesting_out']['rows'] as any[];

      let total_trx_out = 0;
      trx_out_row.length >= 1 &&
        trx_out_row.forEach(item => {
          const amount = item[trx_out_cols['amount']];
          total_trx_out = total_trx_out + amount;
        });

      let total_trx_in = 0;
      trx_in_row.length >= 1 &&
        trx_in_row.forEach(item => {
          const amount = item[trx_in_cols['amount']];
          total_trx_in = total_trx_in + amount;
        });

      let total_trx_vests_in = 0;
      trx_vest_in_row.length >= 1 &&
        trx_vest_in_row.forEach(item => {
          const amount = item[vest_in_cols['amount']];
          total_trx_vests_in = total_trx_vests_in + amount;
        });

      let total_trx_vests_out = 0;
      trx_vest_out_row.length >= 1 &&
        trx_vest_out_row.forEach(item => {
          const amount = item[vest_out_cols['amount']];
          total_trx_vests_out = total_trx_vests_out + amount;
        });

      const transfer_in_steem = total_trx_vests_in - total_trx_vests_out;

      const grand_total =
        transfer_in_steem + total_trx_out + total_trx_vests_out;

      let powered_up = (total_trx_vests_out / grand_total) * 100;
      powered_up = powered_up < 0 ? 0 : powered_up;
      let transfer_in = (transfer_in_steem / grand_total) * 100;
      transfer_in = transfer_in < 0 ? 0 : transfer_in;
      let transfer_out = (total_trx_out / grand_total) * 100;
      transfer_out = transfer_out < 0 ? 0 : transfer_out;

      return {powered_up, transfer_in, transfer_out};
    } else {
      throw new Error(result.error!);
    }
  } else {
    throw new Error(`HTTP error: ${response.status}`);
  }
};

export const getVoteData = (
  account: AccountExt,
  steemprops: SteemProps,
): VoteData => {
  const total_vests = account.vests_own + account.vests_in - account.vests_out;
  const final_vest = total_vests * 1e6;
  const power = account.upvote_mana_percent / 50;
  const rshares = (power * final_vest) / 10000;

  const g =
    (steemprops.total_vesting_shares / steemprops.total_vesting_fund_steem) *
    (steemprops.total_reward_fund / steemprops.recent_reward_claims) *
    steemprops.median_price;

  const full_vote_value =
    (rshares / steemprops.recent_reward_claims) *
    steemprops.total_reward_fund *
    steemprops.median_price *
    100;

  const current_vp = account.upvote_mana_percent;
  const current_vote_value = (full_vote_value * current_vp) / 100;

  return {
    full_vote: full_vote_value,
    current_vote: current_vote_value,
    voting_power: current_vp,
    resource_credit: account.rc_mana_percent,
  };
};

export const getTronInformation = async (
  USERNAME: string,
): Promise<SteemTron> => {
  try {
    const R_API = `https://steemitwallet.com/api/v1/tron/tron_user?username=${USERNAME}`;
    console.log(R_API);

    const response = await fetch(R_API);

    if (response.ok) {
      const result = await response.json();
      const trxInfo = result.result;
      const trxResponse = await fetch(
        `https://api.trongrid.io/v1/accounts/${trxInfo.tron_addr}`,
      );
      const trxResult = await trxResponse.json();
      const trx_balance = (trxResult?.data?.[0]?.balance ?? 0) / 1000000;
      // await tronWeb.trx.getBalance(trxInfo.tron_addr);

      return {...trxInfo, trx_balance: trx_balance ?? 0} as SteemTron;
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    throw new Error(error);
  }
};

export const getNotifications = async (
  username: string,
  settings: FirebaseNotificationSettings,
  offset: number = 0,
): Promise<Notification[]> => {
  try {
    const filter = `{"mention":{"exclude":${!settings.mention
      .status}, "minSP":${settings.mention.minSp},"minReputation":${
      settings.mention.minRep
    }},
   "vote":{"exclude":${!settings.vote.status}, "minVoteAmount":${
      settings.vote.minVote
    },"minReputation":${settings.vote.minRep},"minSP":${settings.vote.minSp}},
   "follow":{"exclude":${!settings.follow.status}, "minSP":${
      settings.follow.minSp
    },"minReputation":${settings.follow.minRep}},
   "resteem":{"exclude":${!settings.resteem.status}, "minSP":${
      settings.resteem.minSp
    },"minReputation":${settings.resteem.minRep}},
  "reply":{"exclude":${!settings.reply.status}, "minSP":${
      settings.reply.minSp
    },"minReputation":${settings.reply.minRep}}}`;

    const R_API = `/notifications_api/getFilteredNotificationsByStatus/${username}/all/${filter}/50/${offset}`;

    console.log(R_API);

    const response = await fetch(AppConstants.SDS_API(R_API));

    if (response.ok) {
      const result = await response.json();
      try {
        await pushFcmToken(username, true);
      } catch {}

      if (AppFunctions.ValidateSDS(result)) {
        const parsed = AppFunctions.MapSDS(result);
        return parsed as Notification[];
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    // throw new Error(error);
    throw new Error(`Error: ${error}`);
  }
};

export const getUnreadNotifications = async (
  username: string,
  settings: FirebaseNotificationSettings,
  offset: number = 0,
): Promise<number> => {
  try {
    const filter = `{"mention":{"exclude":${!settings.mention
      .status}, "minSP":${settings.mention.minSp},"minReputation":${
      settings.mention.minRep
    }},
    "vote":{"exclude":${!settings.vote.status}, "minVoteAmount":${
      settings.vote.minVote
    },"minReputation":${settings.vote.minRep},"minSP":${settings.vote.minSp}},
    "follow":{"exclude":${!settings.follow.status}, "minSP":${
      settings.follow.minSp
    },"minReputation":${settings.follow.minRep}},
    "resteem":{"exclude":${!settings.resteem.status}, "minSP":${
      settings.resteem.minSp
    },"minReputation":${settings.resteem.minRep}},
   "reply":{"exclude":${!settings.reply.status}, "minSP":${
      settings.reply.minSp
    },"minReputation":${settings.reply.minRep}}}`;

    const R_API = `/notifications_api/getFilteredUnreadCount/${username}/${filter}`;

    console.log(R_API);
    const response = await fetch(AppConstants.SDS_API(R_API));

    if (response.ok) {
      const result = await response.json();

      if (AppFunctions.ValidateSDS(result)) {
        return result.result as number;
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    // throw new Error(error);
    throw new Error(`Error: ${error}`);
  }
};
