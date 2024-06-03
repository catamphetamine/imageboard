# `imageboard`

Provides easy programmatic access to the popular [imageboards](https://tvtropes.org/pmwiki/pmwiki.php/Main/Imageboards).

Supported imageboard engines:

* [makaba](https://2ch.hk/api/) — `2ch.hk`'s proprietary engine.

  1. [2ch.hk](https://2ch.hk/) — [demo](https://anychans.github.io/2ch)

* [4chan](https://github.com/4chan/4chan-API) — `4chan.org`'s proprietary engine.

  1. [4chan.org](https://www.4chan.org/) — [demo](https://anychans.github.io/4chan)

* [vichan](https://github.com/vichan-devel/vichan) — An open-source `4chan`-compatible engine running on PHP/MySQL whose development started in 2012. The codebase has seen various maintainers take over and then leave off over the years, but as of late 2023, it seems like it's still being maintained and receiving new features.

  1. [tvch.moe](https://tvch.moe/) — [demo](https://anychans.github.io/tvchan)
  2. [tahta.ch](https://tahta.ch/) — [demo](https://anychans.github.io/tahtach)
  3. [vecchiochan.com](https://vecchiochan.com/) — [demo](https://anychans.github.io/vecchiochan)
  4. [diochan.com](https://diochan.com/)
  5. [soyjak.party](https://soyjak.party/)
  6. [vichan.pl](https://vichan.pl/)
  7. [wizchan.org](https://wizchan.org/)

* [lainchan](https://github.com/lainchan/lainchan) — a fork of `vichan` that adds a bit of features. Is no longer in development since 2023.

  1. [lainchan.org](https://lainchan.org/) — [demo](https://anychans.github.io/lainchan)
  2. [leftypol.org](https://leftypol.org/)

* [OpenIB](https://github.com/OpenIB/OpenIB/) (formerly [infinity](https://github.com/ctrlcctrlv/infinity)) — A 2013 fork of `vichan` engine with the goal of supporting an "infinite" amount of user-managed boards as opposed to a finite set of predefined boards. No longer maintained since 2018.

  1. [8kun.top](https://8kun.top/) (formerly `8ch.net`) — [demo](https://anychans.github.io/8ch)
  2. [smuglo.li](https://smuglo.li/) — [demo](https://anychans.github.io/smugloli)

* [lynxchan](https://gitgud.io/LynxChan/LynxChan) — An alternative engine Node.js/MongoDB whose development started in 2015. Rather than mimicking any existing engine, it set off on its own path and ended up becoming a popular choice (of its time) provided that there's really not much else to choose from. Some choices made by the author are questionable and the overall approach doesn't look professional to me. For example, the engine has a bunch of quite obvious but easily-fixable [issues](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan-issues.md) that the author refuses to recognize and has no interest in fixing. The author's demeanor, in general, is somewhat controversial and not to everyone's liking.

  1. [kohlchan.net](https://kohlchan.net) — [demo](https://anychans.github.io/kohlchan)
  2. [endchan.net](https://endchan.net) — [demo](https://anychans.github.io/endchan)
  3. [alogs.space](https://alogs.space) — [demo](https://anychans.github.io/alogsspace)
  4. [bandada](https://bandada.club) — [demo](https://anychans.github.io/bandada)

* [jschan](https://gitgud.io/fatchan/jschan/) — An alternative engine written in Node.js/MongoDB whose development started in 2019. Isn't really adopted by anyone, perhaps because there haven't been any new imageboards since its development has started. Compared to `lynxchan`, purely from a technical perspective, it looks much more professional and mature, and the author is a [well-known developer](https://lowendtalk.com/discussion/186679/basedflare-new-cloudflare-like-service).

  1. [junkuchan.org](https://junkuchan.org) — [demo](https://anychans.github.io/junkuchan)
  2. [jakparty.soy](https://jakparty.soy) — [demo](https://anychans.github.io/jakpartysoy)
  3. [heolkek.cafe](https://heolkek.cafe)
  4. [27chan.org](https://27chan.org/)
  5. [niuchan.org](https://niuchan.org/)
  6. [zzzchan.xyz](https://zzzchan.xyz)
  7. [trashchan.xyz](https://trashchan.xyz/)
  8. [94chan.org](https://94chan.org/)
  9. [ptchan.org](https://ptchan.org/)

  <!-- P.S. The [demo](https://anychans.github.io/) website doesn't seem to work with any known `jschan` imageboard because all of them use CloudFlare anti-DDoS protection that doesn't allow through the [CORS proxy](https://gitlab.com/catamphetamine/anychan/-/tree/master/docs/proxy/README.md). -->

  <!-- 2. [94chan.org](https://94chan.org/) — [demo](https://anychans.github.io/94chan). The website is behind a CloudFlare-alike DDoS protection and returns `403 Forbidden` for the "demo" CORS proxy, but it is functional when accessed through one's [own CORS proxy](https://gitlab.com/catamphetamine/anychan/-/blob/master/docs/proxy/README.md) running at `localhost`. -->

  <!-- 3. [ptchan.org](https://ptchan.org/) — [demo](https://anychans.github.io/ptchan). The website is behind a CloudFlare-alike DDoS protection and returns [`403 Forbidden`](https://gitgud.io/fatchan/haproxy-protection/-/issues/24) for a CORS proxy. -->

Originally created as part of the [`anychan`](https://gitlab.com/catamphetamine/anychan) imageboard GUI.

[Details on each imageboard engine API](#imageboards-api)

[Thoughts](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/thoughts.md)

## Features

* (optional) Parses comments HTML markup into [`Content`](https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md) JSON structures.
* (optional) Automatically generates shortened "previews" for long comments.
* (optional) Automatically inserts quotes in replying comments.
* (optional) Automatically builds a tree of replies: each comment has a list of "in-reply-to" comments and a list of "replying" comments.
* (optional) Automatically generates thread title when it's missing.
* (not on all imageboards) Provides the API to:
  * Create threads
  * Post comments
  * Report comments
  * Request and solve a CAPTCHA
  * Log In / Log Out

## Install

```
npm install imageboard --save
```

## Example

<details>
<summary>Here's an example for Node.js, although this library also works in a web browser.</summary>

######

_P.S._ The full source code for this example can be found in [`test/test.js`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/test/test.js) file.

Create a new folder and `cd` into it.

This example will be using `4chan.org` as a data source.

Create a file called `fourChan.js` and paste the following code into it.

```js
import Imageboard from 'imageboard/node'

export default Imageboard('4chan')
```

Next, create an `index.js` file and paste the following code into it. The code prints the first ten of `4chan.org` boards:

```js
import fourChan from './fourChan.js'

// Prints the first 10 boards.
fourChan.getBoards().then(({ boards }) => {
  const boardsList = boards.slice(0, 10).map(({
    id,
    title,
    category,
    description
  }) => {
    return `* [${category}] /${id}/ — ${title} — ${description}`
  })
  console.log(boardsList.join('\n'))
})
```

The output:

```
* [Creative] /3/ — 3DCG — "/3/ - 3DCG" is 4chan's board for 3D modeling and imagery.
* [Japanese Culture] /a/ — Anime & Manga — "/a/ - Anime & Manga" is 4chan's imageboard dedicated to the discussion of Japanese animation and manga.
* [Other] /adv/ — Advice — "/adv/ - Advice" is 4chan's board for giving and receiving advice.
... the other boards ...
```

Now, add the code that prints the first five threads on `4chan.org` `/a/` board:

```js
import { getCommentText } from 'imageboard'

// Prints the first five threads on `/a/` board.
fourChan.getThreads({
  boardId: 'a'
}).then(({ threads, board }) => {
  const threadsList = threads.slice(0, 5).map(({
    id,
    title,
    createdAt,
    commentsCount,
    attachmentsCount,
    comments
  }) => {
    return [
      `#${id}`,
      createdAt,
      title,
      getCommentText(comments[0]) || '(empty)',
      `${commentsCount} comments, ${attachmentsCount} attachments`
    ].join('\n\n')
  })
  console.log(threadsList.join('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~\n\n'))
})
```

The output:

```
#193605320

Wed Sep 25 2019 20:48:54 GMT+0300 (Moscow Standard Time)

Facebook announces Horizon, a VR massive-multiplayer world

DATABASE DATABASE JUST LIVING IN THE DATABE WO-OH

12 comments, 5 attachments

~~~~~~~~~~~~~~~~~~~~~~~~~

... the other threads ...
```

Now, add the code that prints the first five comments of a certain thread:

```js
import { getCommentText } from 'imageboard'

// Prints the first five comments of thread #193605320 on `/a/` board.
fourChan.getThread({
  boardId: 'a',
  threadId: 193605320
}).then(({ thread, board }) => {
  const commentsList = thread.comments.slice(0, 5).map((comment) => {
    const {
      id,
      title,
      createdAt,
      replies,
      attachments
    } = comment
    const parts = []
    parts.push(`#${id}`)
    parts.push(createdAt)
    if (title) {
      parts.push(title)
    }
    parts.push(getCommentText(comment) || '(empty)')
    if (attachments) {
      parts.push(`${attachments.length} attachments`)
    }
    if (title && replies) {
      parts.push(`${replies.length} replies`)
    }
    return parts.join('\n\n')
  })
  console.log(commentsList.join('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~\n\n'))
})
```

The output:

```
#193605320

Wed Sep 25 2019 20:48:54 GMT+0300 (Moscow Standard Time)

Facebook announces Horizon, a VR massive-multiplayer world

DATABASE DATABASE JUST LIVING IN THE DATABE WO-OH

1 attachments

3 replies

~~~~~~~~~~~~~~~~~~~~~~~~~

#193605743

Wed Sep 25 2019 21:02:00 GMT+0300 (Moscow Standard Time)

«DATABASE DATABASE JUST LIVING IN THE DATABE WO-OH»
Fuck you OP I saw horizon and now I am mad that it’s bait

~~~~~~~~~~~~~~~~~~~~~~~~~~

... the other comments ...
```
</details>

## API

### `Imageboard(idOrConfig, options)`

The default exported function. Creates a new `imageboard` instance.

There're three different exports:
* `imageboard` — The default (envirnoment-agnostic) one. Requires specifying a custom [`sendHttpRequest`](#http-request-function) parameter.
* `imageboard/browser` — The one that can be used in a web browser. Has a web-browser-specific `sendHttpRequest` function "built in".
* `imageboard/node` — The one that can be used in Node.js. Has a Node.js-specific `sendHttpRequest` function "built in".

```js
import Imageboard from 'imageboard/node'

const fourChan = Imageboard('4chan', options)
```

If the imageboard is supported by this library out-of-the-box, such imageboard's `id` can be passed as the first argument:

* `"2ch"`
* `"27chan"`
* `"4chan"`
* `"8ch"` (8kun.top)
* `"94chan"`
* `"alogs.space"`
* `"arisuchan"`
* `"bandada"`
* `"diochan"`
* `"endchan"`
* `"heolcafe"`
* `"jakparty.soy"`
* `"junkuchan"`
* `"kohlchan"`
* `"lainchan"`
* `"leftypol"`
* `"niuchan"`
* `"ptchan"`
* `"smugloli"`
* `"tahtach"`
* `"tvchan"`
* `"vecchiochan"`
* `"wizardchan"`
* `"zzzchan"`

Otherwise, i.e. when the imageboard is not supported by the library out-of-the-box, the first argument should be an imageboard [`config`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/add-new-imageboard.md#imageboard-config) object.

<details>
<summary>Sidenote: Making HTTP requests in a web browser will most likely require a CORS proxy.</summary>

######

None of the imageboards (`4chan.org`, `8kun.top`, `2ch.hk`, etc) allow calling their API from other websites in a web browser: they're all configured to block [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for a third party website to be able to query their API.

To bypass CORS limitations, the `request()` function would have to call `fetch()` not with the original imageboard URL like `https://imageboard.net/boards.json` directly but rather with a "proxied" URL like `https://my-cors-proxy-address.net/?url=${encodeURIComponent('https://imageboard.net/boards.json')}`.

[How to set up a CORS proxy](https://gitlab.com/catamphetamine/anychan/#proxy).
</details>

Available `options`:

* `commentUrl?: string` — A template to use when formatting the `url` property of `type: "post-link"`s (links to other comments) in parsed comments' `content`. Is `"/{boardId}/{threadId}#{commentId}"` by default.

* `threadUrl?: string` — A template to use when formatting the `url` property of `type: "post-link"`s (links to threads) in parsed comments' `content`. Is `"/{boardId}/{threadId}"` by default.

* `messages?: Messages` — "Messages" ("strings", "labels") used when parsing comments `content`. See [Messages](#messages).

* `commentLengthLimit?: number` — A `number` telling the maximum comment length (in "points" which can be thought of as "characters and character equivalents for non-text content") upon exceeding which a preview is generated for a comment (as `comment.contentPreview`).

* `useRelativeUrls?: boolean` — Determines whether to use relative or absolute URLs for attachments. Relative URLs are for the cases when an imageboard is temporarily hosted on an alternative domain and so all attachments are too meaning that the default imageboard domain name shouldn't be present in attachment URLs. Is `false` by default.

<details>
<summary>See a list of "advanced" <code>options</code></summary>

#####

* `parseContent?: boolean` — Is `true` by default. Can be set to `false` to skip parsing comment HTML into [`Content`](#content). The rationale is that when there're 500-some comments in a thread parsing all of them up-front can take up to a second on a modern desktop CPU which results in subpar user experience. By deferring parsing comments' HTML an application could first only parse the first N comments' HTML and only as the user starts scrolling would it proceed to parsing the next comments. Or maybe a developer wants to use their own HTML parser or even render comments' HTML as is. If `parseContent` is set to `false` then each non-empty comment will have their `content` being the original unmodified HTML string. In such cases `thread.title` won't be autogenerated when it's missing.

* `addParseContent?: boolean` — Pass `true` to add a `.parseContent()` method and a `.createContentPreview()` method to each comment. This could be used in scenarios when `parseContent: false` option is passed, for example, to only parse comments as they become visible on screen as the user scrolls rather than parsing all the comments in a thread up-front. When passing `addParseContent: true` option, also pass `expandReplies: true` option, otherwise `.parseContent()` won't go up the chain of quoted comments.

  * The `.parseContent()` function receives an optional object containing the parameters for the function:

    * `getCommentById(id): comment?` — Returns a `comment` by an `id`. This parameter should only be passed if some of the `comment` objects of a `thread` might have been replaced by the application (for whatever reason) since the time of receiving the original `thread` object.

      * Why might an application choose to replace some of the `thread`'s `comment`s? An example would be refreshing the `thread` by first fetching a new `thread2` object and then updating the list of the comments in the original `thread` with the new comments from the newly fetched `thread2`. But in that case, some of the older comments' replies count (`.replies.length`) might've changed, so those older comments' `.replies` lists should be updated, and then those older comments should be re-rendered in order to reflect the updated replies count. And re-rendering a comment when using React framework would mean simply replacing those `comment` objects with copies of themselves, which is called updating their "object reference".

  * When `addParseContent: true` option is passed, each comment will also have a `.hasContentBeenParsed()` function that can be used to find out whether the comment's content has been parsed.

  * When `addParseContent: true` option is passed, each comment will also have an `.onContentChange()` function that should be called whenever the `comment`'s perceived `.content` changes for any reason. An example would be marking a `comment` as "hidden": in that case, the application might decide to update of that comment's replies by replacing their quotes of this comment with ">Hidden comment" placeholder text.

    * The `.onContentChange()` function receives an optional object containing the parameters for the function:

      * `getCommentById(id): comment?` — Returns a `comment` by an `id`. This parameter should only be passed if some of the `comment` objects of a `thread` might have been replaced by the application (for whatever reason) since the time of receiving the original `thread` object. See the notes on `.parseContent()`'s `getCommentById` parameter for an example on why might an application choose to replace some of the `comment` objects in some scenarios.

* `expandReplies?: boolean` — Every `comment` has optional properties: `comment.replyIds[]` and `comment.inReplyToIds[]`. If `expandReplies: true` parameter is passed, it will add additional optional properties on every `comment`: `comment.replies[]` and `comment.inReplyTo[]` that're arrays of `Comment`s rather than arrays of just `Comment.id`s. By default, `expandReplies: false` is used to prevent JSON circular structure: this way a whole thread could be serialized into a `*.json` file.

* `getPostLinkProperties?: (comment?: Comment) => object` — Returns an object all properties of which will be added to the `post-link` object. The `comment` argument will be `undefined` if the comment was removed.

* `getPostLinkText?: (postLink: object) => string?` — A function that can be used to define the text `content` of `post-link`s. It should return either a text for a `post-link`, or `undefined`, in which case it's simply ignored. An example of how it might be used:

```js
// The application might choose to display `post-link`s to all
// "hidden" comments as links with "Hidden comment" text inside.
getPostLinkText(postLink) {
  // If the `post` has not been removed.
  // If the application has marked the post as "hidden".
  if (postLink.postIsHidden) {
    return "Hidden comment"
  }
}

// Returns additional `post-link` properties.
// These properties don't get refreshed in `comment.onContentChange()`.
getPostLinkProperties(comment) {
  return {
    // Whether the application has marked the `comment` object as "hidden".
    postIsHidden: comment.hidden
  }
}
```

* `getSetCookieHeaders?: ({ headers }) => string[]` — Returns a list of `Set-Cookie` header values for an HTTP response. The default implementation just returns `headers.getSetCookie()`, but a developer could supply their own implementation, for example, to work around web browsers' limitations as they [don't expose](https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie) `set-cookie` response header.

* When parsing comments, it automatically generates quotes when a comment references another comment in the same thread. The options for generating such quotes are:
  * `generatedQuoteMaxLength?: number` — The maximum length of an auto-generated quote. This is an approximate value.
  * `generatedQuoteMinFitFactor: number?` — Sets the minimum preferrable length of an auto-generated quote at `generatedQuoteMinFitFactor * generatedQuoteMaxLength`.
  * `generatedQuoteMaxFitFactor: number?` — Sets the maximum preferrable length of an auto-generated quote at `generatedQuoteMaxFitFactor * generatedQuoteMaxLength`.
  * `generatedQuoteGetCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number` — Returns the character count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by max length. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted.
  * `minimizeGeneratedPostLinkBlockQuotes?: boolean` — One can pass `true` to indicate that auto-generated quotes are minimized by default until the user expands them manually. This would mean that auto-generated quotes shouldn't be accounted for when calculating the total length of a comment when creating a shorter "preview" for it in case it exceeds the maxum preferred length.
</details>

## `imageboard` methods

### `supportsFeature(feature: string)`

Tells whether the imageboard supports a certain feature.

`feature` argument could be one of:
* `"getTopBoards"`
* `"findBoards"`
* `"getThreads.sortByRatingDesc"`

Returns:

* `true` if the feature is supported by the imageboard.
* `false` otherwise.

### `getBoards()`

Fetches a list of boards on an imageboard.

Returns an object with properties:

* `boards` — a list of [Boards](#board)

For some imageboards, the list could be huge. For example, `8ch.net (8kun.top)` has about `20,000` boards, and to get just the "top 20 boards" one could use `getTopBoards()` function instead.

### `getTopBoards()`

Fetches a list of "top" boards on an imageboard.

Returns an object with properties:

* `boards` — a list of [Boards](#board)

For example, `8ch.net (8kun.top)` has about `20,000` boards, so `getTopBoards()` returns just the "top 20 boards" while `getBoards()` returns all `20,000` boards.

This function is only supported if `supportsFeature('getTopBoards')` returns `true`.

For example, `8ch.net (8kun.top)` has about `20,000` boards, so `supportsFeature('getTopBoards')` returns `true` for that specific imageboard and `getTopBoards()` returns just the "top 20 boards".

### `findBoards()`

Searches for a (non-full) list of boards matching a search `query`. For example, if an imageboard supports creating "user boards", and there're a lot of them, then `getBoards()` should return just the most popular ones, and to discover all other boards, searching by a query should be used.

Parameters object:

* `search: string` — Search query.

Returns an object with properties:

* `boards` — a list of [Boards](#board)

This function isn't currently implemented in any of the supported imageboard engines. To see if a given imageboard supports this function, use `supportsFeature('findBoards')` function.

### `getThreads()`

Fetches a list of threads on a board.

Parameters object:

* `boardId: string` — Board ID.

* `withLatestComments?: boolean` — Pass `true` to get latest comments for each thread. Latest comments are added as `thread.latestComments[]`, but not necessarily for all threads in the list, because the result might differ depending on the imageboard engine. For example, `4chan` provides latest comments for all threads in the list as part of its "get threads list" API response, while other imageboard engines don't — which is lame — and so the latest comments have to somehow be fetched separately by, for example, going through the "pages" of threads on a board. When doing so, some `threads` might not get their `latestComments[]` at all, resulting in `thread.latestComments[]` being `undefined`. That might happen for different reasons. One reason is that the list of threads on a board changes between the individual "read page" requests, so some threads might get lost in this space-time gap. Another reason is that it wouldn't be practical to go through all of the "pages" because that'd put unnecessary load on the server, and that's when `maxLatestCommentsPages` parameter comes into effect.

* `maxLatestCommentsPages?: number` — The maximum number of threads list "pages" to fetch in order to get the latest comments for each thread. When the engine doesn't provide the latest comments for each thread as part of its generic "get threads list" API response, the latest comments are fetched by going through every "page" of threads on a board. Therefore, to get the latest comments for all threads on a board, the code has to fetch all "pages", of which there may be many (for example, 10). At the same time, usually imageboards warn the user of the "max one API request per second" rate limit (which, of course, isn't actually imposed). So the code decides to play it safe and defaults to fetching just the first "page" of threads to get just those threads' latest comments, and doesn't set the latest comments for the rest of the threads. A developer may specify a larger count of "pages" to be fetched. It would be safe to specify "over the top" (larger than actual) pages count because the code will just discard all "Not found" errors. All pages are fetched simultaneously for better UX due to shorter loading time, so consider web browser limits for the maximum number of concurrent HTTP requests when setting this parameter to a high number.

* `latestCommentLengthLimit?: number` — Same as `commentLengthLimit` but for `thread.latestComments`.

* `sortBy?: string` — Could be used to sort the list of threads by something. For example, `makaba` engine supports `sortBy: "rating-desc"`.

* Any other properties here will override the corresponding properties of the `options` object that was passed to the `Imageboard()` function when creating an imageboard instance.

Returns an object with properties:

* `threads` — a list of [Threads](#thread)
* `boards` — (optional) [Board](#board)

### `getThread()`

Fetches a thread.

Parameters object:

* `boardId: string` — Board ID.

* `threadId: number` — Thread ID.

* `archived?: boolean` — (optional) Pass `true` when requesting an archived thread. This flag is not required in any way, but, for `makaba` engine, it reduces the number of HTTP Requests from 2 to 1 because in that case it doesn't have to attempt to read the thread by a non-"archived" URL (which returns `404 Not Found`) before attempting to read it by an "archived" URL.

* `afterCommentId?: number` — (optional) (experimental) Could be used to only fetch comments after a certain comment.

* `afterCommentNumber?: number` — (optional) (experimental) Could be used to only fetch comments after a certain comments count (counting from the first comment in the thread).

* Any other properties here will override the corresponding properties of the `options` object that was passed to the `Imageboard()` function when creating an imageboard instance.

Returns an object with properties:

* `thread` — [Thread](#thread)
* `board` — (optional) [Board](#board)

<!--
### `parseCommentContent(comment: Comment, { boardId: string, threadId: number })`

Parses `comment` content if `parseContent: false` option was used when creating an `imageboard` instance.
-->

### `voteForComment()`

Some imageboards (like [`2ch.hk`](https://2ch.hk)) allow upvoting or downvoting threads and comments on certain boards (like [`/po/`litics on `2ch.hk`](https://2ch.hk/po)).

Parameters object:

* `boardId: string` — Board ID.
* `threadId: number` — Thread ID.
* `commentId: number` — Comment ID.
* `up: boolean` — Upvote or downvote.

Returns:

* `true` — The vote has been accepted.
* `false` — The vote has not been accepted. For example, if the user has already voted.

### `createThread()`

Creates a new thread on a board.

Parameters object:

* `boardId: string` — Board ID.
* `accessToken?: string` — If the user is authenticated, put an `accessToken` here to bypass CAPTCHA.
* `authorEmail?: string` — Comment author email.
* `authorName?: string` — Comment author name.
* `attachments?: File[]` — Attachments.
* `title?: string` — Comment title (subject).
* `content?: string` — Comment content (text).
* `makaba`-specific properties:
  * `authorIsThreadAuthor?: boolean` — "Comment author is the thread author" flag.
  * `authorBadgeId?: number` — Comment author icon ID.
  * `tags?: string[]` — Thread tags.
  * `captchaType?: string` — CAPTCHA type. Possible values: `"2chcaptcha"`.
  * `captchaId?: string` — CAPTCHA ID.
  * `captchaSolution?: string` — CAPTCHA solution.

Returns an object:

* `id: number` — Thread ID

### `createComment()`

Creates a new comment in a thread.

Parameters object:

* `boardId: string` — Board ID.
* `threadId: number` — Thread ID.
* `accessToken?: string` — If the user is authenticated, put an `accessToken` here to bypass CAPTCHA.
* `authorEmail?: string` — Comment author email.
* `authorName?: string` — Comment author name.
* `attachments?: File[]` — Attachments.
* `title?: string` — Comment title (subject).
* `content?: string` — Comment content (text).
* `makaba`-specific properties:
  * `authorIsThreadAuthor?: boolean` — "Comment author is the thread author" flag.
  * `authorBadgeId?: number` — Comment author icon ID.
  * `captchaType?: string` — CAPTCHA type. Possible values: `"2chcaptcha"`.
  * `captchaId?: string` — CAPTCHA ID.
  * `captchaSolution?: string` — CAPTCHA solution.

Returns an object:

* `id: number` — Comment ID

### `getCaptcha()`

Requests a CAPTCHA,

Parameters object:

* `boardId?: string` — Board ID.
* `threadId?: number` — Thread ID, if posting a comment in a thread.

Returns an object:

* `captcha: object`:
  * `id: string` — CAPTCHA `id`, can be used to get CAPTCHA image URL.
  * `type: string` — CAPTCHA type. Possible values: `"text"`.
  * `challengeType: string` — CAPTCHA type. Possible values: `"image"`, `"image-slider"`.
  * `characterSet?: string` — A name of a character set for a `"text"` CAPTCHA solution. For example, `"numeric"` or `"russian"`.
  * `expiresAt: Date` — CAPTCHA expiration date.
  * `image: object` — CAPTCHA image:
    * `type: string` — image mime-type.
    * `url: string` — image URL. May be relative or absolute.
    * `width: number` — image width.
    * `height: number` — image height.
  * `backgroundImage?: object` — `"image-slider"` CAPTCHA background image:
    * `type: string` — image mime-type.
    * `url: string` — image URL. May be relative or absolute.
    * `width: number` — image width.
    * `height: number` — image height.
* `canRequestNewCaptchaAt?: Date` — When the user is allowed to request a new CAPTCHA.

### `createBlockBypass()`

Engines such as `jschan` or `lynxchan` introduce a concept of a "block bypass". A "block bypass" is a token that allows its owner to "bypass" a "block" that the server may have imposed on them. Such a "block" could block the user from posting comments or threads or submitting reports.

In order to prevent spam, users are untrusted by default, and are required to solve a CAPTCHA.

Offtopic: Although in the modern age of AI development automatically solving CAPTCHAs has become an easy task, so I'd personally advise utilizing other means of spam prevention. For example, `kohlchan.net` requires a user to provide a "Proof-of-Work" in a form of a result of a lengthy computation. And popular imageboards like `4chan.org` or `2ch.hk` provide their users an option to bypass CAPTCHA by purchasing a "pass" which could be considered a "Proof-of-Stake".

This `createBlockBypass()` method issues a new "block bypass" token.

Parameters object:

* `captchaId: string` — Captcha ID.
* `captchaSolution: string` — Captcha solution.

Returns an object:

* `token: string` — "Block bypass" token.
* `expiresAt: date` — The date when the "block bypass" token expires.

### `logIn()`

Performs a login.

Parameters object:

* `token: string` — Login token. For example, `4chan` calls them "passes".
* `tokenPassword?: string` — Login token password. For example, `4chan` uses them (it calls it a "PIN").

Returns an object:

* `accessToken?: string` — Access token.

### `logOut()`

Performs a logout.

No parameters.

Returns `undefined`.

### `reportComment()`

Reports a comment or a thread.

Parameters object:

* `boardId: string` — Board ID.
* `threadId: number` — Thread ID.
* `commentId: number` — Comment ID.
* `accessToken?: string` — If the user is authenticated, put an `accessToken` here to bypass CAPTCHA.
* `content?: string` — Report content. Is used in `makaba` engine.
* `reasonId?: number | string` — Report reason ID. Is used in `4chan` engine.
* `legalViolationReasonId?: number` — Report reason ID (`31`) in case of a violation of United States law. No `reasonId` should be passed. Is only used in `4chan` engine.
* `captchaId?: string` — CAPTCHA ID. Is used in `4chan` engine.
* `captchaSolution?: string` — CAPTCHA solution. Is used in `4chan` engine.

Returns `undefined`.

## Miscellaneous API

The following functions are exported for "advanced" use cases. In other words, they're being used in [`anychan`](https://gitlab.com/catamphetamine/anychan) and that's the reason why they're exported.

### `getConfig(id: string): object?`

Returns an imageboard config by its `id`. Example: `getConfig("4chan")`.

Can be used in cases when an application for whatever reasons needs to know the imageboard info defined in the `*.json` file, such as `domain`, `engine`, etc.

### `getCommentText(comment: Comment, options: object?): string?`

Generates a textual representation of [Comment](#comment)'s `content`. This is just a [`getPostText()`](https://gitlab.com/catamphetamine/social-components#getposttext-post-post-options-object-string) function re-exported from [`social-components`](https://gitlab.com/catamphetamine/social-components) for convenience.

Is used in the examples in this document.

Available `options` (optional argument):

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating text from `content`. See [Messages](#messages).
* `skipPostQuoteBlocks: boolean?` — (optional) Set to `true` to skip all "block" (not "inline") "comment quotes" (quotes citing a particular comment).
* `skipGeneratedPostQuoteBlocks: boolean?` — (optional) Set to `true` to skip all "block" (not "inline") autogenerated "comment quotes" (autogenerated quotes citing a particular comment).

### sortThreadsWithPinnedOnTop(threads: Thread[]): Thread[]

Sorts a list of threads so that `pinned` ones are on top according to their `pinnedOrder`.

<!--
### `generateQuotes(content: Content, options: object)`

Autogenerates quotes for other comment links in this comment's `content`.

Can be used, for example, in cases when a parent comment contains a "raw" hyperlink to a YouTube video, and after that video has been loaded the app inserts an embedded video player in place of the link, and since there's now a proper video title instead of a "raw" hyperlink the app also re-generates the autogenerated quotes for all replies to this comment.

The `options`:

* `comment: Comment` — (required) Is used to access `comment.attachments` for generating comment preview if it's too long.
* `getCommentById(number): object[]` — (required) Returns a `comment` by its `id`.
* `threadId: number` — (required) Comment thread id. Historically comments on imageboards can reference comments from other threads. For example: `"Previous thread: >>12345"`. For such other-thread comments the quotes can't be generated because there's no content data for them. Therefore, `threadId` is used to filter only links to current thread comments.
* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `generatedQuoteMaxLength: number?` — (optional) Autogenerated quote "max length". Is `180` by default.
* `generatedQuoteMinFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual lower limit of content trimming length at `minFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteMaxFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual upper limit of content trimming length at `maxFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteGetCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number` — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted. Returns something like `15` by default.

### `setPostLinkQuotes(content: Content, getPostById: function, options: object)`

This is what `generateQuotes()` calls internally, apart from doing some other thigs

The `options`:

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `generateQuotes: boolean?` — (optional) Is `true` by default, meaning that it will autogenerate quotes for all `post-link`s. If `false` is passed, then it won't autogenerate quotes for `post-link`s, and will either set `post-link`s' `content` to whatever human-written quotes immediately follow those `post-link`s, or mark them with `_block: true` if they're "block" ones (and not "inline" ones). How could this be used? See the comments on `generateQuotes: false` in `parseContent.js`.
* `generateBlockQuotes: boolean?` — (optional) Is `true` by default. `generateBlockQuotes: false` can be used to achieve the same effect as `generateQuotes: false` but only for "block" quotes (and not for "inline" quotes). See the comments on `generateBlockQuotes: false` in `parseContent.js`.
* `generatedQuoteMaxLength: number?` — (optional) Autogenerated quote "max length". Is `180` by default.
* `generatedQuoteMinFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual lower limit of content trimming length at `minFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteMaxFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual upper limit of content trimming length at `maxFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteGetCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number` — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted. Returns something like `15` by default.
*
-->

<!--
### `generatePreview(comment: Comment, { maxLength: number, minimizeGeneratedPostLinkBlockQuotes: boolean })`

Generates `contentPreview` for the `comment` if its too long.

Can be used, for example, in cases when a parent comment contains a "raw" hyperlink to a YouTube video, and after that video has been loaded the app inserts an embedded video player in place of the link, and since there's now a proper video title instead of a "raw" hyperlink the app also re-generates the preview for this comment (if a preview is required).
-->

<!--
### `generateThreadTitle(thread: Thread, options: object?)`

Autogenerates `thread.title` from the "opening" comment's `title` or `content` if `thread.title` is missing.

Can be used, for example, in cases when a thread has no title (and so thread title is autogenerated) and the "opening" comment contains a "raw" hyperlink to a YouTube video, and after that video has been loaded the app inserts an embedded video player in place of the link, and since there's now a proper video title instead of a "raw" hyperlink the app also re-generates the autogenerated thread title.

Available `options` (optional argument):

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `maxLength: number` — (optional) See `maxLength` argument of `trimText()` in `social-components`.
* `minFitFactor: number` — (optional) See `minFitFactor` option of `trimText()` in `social-components`.
* `maxFitFactor: number` — (optional) See `maxFitFactor` option of `trimText()` in `social-components`.
* `parseContent: boolean?` — (optional) If `parseContent: false` is used to skip parsing comments' `content` when using `imageboard` methods then `parseContent: false` option should also be passed here so indicate that the "opening" comment `content` (raw unparsed HTML markup) should be ignored.
-->

### `createHttpRequestFunction()`

Creates a custom `sendHttpRequest()` function that could be passed when creating an `Imageboard()` using the default export from the `imageboard` package.

See [HTTP request function](#http-request-section) of this document for more details.

### `supportsFeature()`

Tells if the feature is supported by the imageboard. See the docs for the instance method `supportsFeature(feature)` of `Imageboard`.

Arguments:

* `imageboardIdOrConfig` — Imageboard ID string or configuration object.
* `feature` — Feature name.

Returns:

* `true` if the feature is supported by the imageboard
* `false` otherwise

## Models

### Board

See [`Board.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/models/Board.md) or [`./types/index.d.ts`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/types/index.d.ts).

### Thread

See [`Thread.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/models/Thread.md) or [`./types/index.d.ts`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/types/index.d.ts).

### Comment

See [`Comment.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/models/Comment.md) or [`./types/index.d.ts`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/types/index.d.ts).

### Content

Each comment could have a `content` property, which is optional. The `content` could be simple text or it could be "rich"-formatted text in which case it uses some kind of a "markup" language like Markdown or HTML.

In order to convert that "markup" language into a [`Content`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Post/PostContent.md) structure, the comment's `content` has to be "parsed". This package does that by default. To turn off the automatic parsing feature, pass `parseContent: false` parameter.

When parsing a comment's `content`, if `commentLengthLimit` parameter was passed, it will automatically create a `contentPreview` if `content` surpasses the `commentLengthLimit`. One could also use a `comment.createContentPreview({ maxLength })` method to create a preview of a `content` with a custom `maxLength` limit.

### Attachment

An attachment can be a:

* [`Picture`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Post/PostAttachments.md#picture) attachment

<!--
Additional fields:

```js
{
  // (only for `2ch.hk`)
  // `true` in case of a `2ch.hk` sticker.
  sticker: boolean?
}
```
-->

* [`Video`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Post/PostAttachments.md#video) attachment

* [`File`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Post/PostAttachments.md#file) attachment

## Embedded Link Attachments

This library doesn't parse links to YouTube/Twitter/etc inside comments. Instead, this type of functionality is offloaded to a separate library. For example, [`anychan`](https://gitlab.com/catamphetamine/anychan) uses `loadResourceLinks()` and `expandStandaloneAttachmentLinks()` from [`social-components`](https://gitlab.com/catamphetamine/social-components) library when rendering comments to load YouTube/Twitter/etc links and embed the attachments directly in comments.

## Messages

Sometimes an optional `messages` object can be passed to define "messages" ("strings", "labels") used when parsing comments `content`.

Messages used for setting the content of comment links:

```js
{
  ...,
  comment: {
    default: "Comment",
    deleted: "Deleted comment",
    external: "Comment from another thread"
  },
  thread: {
    default: "Thread"
  }
}
```

Messages used when generating `content` text (autogenerated quotes, autogenerated thread title):

```js
{
  ...,
  textContent: {
    ... // See the "Messages" section in the readme of `social-components` package.
  }
}
```

## Adding a new imageboard

Follow the instructions in [`docs/add-new-imageboard.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/add-new-imageboard.md).

## Adding a new engine

Follow the instructions in [`docs/add-new-engine.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/add-new-engine.md).

## HTTP request function

When importing `Imageboard` function from `imageboard` package directly rather than from a sub-package like `imageboard/browser` or `imageboard/node`, one would have to supply a `sendHttpRequest()` parameter:

`sendHttpRequest()` — (required) Sends HTTP requests to an imageboard's API.
  * `parameters` argument:
    * `method: string` — HTTP request method, in upper case.
    * `url: string` — HTTP request URL.
    * `body?: object` — `POST` request body JSON object.
    * `headers?: object` — HTTP request headers, with header names in lower case.
    * `cookies?: object` — HTTP request cookies.
  * Returns a `Promise`:
    * When successful, the `Promise` should resolve to an object:
      * `url: string` — HTTP request URL. If there were any redirects in the process, this should be the final URL that it got redrected to.
      * `status: number` — HTTP response status.
      * `responseText?: string` — HTTP response text. Can be omitted if there's no response content.
      * `headers: object` — HTTP response headers. For example, the `headers` property of a `fetch()` `response`. Must be an object having functions:
        * `.get(headerName: string)` — Returns the value of an HTTP response header.
        * `.getSetCookie()` — Returns a list of `set-cookie` header values in HTTP response.
    * Otherwise, in case of an error, the `Promise` should reject with an `Error` instance having optional properties:
      * `url: string` — HTTP request URL. If there were any redirects in the process, this should be the final URL that it got redrected to.
      * `status: number` — HTTP response status.
      * `responseText?: string` — HTTP response text. Can be omitted if there's no response content.
      * `headers: object` — HTTP response headers. For example, the `headers` property of a `fetch()` `response`. Must be an object having functions:
        * `.get(headerName: string)` — Returns the value of an HTTP response header.
        * `.getSetCookie()` — Returns a list of `set-cookie` header values in HTTP response.

```js
await sendHttpRequest({
  method: "GET",
  url: "https://8kun.top/boards.json"
}) === {
  url: "https://8kun.top/boards.json",
  status: 200,
  headers: {},
  responseText: "[
    { "uri": "b", "title": "Random" },
    ...
  ]"
}
```

<details>
<summary>Sidenote: Rationale for returning <code>responseText</code> rather than just <code>response</code>.</summary>

######

Because the response could be in different forms:

* `application/json`
* `text/html`
* `text/plain`, when something weird happens like the server being down.

So it's not always JSON, and having a `response` parameter be sometimes of this type and sometimes of that type wouldn't be considered a professional approach.
</details>

<details>
<summary>Sidenote: Rationale for returning <code>status</code>, <code>url</code> and <code>headers</code>.</summary>

######

* `status` and `url` are used when reading archived threads on `2ch.hk` imageboard. When requesting an archived thread on `2ch.hk`, it always redirects with a `302` status to a URL that looks like `/boardId/arch/yyyy-mm-dd/res/threadId.json`. As one can see, there's the `archivedAt` date in that final "redirect-to" URL, and it's nowhere else to be read. So this library has to have the access to the final URL after any redirects.

* `headers` are used when parsing an imageboard API's response to a "log in" request: this library attempts to read the authentication cookie value from that response in order to return it to the application code.
</details>

An appropriate `sendHttpRequest()` function could be created using the exported `createHttpRequestFunction()` function:

```js
import { createHttpRequestFunction } from 'imageboard'

const sendHttpRequest = createHttpRequestFunction({
  fetch,
  FormData
})
```

Required parameters of `createHttpRequestFunction()`:

* `fetch` — [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) function.
* `FormData` — [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) class.

Optional parameters of `createHttpRequestFunction()`:

* `setHeaders({ headers })` — Sets any custom HTTP request headers.
* `attachCookiesInWebBrowser({ cookies, headers })` — Attaches any custom cookies to HTTP request when running in a web browser environment.
* `getRequestUrl({ url })` — Transforms HTTP request URL in any arbitrary way.
* `getResponseStatus({ status, headers })` — Returns any custom HTTP response status.
* `getFinalUrlFromResponse({ url, headers })` — Returns any custom "final" URL for HTTP response.
* `mode` — Overrides the `mode` parameter of the `fetch()` function.
* `credentials` — Overrides the `credentials` parameter of the `fetch()` function.
* `redirect` — Overrides the `redirect` parameter of the `fetch()` function. The default is `"manual"`.

## Imageboards API

### 4chan

* [`4chan.org` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.md)
* [`4chan.org` API (brief official docs)](https://github.com/4chan/4chan-API)
* The ["leaked" source code](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.php) from 2014 (may be outdated in some parts).

### vichan

[`vichan`](https://github.com/vichan-devel/vichan) engine was originally a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine having more features. In November 2017, `vichan` engine was put in "no longer being maintained" state, although later, around 2022, a group of volunteers seems to have picked up the development from the former maintainer.

* [`vichan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/vichan.md).
* [`lainchan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lainchan.md).

Chans running on `vichan`:

* [`lainchan.org`](https://github.com/lainchan/lainchan) — Runs on a custom fork of `vichan`
<!-- * [`arisuchan.jp`](https://github.com/arisu-dev/arisuchan) -->
* [`soyjak.party`](https://soyjak.party/)
* [`vichan.pl`](https://vichan.pl/)

### infinity

[infinity](https://github.com/ctrlcctrlv/infinity) is a `vichan` fork permitting users to create their own boards (hence the name). As of April 2017, `infinity` engine is no longer being maintained. [OpenIB](https://github.com/OpenIB/OpenIB/) is a security-focused fork of the `infinity` engine which is no longer being maintained too.

* [`infinity` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/infinity.md).
* [`OpenIB` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/OpenIB.md).

Chans running on `infinity`:

* [`8kun.top`](https://8kun.top) (formerly `8ch.net`)
* [`smuglo.li`](https://smuglo.li/)

### makaba

The only imageboard running on `makaba` engine is currently [`2ch.hk`](https://2ch.hk).

* [`2ch.hk` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba.md)
* [`2ch.hk` API (brief official docs)](https://2ch.hk/api/)

### lynxchan

[`lynxchan`](https://gitgud.io/LynxChan/LynxChan) seems to be the only still-being-maintained imageboard engine left. Has [JSON API](https://gitgud.io/LynxChan/LynxChan/blob/master/doc/Json.txt) and [POST API](https://gitgud.io/LynxChan/LynxChan/-/blob/master/doc/Form.txt).

* [`lynxchan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan.md).

Chans running on `lynxchan`:

* [`kohlchan.net`](http://kohlchan.net).
* [`endchan.net`](https://endchan.net)
* [`alogs.space`](https://alogs.space)
* [`bandada`](https://bandada.club)

<!--
* [Old `kohlchan.net` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/kohlchan.net.old.md) (the old `vichan` API is no longer relevant: since May 28th, 2019 `kohlchan.net` [has been migrated](https://kohlchan.net/kohl/res/13096.html) from `vichan` to `lynxchan`)
-->

### jschan

[jschan](https://gitgud.io/fatchan/jschan/) is an alternative engine written in Node.js/MongoDB whose development started in 2019. Isn't really adopted by anyone, perhaps because there haven't been any new imageboards since its development has started. Compared to `lynxchan`, purely from a technical perspective, it looks much more professional and mature.

* [`jschan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/jschan.md).
* [`jschan` official API docs](https://fatchan.gitgud.site/jschan-docs/)

Chans running on `jschan`:

* [`junkuchan.org`](https://junkuchan.org)
* [`jakparty.soy`](https://jakparty.soy)

## Known issues

There're some limitations for imageboards running on `lynxchan` engine (for example, `kohlchan.net`) due to the [lack of support for several features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan-issues.md) in that engine.

There're [some smaller limitations](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/jschan-issues.md) for `jschan` engine.

There're some very minor limitations for the `infinity`/`OpenIB` engine due to the [lack of support for several very minor features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/infinity-issues.md) in that engine.

There're [some very minor bugs](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba-issues.md) for `2ch.hk` caused by its `makaba` engine.

## Testing

Unit tests:

```
npm run build
npm test
```

Real-world tests:

```
npm run build
npm run test-chan [chan-id]
```

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/imageboard) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/imageboard). Issues can be reported in any repo.

## License

[MIT](LICENSE)

<!--
## `kohlchan.net` boards

[Boards list](https://kohlchan.net/boards.js)

```js
var boards = ...

var grabbedBoards = Array.prototype.slice.apply(document.querySelectorAll('.linkBoard'))
  .map(node => ({
    id: node.innerHTML.split(' - ')[0].replace('/', '').replace('/', ''),
    title: node.innerHTML.split(' - ')[1],
    notSafeForWork: node.nextSibling.nextSibling.innerHTML === '*NVIP*' ? undefined : true,
    category: 'Allgemein'
  }))

grabbedBoards.forEach(board => {
  if (!board.notSafeForWork) {
    delete board.notSafeForWork
  }
})

var newBoards = grabbedBoards.filter(board => !boards.find(_ => _.id === board.id))
var removedBoards = boards.filter(board => !grabbedBoards.find(_ => _.id === board.id))

console.log('New boards', JSON.stringify(newBoards, null, '\t'))
console.log('Removed boards', JSON.stringify(removedBoards, null, '\t'))
```
-->