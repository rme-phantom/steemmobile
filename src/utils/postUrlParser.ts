const parseCatAuthorPermlink = u => {
  const postRegex = /^https?:\/\/(.*)\/(.*)\/(@[\w.\d-]+)\/(.*?)(?:\?|$)/i;
  const postMatch = u.match(postRegex);

  if (postMatch && postMatch.length === 5) {
    return {
      author: postMatch[3].replace('@', ''),
      permlink: postMatch[4],
    };
  }
  const authorRegex = /^https?:\/\/(.*)\/(.*)\/(@[\w.\d-]+)/i;
  const authorMatch = u.match(authorRegex);
  if (authorMatch && authorMatch.length === 4) {
    return {
      author: authorMatch[3].replace('@', ''),
      permlink: null,
    };
  }
  const r = /^https?:\/\/(.*)\/(@[\w.\d-]+)\/(.*?)(?:\?|$)/i;
  const match = u.match(r);

  if (match && match.length === 4) {
    return {
      author: match[2].replace('@', ''),
      permlink: match[3],
    };
  }
  return null;
};

const parseAuthorPermlink = u => {
  const r = /^https?:\/\/(.*)\/(@[\w.\d-]+)\/(.*?)(?:\?|$)/i;
  const match = u.match(r);

  if (match && match.length === 4) {
    return {
      author: match[2].replace('@', ''),
      permlink: match[3],
    };
  }
  const authorRegex = /^https?:\/\/(.*)\/(@[\w.\d-]+)/i;
  const authorMatch = u.match(authorRegex);
  if (authorMatch && authorMatch.length === 3) {
    return {
      author: authorMatch[2].replace('@', ''),
      permlink: null,
    };
  }

  return null;
};

export default url => {
  url = url && url?.toLowerCase();
  if (url.startsWith('steemitwallet://')) {
    url = url
      .replace('steemitwallet://', 'https://steempro.com/')
      .replace('steemitwallet://', 'https://steempro.com/');
  }
  // eslint-disable-next-line no-useless-escape
  const feedMatch = url.match(/^https:\/\/([\w-\.]*)\/([\w-]*)\/?([\w-]*)\/?$/);

  if (feedMatch) {
    if (url.includes('~witnesses') || url.includes('witnesses')) {
      return {
        permlink: url.split('~')[1],
        feedType: feedMatch[2],
        tag: feedMatch[3],
      };
    } else if (feedMatch[3]) {
      return {
        feedType: feedMatch[2],
        tag: feedMatch[3],
      };
    }
    return {
      feedType: feedMatch[2],
    };
  }

  // For non urls like @good-karma/esteem-london-presentation-e3105ba6637ed
  let match = url.match(/^[/]?(@[\w.\d-]+)\/(.*?)(?:\?|$)/);

  if (match && match.length === 3) {
    return {
      author: match[1].replace('@', ''),
      permlink: match[2],
    };
  }

  // For non urls with category like esteem/@good-karma/esteem-london-presentation-e3105ba6637ed
  match = url.match(/([\w.\d-]+)\/(@[\w.\d-]+)\/(.*?)(?:\?|$)/);

  if (match && match.length === 4) {
    if (match[3].indexOf('#') > -1) {
      const commentPart = match[3].split('@')[1];
      const splits = commentPart.split('/');
      return {
        category: match[1],
        author: splits[0],
        permlink: splits[1],
      };
    }
    return {
      category: match[1],
      author: match[2].replace('@', ''),
      permlink: match[3],
    };
  }

  match = url.match(/^https:\/\/steemitwallet\.com\/~witnesses$/);

  if (match) {
    const splits = match[0].split('~');
    return {
      category: 'witness',
      author: '',
      permlink: splits[1],
    };
  }

  const profile = url.match(/^https?:\/\/(.*)\/(@[\w.\d-]+)$/);


  if (profile) {
    if (profile && profile.length === 3) {
      return {
        author: profile[2].replace('@', ''),
        permlink: null,
      };
    }
  }

  if (['https://steemit.com'].some(x => url.startsWith(x))) {
    return parseCatAuthorPermlink(url);
  }

  return null;
};
