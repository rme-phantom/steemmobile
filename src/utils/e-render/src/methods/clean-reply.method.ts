export function cleanReply(s: string): string {
  return (
    s
      ? s
          .split('\n')
          .filter(
            item =>
              item.toLowerCase().includes('posted using [partiko') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('posted using [dapplr') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('posted using [leofinance') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('posted via [neoxian') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('posted with [stemgeeks') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('posted using [bilpcoin') === false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('<center><sub>[posted using aeneas.blog') === false,
          )
          // .filter(
          //   item =>
          //     item
          //       .toLowerCase()
          //       .includes('<center><sub>posted using [steempro mobile') ===
          //     false,
          // )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('<center><sub>posted via [proofofbrain.io') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('<center>posted on [hypnochain') ===
              false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('<center><sub>posted via [weedcash.network') ===
              false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('<center>posted on [naturalmedicine.io') === false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('<center><sub>posted via [musicforlife.io') === false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes(
                  'if the truvvl embed is unsupported by your current frontend, click this link to view this story',
                ) === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('<center><em>posted from truvvl') ===
              false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('view this post <a href="https://travelfeed.io/') ===
              false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes(
                  'read this post on travelfeed.io for the best experience',
                ) === false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('posted via <a href="https://www.dporn.co/"') ===
              false,
          )
          .filter(
            item =>
              item
                .toLowerCase()
                .includes('▶️ [watch on 3speak](https://3speak') === false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('<sup><sub>posted via [inji.com]') ===
              false,
          )
          .filter(
            item =>
              item.toLowerCase().includes('view this post on [liketu]') ===
              false,
          )
          ?.join('\n')
      : ''
  )
    .replace(
      'Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>',
      '',
    )
    .replace(
      '<br /><br /><blockquote><p>Posted using PLAY STEEM <a href="https://playsteem.app">https://playsteem.app</a></p></blockquote>',
      '',
    )
    .replace(
      '<div class="pull-right"><a href="/@hive.engage">![](https://i.imgur.com/XsrNmcl.png)</a></div>',
      '',
    )
    .replace(
      '<br /><br /><blockquote>Posted through the ECble app (<a href="https://ecble.etain.club">https://ecble.etain.club</a>)</blockquote>',
      '',
    );
}
