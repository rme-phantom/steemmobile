import postUrlParser from './postUrlParser';
import { AppRoutes } from '../constants/AppRoutes';
import { empty_comment } from './placeholders';

export const deepLinkParser = async url => {
  if (!url || url.indexOf('ShareMedia://') >= 0) return;

  let routeName;
  let params;
  let profile;
  let keey;

  // profess url for post/content
  const postUrl = postUrlParser(url);
  const { author, permlink, feedType, tag } = postUrl || {};

  if (author) {
    if (
      !permlink ||
      permlink === 'transfers' ||
      permlink === 'points' ||
      permlink === 'comments' ||
      permlink === 'replies' ||
      permlink === 'posts' ||
      permlink === 'author-rewards' ||
      permlink === 'curation-rewards' ||
      permlink === 'notifications'

    ) {
      let deepLinkFilter;

      if (permlink) {
        deepLinkFilter = permlink === 'points' ? 'wallet' : permlink;
        routeName = AppRoutes.PAGES.ProfilePage;
        params = {
          account: author,
        };
      }
      profile = author;
      routeName = AppRoutes.PAGES.ProfilePage;
      params = {
        account: author,
      };
      keey = author;
    } else if (permlink === 'communities') {
      routeName = AppRoutes.PAGES.ExploreCommunitiesPage;
      params = {
        category: author,
      };
      keey = 'Communities';
    } else if (permlink) {
      routeName = AppRoutes.PAGES.CommentDetailPage;
      params = {
        type: 'post',
        comment: empty_comment(author, permlink),
        feed_api: 'getPost',
      };

      keey = `${author}/${permlink}`;
    }
  } else {
    if (permlink === 'witnesses') {
      routeName = AppRoutes.PAGES.ExploreWitnessPage;
      params = {
        category: author,
      };
      keey = 'Witnesses';
    }
  }

  if (feedType === 'hot' || feedType === 'trending' || feedType === 'created') {
    if (!tag) {
      routeName = AppRoutes.PAGES.CategoryPage;
      params = {
        category: tag,
        community: tag,
      };
    } else if (/hive-[1-3]\d{4,6}$/.test(tag)) {
      routeName = AppRoutes.PAGES.CommunityPage;
      params = {
        category: tag,
        community: tag,
      };
    } else {
      routeName = AppRoutes.PAGES.CategoryPage;
      params = {
        category: tag,
        community: tag,
      };
    }
    params = {
      category: tag,
      filter: feedType,
    };
    keey = `${feedType}/${tag || ''}`;
  }

  return {
    name: routeName,
    params,
    key: keey,
  };
};
