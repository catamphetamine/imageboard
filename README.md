# `imageboard`

An easy uniform wrapper over the popular imageboards' API.

Originally created as part of the [`captchan`](https://gitlab.com/catamphetamine/captchan) imageboard GUI.

Supported engines:

* [4chan](https://github.com/4chan/4chan-API)

  1. [4chan.org](https://www.4chan.org/) — [demo](https://captchan.surge.sh/4chan)

* [vichan](https://github.com/vichan-devel/vichan)

  1. [lainchan.org](https://lainchan.org/) — [demo](https://captchan.surge.sh/lainchan)

* [OpenIB](https://github.com/OpenIB/OpenIB/) (formerly [infinity](https://github.com/ctrlcctrlv/infinity))

  1. [8ch.net (8kun.top)](https://8kun.top/) — [demo](https://captchan.surge.sh/8ch)

* [lynxchan](https://gitgud.io/LynxChan/LynxChan)

  1. [kohlchan.net](https://kohlchan.net) — [demo](https://captchan.surge.sh/kohlchan)
  2. [endchan.net](https://endchan.net) — [demo](https://captchan.surge.sh/endchan)

* [makaba](https://2ch.hk/api/)

  1. [2ch.hk](https://2ch.hk/) — [demo](https://captchan.surge.sh/2ch)

Features:

* (optional) Parse comments HTML into structured JSON documents.
* (optional) Automatically generate shortened "previews" for long comments.
* (optional) Automatically insert quoted posts' text when none provided.
* (optional) [Censor](#censorship) certain words using regular expression syntax.
* (optional) Automatically generate thread title when it's missing.

To do:

* Add methods for creating threads and posting comments.

## GitHub Ban

On March 9th, 2020, GitHub silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (and all my libraries) without any notice for an unknown reason. I sent a support request but they didn't answer. Since GitHub doesn't want to host my libraries, they're hosted on GitLab now.

## Install

```
npm install imageboard --save
```

This library uses `async`/`await` syntax so including `regenerator-runtime/runtime` is required when using it. In Node.js that usually means including `@babel/runtime`. In a web browser that usually means including `@babel/polyfill` (though starting from Babel `7.4.0` `@babel/polyfill` [has been deprecated](https://babeljs.io/docs/en/babel-polyfill) in favor of manually including `core-js/stable` and `regenerator-runtime/runtime`).

## Example

This example will be using [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) for making HTTP requests (though any other library could be used). Node.js doesn't have `fetch()` yet so first install a "polyfill" for it, and also install `regenerator-runtime` (because `imageboard` package requires it).

```
npm install node-fetch regenerator-runtime/runtime --save
```

Then, create an imageboard instance. This example will use `4chan.org` as a data source.

```js
require('regenerator-runtime/runtime')
var fetch = require('node-fetch')
var imageboard = require('imageboard')

var fourChan = imageboard('4chan', {
  // Sends an HTTP request.
  // Any HTTP request library can be used here.
  // Must return a `Promise` resolving to response text.
  request: (method, url, { body, headers }) => {
    return fetch(url, { method, headers, body }).then((response) => {
      if (response.ok) {
        return response.text()
      }
      throw new Error(response.status)
    })
  }
})
```

Now, print the first ten of `4chan.org` boards:

```js
// Prints the first 10 boards.
fourChan.getBoards().then((boards) => {
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

Now, print the first five threads on `4chan.org` `/a/` board:

```js
var getCommentText = require('imageboard').getCommentText

// Prints the first five threads on `/a/` board.
fourChan.getThreads({
  boardId: 'a'
}).then((threads) => {
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

Now, print the first five comments of the thread:

```js
var getCommentText = require('imageboard').getCommentText

// Prints the first five comments of thread #193605320 on `/a/` board.
fourChan.getThread({
  boardId: 'a',
  threadId: 193605320
}).then((thread) => {
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
    if (title) {
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

## `imageboard` API

To use the package first construct an `imageboard` instance using the default exported function.

```js
import imageboard from 'imageboard'
```

### `imageboard(idOrConfig, options)`

The default exported function, creates a new `imageboard` instance.

If an imageboard `id` is supported by the library out-of-the-box (see the `./chan` directory) then such imageboard `id` can be passed as a string. Otherwise, imageboard `config` object should be supplied.

Imageboard `id`s supported out-of-the-box:

* `"2ch"`
* `"4chan"`
* `"8ch"` (8kun.top)
* `"kohlchan"`
* `"lainchan"`
* `"arisuchan"`
* `"endchan"`

See [Imageboard config](#imageboard-config) for the available imageboard `config` properties.

Available `options`:

* `request(method: string, url: string, parameters: object?): Promise` — (required) Sends HTTP requests to imageboard API. Must return a `Promise` resolving to response JSON. Example: `request("GET", "https://8kun.top/boards.json")`.

* `commentUrl: string?` — (optional) A template for the `url` of all `type: "post-link"`s (links to other comments) in parsed comments' `content`. Is `"/{boardId}/{threadId}#{commentId}"` by default.

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when parsing comments `content`. See [Messages](#messages).

* `censoredWords: object[]?` — (optional) An array of pre-compiled word filters which can be used for censoring certain words in parsed comments' `content` or `title`. See the [Censorship](#censorship) section of this README.

* `commentLengthLimit: number` — (optional) A `number` telling the maximum comment length (in "points" which can be thought of as "characters and character equivalents for non-text content") upon exceeding which a preview is generated for a comment (as `comment.contentPreview`).

* `useRelativeUrls: boolean` — (optional) Determines whether to use relative or absolute URLs for attachments. Relative URLs are for the cases when an imageboard is temporarily hosted on an alternative domain and so all attachments are too meaning that the default imageboard domain name shouldn't be present in attachment URLs. Is `false` by default.

* `parseContent: boolean` — (optional) Can be set to `false` to skip parsing comment HTML into [`Content`](#content). The rationale is that when there're 500-some comments in a thread parsing all of them up-front can take up to a second on a modern desktop CPU which results in subpar user experience. By deferring parsing comments' HTML an application could first only parse the first N comments' HTML and only as the user starts scrolling would it proceed to parsing the next comments. Or maybe a developer wants to use their own HTML parser or even render comments' HTML as is. If `parseContent` is set to `false` then each non-empty comment will have their `content` being the original unmodified HTML string. In such cases `thread.title` won't be autogenerated when it's missing. `imageboard.parseCommentContent(comment, { boardId, threadId })` method can be used to parse comment content later (for example, as the user scrolls).

* `addParseContent: boolean` — (optional) Pass `true` to add `.parseContent()` method to each comment. Can be used if `parseContent: false` option is passed.

* `expandReplies: boolean` — (optional) Set to `true` to expand the optional `comment.replies[]` array from a list of comment ids to the list of the actual comment objects. Is `false` by default to prevent JSON circular structure: this way a whole thread could be serialized into a file.

## `imageboard` methods

### `getBoards(): Board[]`

Returns a list of [Boards](#board). For some imageboards this isn't gonna be a full list of boards because, for example, `8ch.net (8kun.top)` has about `20,000` boards so `getBoards()` returns just the "top 20 boards" list.

### `getAllBoards(): Board[]`

Returns a list of all [Boards](#board). For example, `8ch.net (8kun.top)` has about `20,000` boards so `getBoards()` returns just the "top 20 boards" list while `getAllBoards()` returns all `20,000` boards.

### `hasMoreBoards(): boolean`

Returns `true` if an imageboard has a "get all boards" API endpoint that's different from the regular "get boards" API endpoint. In other words, returns `true` if an imageboard provides separate API endpoints for getting a list of "most popular boards" and a list of "all boards available".

### `getThreads({ boardId: string }, options: object?): Thread[]`

Returns a list of [Threads](#thread).

### `getThread({ boardId: string, threadId: number }, options: object?): Thread`

Returns a [Thread](#thread).

### `parseCommentContent(comment: Comment, { boardId: string, threadId: number })`

Parses `comment` content if `parseContent: false` option was used when creating an `imageboard` instance.

### `vote({ up: boolean, boardId: string, threadId: number, commentId: number }): boolean`

Some imageboards (like [`2ch.hk`](https://2ch.hk)) allow upvoting or downvoting threads and comments on certain boards (like [`/po/`litics on `2ch.hk`](https://2ch.hk/po)).

Returns `true` if the vote has been accepted. Returns `false` if the user has already voted.

## Miscellaneous API

The following functions are exported for "advanced" use cases. In other words, they're being used in [`captchan`](https://gitlab.com/catamphetamine/captchan) and that's the reason why they're exported.

### `getConfig(id: string): object?`

Returns an imageboard config by its `id`. Example: `getConfig("4chan")`.

Can be used in cases when an application for whatever reasons needs to know the imageboard info defined in the `*.json` file, such as `domain`, `engine`, etc.

### `compileWordPatterns(wordPatterns: string[]): object[]`

Compiles [word patterns](#censorship). This is just a `compileWordPatterns()` function re-exported from [`social-components`](https://gitlab.com/catamphetamine/social-components) for convenience.

Can be used for passing a custom `censoredWords` option to the `imageboard` constructor.

### `getCommentText(comment: Comment, options: object?): string?`

Generates a textual representation of [Comment](#comment)'s `content`. This is just a [`getPostText()`](https://gitlab.com/catamphetamine/social-components#getposttext-post-post-options-object-string) function re-exported from [`social-components`](https://gitlab.com/catamphetamine/social-components) for convenience.

Is used in the examples in this document.

Available `options` (optional argument):

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating text from `content`. See [Messages](#messages).
* `skipPostQuoteBlocks: boolean?` — (optional) Set to `true` to skip all "block" (not "inline") "comment quotes" (quotes citing a particular comment).
* `skipGeneratedPostQuoteBlocks: boolean?` — (optional) Set to `true` to skip all "block" (not "inline") autogenerated "comment quotes" (autogenerated quotes citing a particular comment).

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
* `generatedQuoteFitFactor: number?` — (optional) Autogenerated quote "max length" "fit factor". Is `1.35` by default.

### `setInReplyToQuotes(content: Content, getPostById: function, options: object)`

This is what `generateQuotes()` calls internally, apart from doing some other thigs

The `options`:

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `generateQuotes: boolean?` — (optional) Is `true` by default. Passing `generateQoutes: false` could seem like not making any sense, but it is used in [`captchan`](https://gitlab.com/catamphetamine/captchan) when parsing comments not starting from the first one: in that case it only parses a few of the "previous" comments which are then used in autogenerated quotes for the comments being shown; to further reduce the parsing time, autogenerated quotes for those few "previous" comments aren't generated by passing `generateQuotes: false`, further reducing the overall parsing time by a little bit.
* `generatedQuoteMaxLength: number?` — (optional) Autogenerated quote "max length". Is `180` by default.
* `generatedQuoteFitFactor: number?` — (optional) Autogenerated quote "max length" "fit factor". Is `1.35` by default.
-->

<!--
### `generatePreview(comment: Comment, maxCommentLength: number)`

Generates `contentPreview` for the `comment` if its too long.

Can be used, for example, in cases when a parent comment contains a "raw" hyperlink to a YouTube video, and after that video has been loaded the app inserts an embedded video player in place of the link, and since there's now a proper video title instead of a "raw" hyperlink the app also re-generates the preview for this comment (if a preview is required).
-->

<!--
### `generateThreadTitle(thread: Thread, options: object?)`

Autogenerates `thread.title` from the "opening" comment's `title` or `content` if `thread.title` is missing.

Can be used, for example, in cases when a thread has no title (and so thread title is autogenerated) and the "opening" comment contains a "raw" hyperlink to a YouTube video, and after that video has been loaded the app inserts an embedded video player in place of the link, and since there's now a proper video title instead of a "raw" hyperlink the app also re-generates the autogenerated thread title.

Available `options` (optional argument):

* `censoredWords: object[]?` — (optional) Compiled word patterns for [censoring](#censorship) comment text.
* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `parseContent: boolean?` — (optional) If `parseContent: false` is used to skip parsing comments' `content` when using `imageboard` methods then `parseContent: false` option should also be passed here so indicate that the "opening" comment `content` (raw unparsed HTML markup) should be ignored.
-->

## Attachments

This library doesn't parse links to YouTube/Twitter/etc. Instead, this type of functionality is offloaded to a separate library. For example, [`captchan`](https://gitlab.com/catamphetamine/captchan) uses `loadResourceLinks()` and `expandStandaloneAttachmentLinks()` from [`social-components`](https://gitlab.com/catamphetamine/social-components) library when rendering comments to load YouTube/Twitter/etc links and embed the attachments directly in comments.

## Models

### Board

```js
{
  // Board ID.
  // Example: "b".
  id: string,
  // Board title.
  // Example: "Anime & Manga".
  title: string,
  // Board description.
  description: string,
  // Is this board "Not Safe For Work".
  isNotSafeForWork: boolean?,
  // "Bump limit" for threads on this board.
  bumpLimit: number?,
  // The maximum attachments count in a thread.
  // Only present for 4chan.org
  maxAttachmentsInThread: number?,
  // Maximum comment length in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  // `2ch.hk` also has it but doesn't return it as part of the `/boards.json` response.
  maxCommentLength: number?,
  // Maximum total attachments size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  // `2ch.hk` also has it but doesn't return it as part of the `/boards.json` response.
  maxAttachmentsSize: number?,
  // Maximum total video attachments size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  maxVideoAttachmentsSize: number?,
  // Create new thread cooldown.
  // Only present for `4chan.org`.
  createThreadCooldown: number?,
  // Post new comment cooldown.
  // Only present for `4chan.org`.
  postCommentCooldown: number?,
  // Post new comment with an attachment cooldown.
  // Only present for `4chan.org`.
  attachFileCooldown: number?,
  // Whether "sage" is allowed when posting comments on this board.
  // Only present for `4chan.org`.
  isSageAllowed: boolean?,
  // Whether to show a "Name" field in a "post new comment" form on this board.
  // Only present for `2ch.hk`.
  areNamesAllowed: boolean?
}
```

### Thread

```js
{
  // Thread ID.
  // Same as the "id" of the first comment.
  id: number,
  // Board ID.
  // Example: "b".
  boardId: string,
  // Comments count in this thread.
  // (not including the main comment of the thread).
  commentsCount: number,
  // Attachments count in this thread.
  // (including the attachments of the main comment of the thread).
  attachmentsCount: number,
  // Thread title ("subject").
  // Either the first comment's `title` or is
  // autogenerated from the first comment's content.
  title: string?,
  // If `title` contains ignored words then a censored title
  // containing "censored" "spoilers" will be generated.
  // (with "spoilers" represented by "​░​" characters)
  titleCensored: string?,
  // Comments in this thread.
  // (including the main comment of the thread).
  comments: Comment[],
  // Is this thread "sticky" (pinned).
  isSticky: boolean?,
  // Is this thread locked.
  isLocked: boolean?,
  // A "rolling" thread is the one where old messages are purged as new ones come in.
  isRolling: boolean?,
  // Was the "bump limit" reached for this thread already.
  // Is `false` when the thread is "sticky" or "rolling"
  // because such threads don't expire.
  isBumpLimitReached: boolean?,
  // `4chan.org` sets a limit on maximum attachments count in a thread.
  isAttachmentLimitReached: boolean?,
  // `2ch.hk` and `lynxchan` don't specify board settings in `/boards.json` API response.
  // Instead, they return various limits as part of "get threads" or
  // "get thread comments" API responses (`2ch.hk` returns for both
  // and `lynxchan` returns only for "get thread comments" API).
  // In such case `board` will be present in a `Thread` object.
  // Also `board` will be present when "get thread comments" API response
  // contains board title.
  board: {
    // (both `lynxchan` and `2ch.hk`)
    // Board title.
    title: string,
    // (`2ch.hk` only)
    // "Bump limit" for threads on this board.
    bumpLimit: number,
    // (both `lynxchan` and `2ch.hk`)
    // Maximum comment length.
    maxCommentLength: number,
    // (`2ch.hk` only)
    // Maximum total attachments size for a post.
    maxAttachmentsSize: number,
    // (`lynxchan` only)
    // Maximum attachment size for a post.
    maxAttachmentSize: number,
    // (`lynxchan` only)
    // Maximum attachments count for a post.
    maxAttachments: number,
    // (`2ch.hk` only)
    // Whether this board allows "Subject" when posting a new reply or creating a new thread.
    areSubjectsAllowed: boolean,
    // (`2ch.hk` only)
    // Whether this board allows attachments on posts.
    areAttachmentsAllowed: boolean,
    // (`2ch.hk` only)
    // Whether this board allows specifying "tags" when creating a new thread.
    areTagsAllowed: boolean,
    // (`2ch.hk` only)
    // Whether this board allows voting for comments/threads.
    hasVoting: boolean,
    // (both `lynxchan` and `2ch.hk`)
    // An array of "badges" (like country flags but not country flags)
    // that can be used when posting a new reply or creating a new thread.
    // Each "badge" has an `id` and a `title`.
    badges: object[]?
  },
  // The date on which the thread was created.
  // Is absent in "get threads list" API response
  // of `lynxchan` engine which is a bug
  // but seems like they don't want to fix it.
  createdAt: Date?,
  // "Last Modified Date", usually including:
  // posting new comments, deleting existing comments, sticky/closed status changes.
  // Is usually present on all imageboards in "get threads list" API response
  // but not in "get thread comments" API response.
  updatedAt: Date?,
  // Custom spoiler ID (if custom spoilers are used on the board).
  // Only present for `4chan.org`.
  customSpoilerId: number?,
  // Unique poster IP address subnets count.
  // Only present in "get thread" API response.
  uniquePostersCount: number?
}
```

### Comment

```js
{
  // Comment ID.
  id: number,
  // Comment title ("subject").
  title: string?,
  // If `title` contains ignored words then a censored title
  // containing "censored" "spoilers" will be generated.
  titleCensored: InlineContent?,
  // The date on which the comment was posted.
  createdAt: Date,
  // "Last Modified Date".
  // I guess it includes all possible comment "modification"
  // actions like editing comment text, deleting attachments, etc.
  // Is present on "modified" comments in "get thread comments"
  // API response of `lynxchan` engine.
  updatedAt: Date?,
  // `2ch.hk` provides means for "original posters" to identify themselves
  // when replying in their own threads with a previously set "OP" cookie.
  isThreadAuthor: boolean?,
  // Some imageboards identify their users by a hash of their IP address subnet
  // on some of their boards (for example, all imageboards do that on `/pol/` boards).
  // On `8ch` and `lynxchan` it's a three-byte hex string (like "d1e8f1"),
  // on `4chan` it's a 8-character case-sensitive alphanumeric string (like "Bg9BS7Xl").
  authorId: String?,
  // If `authorId` is present then it's converted into a HEX color.
  // Example: "#c05a7f".
  authorIdColor: String?,
  // `2ch.hk` autogenerates names based on IP address subnet hash on `/po` board.
  // If this flag is `true` then it means that `authorName` is an equivalent of an `authorId`.
  authorNameIsId: boolean?,
  // Comment author name.
  authorName: String?,
  // Comment author's email address.
  authorEmail: String?
  // Comment author's "tripcode".
  // https://encyclopediadramatica.rs/Tripcode
  authorTripCode: String?,
  // A two-letter ISO country code (or "ZZ" for "Anonymized").
  // Imageboards usually show poster flags on `/int/` boards.
  authorCountry: String?,
  // Some imageboards allow icons for posts on some boards.
  // For example, `kohlchan.net` shows user icons on `/int/` board.
  // Author icon examples in this case: "UA", "RU-MOW", "TEXAS", "PROXYFAG", etc.
  // `authorBadgeUrl` is `/.static/flags/${authorBadge}.png`.
  // `authorBadgeName` examples in this case: "Ukraine", "Moscow", "Texas", "Proxy", etc.
  // Also, `2ch.hk` allows icons for posts on various boards like `/po/`.
  // Author icon examples in this case: "nya", "liber", "comm", "libertar", etc.
  // `authorBadgeUrl` is `/icons/logos/${authorBadge}.png`.
  // `authorBadgeName` examples in this case: "Nya", "Либерализм", "Коммунизм", "Либертарианство", etc.
  authorBadgeUrl: String?,
  authorBadgeName: String?,
  // If the comment was posted by a "priviliged" user
  // then it's gonna be the role of the comment author.
  // Examples: "administrator", "moderator".
  authorRole: String?,
  // `8ch.net (8kun.top)` and `lynxchan` have "global adiministrators"
  // and "board administrators", and "global moderators"
  // and "board moderators", so `authorRoleScope` is gonna be
  // "board" for a "board administrator" or "board moderator".
  authorRoleScope: String?,
  // If `true` then it means that the author was banned for the message.
  authorBan: boolean?,
  // An optional `String` with the ban reason.
  authorBanReason: String?,
  // If `true` then it means that the author has been verified
  // to be the one who they're claiming to be.
  // For example, `{ authorName: "Gabe Newell", authorVerified: true }`
  // would mean that that's real Gabe Newell posting in an "Ask Me Anything" thread.
  // It's the same as the "verified" checkmark on celebrities pages on social media like Twitter.
  authorVerified: Boolean?,
  // If this comment was posted with a "sage".
  // https://knowyourmeme.com/memes/sage
  isSage: boolean?,
  // Downvotes count for this comment.
  // Only for boards like `/po/` on `2ch.hk`.
  upvotes: number?,
  // Downvotes count for this comment.
  // Only for boards like `/po/` on `2ch.hk`.
  downvotes: number?,
  // Comment content.
  // If `parseContent: false` option was passed
  // then `content` is an HTML string (or `undefined`).
  // Otherwise, it's `Content` (or `undefined`).
  // Content example: `[['Comment text']]`.
  content: (string|Content)?,
  // If the `content` is too long a preview is generated.
  contentPreview: Content?,
  // Comment attachments.
  attachments: Attachment[]?,
  // The IDs of the comments to which this comment replies.
  // (excluding deleted comments).
  // If `expandReplies: true` option was passed
  // then `inReplyTo` is a list of `Comment`s.
  inReplyTo: number[]?,
  // The IDs of the comments which are replies to this comment.
  // (excluding deleted comments).
  // If `expandReplies: true` option was passed
  // then `replies` is a list of `Comment`s.
  replies: number[]?
}
```

### Content

Each comment can have `content` and sometimes `contentPreview` both of which are [`Content`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Post/PostContent.md) unless `parseContent: false` option was passed in which case `content` is an HTML string and no `contentPreview` is generated.

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

## Censorship

A `censoredWords` option can be passed to the `imageboard` function to censor certain words in parsed comments' `content` or `title`. The `censoredWords: object[]?` option must be a list of word filters pre-compiled via the exported `compileWordPatterns(censoredWords, language)` function:

* `language: string` — (required) A lowercase two-letter language code (examples: `"en"`, `"ru"`, `"de"`) used to generate a regular expression for splitting text into individual words.

* `censoredWords: string[]` — (required) An array of `string` word patterns. The standard regular expression syntax applies, `^` meaning "word start", `$` meaning "word end", `.` meaning "any letter", etc. The patterns are applied to each individual word and if there's a match then the whole word is censored.

Word pattern examples:

* `^mother.*` — Matches `"mothercare"` and `"motherfather"`.

* `^mother[f].*` — Matches `"motherfather"` but not `"mothercare"`.

* `^mother[^f].*` — Matches `"mothercare"` but not `"motherfather"`.

* `^cock$` — Matches `"cock"` in `"my cock is big"` but won't match `"cocktail"` or `"peacock"`.

* `cock` — Matches `"cock"`, `"cocktail"` and `"peacock"`.

* `cock$` — Matches `"cock"` and `"peacock"` but not `"cocktail"` .

* `^cocks?` — Matches `"cock"` and `"cocks"`.

* `^cock.{0,3}` — Matches `"cock"`, `"cocks"`, `"cocker"`, `"cockers"`.

Censored words in parsed comments' `content` will be replaced with `{ type: "spoiler", censored: true, content: "the-word-that-got-censored" }`.

Censored words in comment/thread `title`s don't result in their replacement but rather a new `titleCensored` property is generated with the words censored. The rationale is that `title` is a `string`, not `Content`, therefore it should stay a `string`. `content`, on the other hand, is already of `Content` type so it's edited in-place.

## Imageboard config

```js
{
  // (required)
  // Imageboard unique ID.
  "id": "4chan",

  // (required)
  // Imageboard website domain name.
  "domain": "4chan.org",

  // (required)
  // The engine the imageboard runs on.
  // Must be supported out-of-the-box (see the `./engine` directory).
  // Supported engines:
  // * `"4chan"`
  // * `"vichan"`
  // * `"OpenIB"`
  // * `"lynxchan"`
  // * `"makaba"`
  "engine": "vichan",

  // (optional)
  // Boards list.
  // Some smaller older imageboards don't provide a "get boards list" API.
  // For such imageboards the boards list is "hardcoded" in the config.
  "boards": [
    {
      // (required)
      // Board ID.
      "id": "λ",

      // (required)
      // Board title.
      "title": "Programming",

      // (optional)
      // Board category.
      // Can be used to display boards grouped by category.
      "category": "Technology"
    },
    ...
  ],

  // (required)
  "api": {
    // (required if there's no "boards" config parameter)
    // "Get boards list" API URL.
    "getBoards": "/boards-top20.json",

    // (optional)
    // "Get all boards list" API URL.
    // `8ch.net (8kun.top)` has about `20,000` boards total
    // so "getBoards" API only returns top 20 of them
    // while "getAllBoards" API returns all `20,000` of them.
    "getAllBoards": "/boards.json",

    // (required)
    // "Get threads list" API URL template.
    "getThreads": "/{boardId}/catalog.json",

    // (required)
    // "Get thread comments" API URL template.
    "getThread": "/{boardId}/res/{threadId}.json"
  },

  // (required)
  // A template for parsing links to other comments in comment HTML.
  "commentUrl": "/{boardId}/res/{threadId}.html#{commentId}",

  // (optional)
  // Attachment URL template.
  // Is required for imageboard engines that don't
  // provide the full attachment URL (`vichan`)
  // or for imageboards that host attachments on another domain
  // (`4chan` hosts attachments at `https://i.4cdn.org`).
  // Available parameters are:
  // * boardId — Board ID ("b", etc).
  // * name — Attachment filename on server.
  // * originalName — Original attachment filename, is used for non-image file attachments.
  // * ext — "." character plus attachment file extension.
  "attachmentUrl": "https://i.4cdn.org/{boardId}/{name}{ext}",

  // (optional)
  // Attachment thumbnail URL pattern.
  // Same as "attachmentUrl" but for thumbnails.
  "attachmentThumbnailUrl": "https://i.4cdn.org/{boardId}/{name}s.jpg",

  // (optional)
  // Imageboards usually store images/videos under random-generated filenames
  // and all other files under their original filename,
  // hence the separate "fileAttachmentUrl" parameter.
  "fileAttachmentUrl": "https://i.4cdn.org/{boardId}/{originalName}{ext}",

  // (is only required by `8ch.net (8kun.top)`)
  // `8ch.net (8kun.top)` has `fpath: 0/1` parameter for attachments:
  // `fpath: 1` attachments are hosted at the global
  // board-agnostic URLs (not having `{boardId}` as part of their URL)
  // and all other attachments are hosted at board-specific URLs.
  "attachmentUrlFpath": "https://media.8kun.top/file_store/{name}{ext}",

  // (is only required by `8ch.net (8kun.top)`)
  // Attachment thumbnail URL pattern for `fpath: 1` attachments.
  // Same as "attachmentUrlFpath" but for thumbnails.
  "attachmentThumbnailUrlFpath": "https://media.8kun.top/file_store/{name}{ext}",

  // (optional)
  // Most imageboards set author name to some default placeholder
  // like "Anonymous" when no author name has been input.
  // The parser then checks if author name is equal to the
  // "defaultAuthorName" and if it is then it leaves the `authorName` blank.
  // Can be a string or an object of shape `{ boardId: defaultAuthorName }`.
  "defaultAuthorName": "Anonymous",
  // or on a per-board basis:
  // "defaultAuthorName": {
  //  "*": "Anonymous",
  //  "ru": "Аноним",
  //  "christan": "Christanon"
  // }

  // (required for `lynxchan`)
  // Thumbnail size. Is required for `lynxchan`.
  // `lynxchan` engine currently has a bug:
  // it doesn't provide thumbnail dimensions.
  // To work around that bug, thumbnail dimensions
  // are derived from the original image aspect ratio.
  "thumbnailSize": 255
}
```

## Adding a new imageboard

* Create the imageboard's directory in `./src/imageboard/chan`.
* Create `index.json` and `index.js` files in the imageboard's directory (see other imageboards as an example). See [Imageboard config](#imageboard-config) for the explanation of the `index.json` file format.
* Add an export for the imageboard in `./src/imageboard/chan/index.js` (same as for the existing imageboards).

If the imageboard runs on an already supported engine then it most likely has its own comment HTML syntax which could be different from other imageboards running on the same engine. In such case, go to the engine directory (`./src/imageboard/engine/${engineName}`) and edit `index.js` file to use the set of ["comment parser plugins"](#comment-parser-plugins) specific to this new imageboard (see other imageboards' comment parser plugins as an example). Otherwise, if it's a new engine:

* Create the engine directory in `./src/imageboard/engine`.
* Create `index.js` file in the engine directory (same as for the existing engines). The engine class must extend `./src/imageboard/Engine.js` and implement at least four methods (`parseBoards()`, `parseThreads()`, `parseThread()` and `parseComment()`) and also provide a list of HTML ["comment parser plugins"](#comment-parser-plugins) (see other engines as an example).
* Add the engine in `./src/imageboard/engine/index.js` file (same as for the existing engines).

## Comment parser plugins

Imageboard comments are formatted in HTML. Different imageboards use their own comment HTML syntax. For example, bold text could be `<strong>bold</strong>` at some imageboards, `<b>bold</b>` at other imageboards and `<span class="bold">bold</span>` at the other imageboards, even if they all used the same engine. Hence, every imageboard requires defining their own set of "comment parser plugins" in `./src/imageboard/engine/${engine}` directory.

A "comment parser plugin" is an object having properties:

* `tag: String` — HTML tag (in lower case).
* `attributes: object[]?` — A set of HTML tag attribute filters. An attribute filter is an object of shape `{ name: String, value: String }`.
* `createBlock(content: PostContent, node, options): PostContent?` — Receives child `content` and wraps it in a parent content block (see [Post Content](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md) docs). Can return `undefined`. Can return a string, an object or an array of strings or objects. `node` is the DOM `Node` and provides methods like `getAttribute(name: String)`. `options` is an object providing some configuration options like `commentUrl` template for parsing comment links (`<a href="/b/123#456">&gt;&gt;456</a>`).

Example:

```html
<strong>bold <span class="italic">text</span></strong>
```

Plugins:

```js
const parseBold = {
  tag: 'strong',
  createBlock(content) {
    return {
      type: 'text',
      style: 'bold',
      content
    }
  }
}

const parseItalic = {
  tag: 'span',
  attributes: [{
    name: 'class',
    value: 'italic'
  }],
  createBlock(content) {
    return {
      type: 'text',
      style: 'italic',
      content
    }
  }
}

export default [
  parseBold,
  parseItalic
]
```

Result:

```js
[
  [
    {
      type: 'text',
      style: 'bold',
      content: [
        'bold ',
        {
          type: 'text',
          style: 'italic',
          content: 'text'
        }
      ]
    }
  ]
]
```

## Messages

Sometimes an optional `messages` object can be passed to define "messages" ("strings", "labels") used when parsing comments `content`. There're no defaults so these should be passed even for English.

Messages used for quoted comment links:

```js
{
  ...,
  comment: {
    default: "Comment",
    deleted: "Deleted comment",
    hidden: "Hidden comment",
    external: "Comment from another thread"
  }
}
```

Messages used when generating `content` text (autogenerated quotes, autogenerated thread title):

```js
{
  ...,
  contentType: {
    picture: "Picture",
    video: "Video",
    audio: "Audio",
    attachment: "Attachment",
    link: "Link",
    linkTo: "Link to"
  }
}
```

## Imageboards' API

### 4chan

* [`4chan.org` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.md)
* [`4chan.org` API (brief official docs)](https://github.com/4chan/4chan-API)

### vichan

[`vichan`](https://github.com/vichan-devel/vichan) engine was originally a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine having more features. After `4chan.org` added their [JSON API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.md) in 2012 so did `vichan`, and they did it in a way that it's compatible with `4chan.org` JSON API. For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same. As of November 2017, `vichan` engine is no longer being maintained.

Chans running on their own `vichan` forks:

* [`lainchan.org`](https://github.com/lainchan/lainchan)
* [`arisuchan.jp`](https://github.com/arisu-dev/arisuchan)

### infinity

[infinity](https://github.com/ctrlcctrlv/infinity) is a `vichan` fork permitting users to create their own boards (hence the name). As of April 2017, `infinity` engine is no longer being maintained. [OpenIB](https://github.com/OpenIB/OpenIB/) is a security-focused fork of the `infinity` engine which is no longer being maintained too.

The only imageboard running on `infinity` engine is currently [`8ch.net (8kun.top)`](https://8kun.top).

* [`8ch.net (8kun.top)` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/OpenIB.md).

### makaba

The only imageboard running on `makaba` engine is currently [`2ch.hk`](https://2ch.hk).

* [`2ch.hk` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba.md)
* [`2ch.hk` API (brief official docs)](https://2ch.hk/api/)

### lynxchan

[`lynxchan`](https://gitgud.io/LynxChan/LynxChan) seems to be the only still-being-maintained imageboard engine left. Has [JSON API](https://gitgud.io/LynxChan/LynxChan/blob/master/doc/Json.txt).

Chans running on `lynxchan`:

* [`kohlchan.net`](http://kohlchan.net)

<!--
* [Old API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/kohlchan.net.old.md) (the old `vichan` API is no longer relevant: since May 28th, 2019 `kohlchan.net` [has been migrated](https://kohlchan.net/kohl/res/13096.html) from `vichan` to `lynxchan`)
-->

## Known issues

There're some limitations for imageboards running on `lynxchan` engine (for example, `kohlchan.net`) due to the [lack of support for several features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan-issues.md) in that engine.

There're some very minor limitations for `8ch.net (8kun.top)` caused by its `OpenIB` engine due to the [lack of support for several very minor features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/OpenIB-issues.md) in that engine.

There're [some very minor bugs](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba-issues.md) for `2ch.hk` caused by its `makaba` engine.

## What else

You made it. There's not much else to document here, for now. Move along.

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
    isNotSafeForWork: node.nextSibling.nextSibling.innerHTML === '*NVIP*' ? undefined : true,
    category: 'Allgemein'
  }))

grabbedBoards.forEach(board => {
  if (!board.isNotSafeForWork) {
    delete board.isNotSafeForWork
  }
})

var newBoards = grabbedBoards.filter(board => !boards.find(_ => _.id === board.id))
var removedBoards = boards.filter(board => !grabbedBoards.find(_ => _.id === board.id))

console.log('New boards', JSON.stringify(newBoards, null, '\t'))
console.log('Removed boards', JSON.stringify(removedBoards, null, '\t'))
```
-->