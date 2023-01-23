# `imageboard`

An easy uniform wrapper over the popular [imageboards](https://tvtropes.org/pmwiki/pmwiki.php/Main/Imageboards)' API.

[More on each engine's API](#imageboards-api)

Originally created as part of the [`anychan`](https://gitlab.com/catamphetamine/anychan) imageboard GUI.

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
* (optional) Automatically generate thread title when it's missing.

To do:

* Add methods for creating threads and posting comments.

## Install

```
npm install imageboard --save
```

## Example

This example will be using [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) for making HTTP requests (though any other library could be used). Node.js doesn't have `fetch()` yet so install a "polyfill" for it.

```
npm install node-fetch --save
```

Then, create an imageboard instance. This example will use `4chan.org` as a data source.

```js
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
      var error = new Error(response.statusText)
      // Set HTTP Response status code on the error.
      error.status = response.status
      throw error
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

* `request(method: string, url: string, parameters: object?): Promise` — (required) Sends HTTP requests to imageboard API. Must return a `Promise` resolving to response text.

```js
request("GET", "https://8kun.top/boards.json") === "[
  { "uri": "b", "title": "Random" },
  ...
]"
```

<details>
<summary>Reading archived threads on <code>2ch.hk</code> imageboard requires modifying the <code>request()</code> return type a bit.</summary>

######

The `request()` function can also return a `Promise` resolving to an object of shape `{ response, url }` where `response` is the response text and `url` is the "final" URL (after any redirects): this `url` is used internally when requesting archived threads from `2ch.hk` imageboard in order to get their `archivedAt` timestamp that can only be obtained from the URL the engine redirects to.
</details>

* `commentUrl: string?` — (optional) A template to use when formatting the `url` property of `type: "post-link"`s (links to other comments) in parsed comments' `content`. Is `"/{boardId}/{threadId}#{commentId}"` by default.

* `threadUrl: string?` — (optional) A template to use when formatting the `url` property of `type: "post-link"`s (links to threads) in parsed comments' `content`. Is `"/{boardId}/{threadId}"` by default.

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when parsing comments `content`. See [Messages](#messages).

* `commentLengthLimit: number` — (optional) A `number` telling the maximum comment length (in "points" which can be thought of as "characters and character equivalents for non-text content") upon exceeding which a preview is generated for a comment (as `comment.contentPreview`).

* `useRelativeUrls: boolean` — (optional) Determines whether to use relative or absolute URLs for attachments. Relative URLs are for the cases when an imageboard is temporarily hosted on an alternative domain and so all attachments are too meaning that the default imageboard domain name shouldn't be present in attachment URLs. Is `false` by default.

* `parseContent: boolean` — (optional) Can be set to `false` to skip parsing comment HTML into [`Content`](#content). The rationale is that when there're 500-some comments in a thread parsing all of them up-front can take up to a second on a modern desktop CPU which results in subpar user experience. By deferring parsing comments' HTML an application could first only parse the first N comments' HTML and only as the user starts scrolling would it proceed to parsing the next comments. Or maybe a developer wants to use their own HTML parser or even render comments' HTML as is. If `parseContent` is set to `false` then each non-empty comment will have their `content` being the original unmodified HTML string. In such cases `thread.title` won't be autogenerated when it's missing.

* `addParseContent: boolean` — (optional) Pass `true` to add a `.parseContent()` method to each comment. This could be used in scenarios when `parseContent: false` option is passed, for example, to only parse comments as they become visible on screen as the user scrolls rather than parsing all the comments in a thread up-front. When passing `addParseContent: true` option, also pass `expandReplies: true` option, otherwise `.parseContent()` won't go up the chain of quoted comments.

* `expandReplies: boolean` — (optional) Set to `true` to expand the optional `comment.replies[]` and `comment.inReplyTo[]` arrays from lists of comment ids to lists of the actual comment objects. Is `false` by default to prevent JSON circular structure: this way a whole thread could be serialized into a `*.json` file.

## `imageboard` methods

### `getBoards(): Board[]`

Returns a list of [Boards](#board). For some imageboards this isn't gonna be a full list of boards because, for example, `8ch.net (8kun.top)` has about `20,000` boards so `getBoards()` returns just the "top 20 boards" list.

### `hasMoreBoards(): boolean`

Returns `true` if the "get boards" API doesn't return the full list of boards. For example, `8ch.net (8kun.top)` has about `20,000` boards, so `getBoards()` returns just the "top 20 boards", and to indicate that, `hasMoreBoards()` returns `true`.

### `getAllBoards(): Board[]`

Returns the list of all [Boards](#board). For example, `8ch.net (8kun.top)` has about `20,000` boards, so `getBoards()` returns just the "top 20 boards", while `getAllBoards()` returns all `20,000` boards.

### `findBoards(query: string): Board[]`

Returns a (non-full) list of [Boards](#board) matching a `query`. For example, if an imageboard supports creating "user boards", and there're a lot of them, then `getBoards()` should return just the most popular ones, and to discover all other boards, searching by a query should be used.

This method isn't currently implemented in any of the supported imageboard engines.

### `canSearchForBoards(): boolean`

Returns `true` if the imageboard supports searching for boards by a query.

### `getThreads({ boardId: string }, options: object?): Thread[]`

Returns a list of [Threads](#thread).

The optional `options` argument can be used to override some of the `options` of the `imageboard()` function.

Additional options:

* `withLatestComments: boolean` — Pass `true` to get latest comments for each thread. Latest comments are added as `thread.latestComments[]`, but not necessarily for all threads in the list, because the result might differ depending on the imageboard engine. For example, `4chan` provides latest comments for all threads in the list as part of its "get threads list" API response, while other imageboard engines don't — which is lame — and so the latest comments have to somehow be fetched separately by, for example, going through the "pages" of threads on a board. When doing so, some `threads` might not get their `latestComments[]` at all, resulting in `thread.latestComments[]` being `undefined`. That might happen for different reasons. One reason is that the list of threads on a board changes between the individual "read page" requests, so some threads might get lost in this space-time gap. Another reason is that it wouldn't be practical to go through all of the "pages" because that'd put unnecessary load on the server, and that's when `maxLatestCommentsPages` parameter comes into effect.

* `maxLatestCommentsPages: number` — The maximum number of threads list "pages" to fetch in order to get the latest comments for each thread. When the engine doesn't provide the latest comments for each thread as part of its generic "get threads list" API response, the latest comments are fetched by going through every "page" of threads on a board. Therefore, to get the latest comments for all threads on a board, the code has to fetch all "pages", of which there may be many (for example, 10). At the same time, usually imageboards warn the user of the "max one API request per second" rate limit (which, of course, isn't actually imposed). So the code decides to play it safe and defaults to fetching just the first "page" of threads to get just those threads' latest comments, and doesn't set the latest comments for the rest of the threads. A developer may specify a larger count of "pages" to be fetched. It would be safe to specify "over the top" (larger than actual) pages count because the code will just discard all "Not found" errors. All pages are fetched simultaneously for better UX due to shorter loading time, so consider web browser limits for the maximum number of concurrent HTTP requests when setting this parameter to a high number.

* `latestCommentLengthLimit: number` — Same as `commentLengthLimit` but for `thread.latestComments`.

### `getThread({ boardId: string, threadId: number }, options: object?): Thread`

Returns a [Thread](#thread).

The optional `options` argument can be used to override some of the `options` of the `imageboard()` function.

Other available `options`:

* `archived` — (optional) Pass `true` when requesting an archived thread. This flag is not required in any way, but, for `makaba` engine, it reduces the number of HTTP Requests from 2 to 1 because in that case it doesn't have to attempt to read the thread by a non-"archived" URL (which returns `404 Not Found`) before attempting to read it by an "archived" URL.

<!--
### `parseCommentContent(comment: Comment, { boardId: string, threadId: number })`

Parses `comment` content if `parseContent: false` option was used when creating an `imageboard` instance.
-->

### `vote({ up: boolean, boardId: string, threadId: number, commentId: number }): boolean`

Some imageboards (like [`2ch.hk`](https://2ch.hk)) allow upvoting or downvoting threads and comments on certain boards (like [`/po/`litics on `2ch.hk`](https://2ch.hk/po)).

Returns `true` if the vote has been accepted. Returns `false` if the user has already voted.

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
* `generatedQuoteNewLineCharacterLength: number?` — (optional) "\n" character "length" (related to `generatedQuoteMaxLength`) when autogenerating quote. Is something like `30` by default.

### `setPostLinkQuotes(content: Content, getPostById: function, options: object)`

This is what `generateQuotes()` calls internally, apart from doing some other thigs

The `options`:

* `messages: Messages?` — (optional) "Messages" ("strings", "labels") used when generating comment `content` text. See [Messages](#messages).
* `generateQuotes: boolean?` — (optional) Is `true` by default, meaning that it will autogenerate quotes for all `post-link`s. If `false` is passed, then it won't autogenerate quotes for `post-link`s, and will either set `post-link`s' `content` to whatever human-written quotes immediately follow those `post-link`s, or mark them with `_block: true` if they're "block" ones (and not "inline" ones). How could this be used? See the comments on `generateQuotes: false` in `parseContent.js`.
* `generateBlockQuotes: boolean?` — (optional) Is `true` by default. `generateBlockQuotes: false` can be used to achieve the same effect as `generateQuotes: false` but only for "block" quotes (and not for "inline" quotes). See the comments on `generateBlockQuotes: false` in `parseContent.js`.
* `generatedQuoteMaxLength: number?` — (optional) Autogenerated quote "max length". Is `180` by default.
* `generatedQuoteMinFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual lower limit of content trimming length at `minFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteMaxFitFactor: number?` — (optional) Provides some flexibility on generated quote `maxLength`. Sets the usual upper limit of content trimming length at `maxFitFactor * maxLength`: if content surpasses `maxFitFactor * maxLength` limit, then it usually can be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `generatedQuoteNewLineCharacterLength: number?` — (optional) "\n" character "length" (related to `generatedQuoteMaxLength`) when autogenerating quote. Is something like `30` by default.
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

## Attachments

This library doesn't parse links to YouTube/Twitter/etc. Instead, this type of functionality is offloaded to a separate library. For example, [`anychan`](https://gitlab.com/catamphetamine/anychan) uses `loadResourceLinks()` and `expandStandaloneAttachmentLinks()` from [`social-components`](https://gitlab.com/catamphetamine/social-components) library when rendering comments to load YouTube/Twitter/etc links and embed the attachments directly in comments.

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
  description: string?,

  // Is this board "Not Safe For Work".
  notSafeForWork: boolean?,

  // "Bump limit" for threads on this board.
  bumpLimit: number?,

  // "Comments posted per hour" stats for this board.
  // Is supported by `makaba` and `lynxchan`.
  commentsPerHour: number?,

  // The maximum attachments count in a thread.
  // Only present for 4chan.org
  maxAttachmentsInThread: number?,

  // Maximum comment length in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  // `2ch.hk` also has it but doesn't return it as part of the `/boards.json` response.
  maxCommentLength: number?,

  // Maximum attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  maxAttachmentSize: number?,

  // Maximum video attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  maxVideoAttachmentSize: number?,

  // Maximum video attachment duration (in seconds) in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  maxVideoAttachmentDuration: number?,

  // Maximum total attachments size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org` or `2ch.hk`.
  maxAttachmentsSize: number?,

  // Create new thread cooldown.
  // Only present for `4chan.org`.
  createThreadCooldown: number?,

  // Post new comment cooldown.
  // Only present for `4chan.org`.
  postCommentCooldown: number?,

  // Post new comment with an attachment cooldown.
  // Only present for `4chan.org`.
  attachFileCooldown: number?,

  // The "features" supported or not supported on this board.
  features: {
    // Whether "sage" is allowed when posting comments on this board.
    // Only present for `4chan.org`.
    sage: boolean?,

    // Whether to show a "Name" field in a "post new comment" form on this board.
    // Only present for `2ch.hk`.
    name: boolean?
  }
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
  // (including the main comment of the thread).
  commentsCount: number,

  // Attachments count in this thread.
  // (including the attachments of the main comment of the thread).
  attachmentsCount: number,

  // Thread title ("subject").
  title: string?,

  // If the thread has no `title`, then `autogeneratedTitle`
  // is generated from the thread's "original comment" `content`.
  // This could be empty too: for example, if the "original comment"
  // has no `content`.
  autogeneratedTitle: string?,

  // The list of comments in this thread.
  // (including the main comment of the thread).
  comments: Comment[],

  // Is this thread "sticky" ("pinned") (on top of others).
  onTop: boolean?,
  // The order of a "sticky" ("pinned") thread amongst other "sticky" ("pinned") ones.
  onTopOrder: number?,

  // Is this thread locked.
  locked: boolean?,

  // A "trimming" thread is one where old messages are purged as new ones come in,
  // so that the total comments count doesn't exceed a certain threshold.
  trimming: boolean?,

  // On imageboards, threads "expire" due to being pushed off the
  // last page of a board because there haven't been new replies.
  // On some boards, such "expired" threads are moved into an "archive"
  // rather than just being deleted immediately.
  // Eventually, a thread is deleted from the archive too.
  // If a thread is archived, then it's locked too (by definition).
  archived: boolean?,

  // If `archived` is `true`, then `archivedAt` date might be defined.
  // So far, only `4chan`, `makaba` and `lynxchan` seem to have the archive feature.
  // * `4chan` provides both `archived` and `archivedAt` data in thread properties.
  // * `makaba` doesn't provide such data, but the code employs some hacks
  //   to find out whether a thread is archived, and, if it is, when has it been archived.
  //   `makaba` requires the `request()` function to return a `{ response, url }` object
  //   in order to get the `archivedAt` date of an `archived` thread.
  // * `lynxchan` allows admins or moderators to manually archive threads,
  //   but doesn't provide `archivedAt` date.
  archivedAt: Date?,

  // Was the "bump limit" reached for this thread already.
  // Is `false` when the thread is "sticky" or "trimming"
  // because such threads don't expire.
  bumpLimitReached: boolean?,

  // `4chan.org` sets a limit on maximum attachments count in a thread.
  attachmentLimitReached: boolean?,

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

    // Board "feature" flags.
    features: {
      // (`2ch.hk` only)
      // If this board disallows "Subject" field when posting a new reply
      // or creating a new thread, this flag is gonna be `false`.
      subject: boolean,

      // (`2ch.hk` only)
      // Whether this board allows attachments on posts.
      attachments: boolean,

      // (`2ch.hk` only)
      // Whether this board allows specifying "tags" when creating a new thread.
      tags: boolean,

      // (`2ch.hk` only)
      // Whether this board allows voting for comments/threads.
      votes: boolean
    },

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
  authorIsThreadAuthor: boolean?,

  // Some imageboards identify their users by a hash of their IP address subnet
  // on some of their boards (for example, all imageboards do that on `/pol/` boards).
  // On `8ch` and `lynxchan` it's a three-byte hex string (like "d1e8f1"),
  // on `4chan` it's a 8-character case-sensitive alphanumeric string (like "Bg9BS7Xl").
  //
  // Even when a thread uses `authorIds` for its comments, not all of them
  // might have it. For example, on `4chan`, users with "capcodes" (moderators, etc)
  // don't have an `authorId`.
  //
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
  sage: boolean?,

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
  inReplyTo: (number[]|Comment[])?,

  // If the comment replies to some comments that have been deleted,
  // then this is gonna be the list of IDs of such deleted comments.
  inReplyToRemoved: number[]?,

  // The IDs of the comments which are replies to this comment.
  // (excluding deleted comments).
  // If `expandReplies: true` option was passed
  // then `replies` is a list of `Comment`s.
  replies: (number[]|Comment[])?
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
    // "Find boards by a query" API URL.
    // `8ch.net (8kun.top)` has about `20,000` boards total,
    // so "getBoards()" API only returns top 20 of them,
    // while "findBoards('')" API returns all `20,000` of them.
    "findBoards": "/boards.json",

    // (required)
    // "Get threads list" API URL template.
    "getThreads": "/{boardId}/catalog.json",

    // (required)
    // "Get thread comments" API URL template.
    "getThread": "/{boardId}/res/{threadId}.json"

    // (optional)
    // "Get archived thread comments" API URL template.
    // Some engines (like `4chan`) use the same URLs
    // for both ongoing and archived threads.
    // Some engines (like `makaba`) use different URLs
    // for ongoing and archived threads.
    "getArchivedThread": "/{boardId}/arch/res/{threadId}.json"
  },

  // (required)
  // A template for a thread URL.
  // Isn't used anywhere in this library,
  // but third party applications like `anychan`
  // might use it to generate a link to the "original" thread.
  "threadUrl": "/{boardId}/res/{threadId}.html",

  // (required)
  // A template for a comment URL.
  // Is used when parsing links to other comments in comment HTML.
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
* The ["leaked" source code](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.php) from 2014 (may be outdated in some parts).

### vichan

[`vichan`](https://github.com/vichan-devel/vichan) engine was originally a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine having more features. As of November 2017, `vichan` engine is no longer being maintained.

* Brief notes on [`vichan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/vichan.md).

Chans running on their own `vichan` forks:

* [`lainchan.org`](https://github.com/lainchan/lainchan)
* [`arisuchan.jp`](https://github.com/arisu-dev/arisuchan)

### infinity

[infinity](https://github.com/ctrlcctrlv/infinity) is a `vichan` fork permitting users to create their own boards (hence the name). As of April 2017, `infinity` engine is no longer being maintained. [OpenIB](https://github.com/OpenIB/OpenIB/) is a security-focused fork of the `infinity` engine which is no longer being maintained too.

The only imageboard running on `infinity` engine is currently [`8ch.net (8kun.top)`](https://8kun.top).

* [`8ch.net (8kun.top)` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/OpenIB.md).

### makaba

The only imageboard running on `makaba` engine is currently [`2ch.hk`](https://2ch.hk).

* [`2ch.hk` API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba.md)
* [`2ch.hk` API (brief official docs)](https://2ch.hk/api/)

### lynxchan

[`lynxchan`](https://gitgud.io/LynxChan/LynxChan) seems to be the only still-being-maintained imageboard engine left. Has [JSON API](https://gitgud.io/LynxChan/LynxChan/blob/master/doc/Json.txt) and [POST API](https://gitgud.io/LynxChan/LynxChan/-/blob/master/doc/Form.txt).

* [`lynxchan` API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan.md).

Chans running on `lynxchan`:

* [`kohlchan.net`](http://kohlchan.net).

<!--
* [Old API (with examples)](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/kohlchan.net.old.md) (the old `vichan` API is no longer relevant: since May 28th, 2019 `kohlchan.net` [has been migrated](https://kohlchan.net/kohl/res/13096.html) from `vichan` to `lynxchan`)
-->

## Known issues

There're some limitations for imageboards running on `lynxchan` engine (for example, `kohlchan.net`) due to the [lack of support for several features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan-issues.md) in that engine.

There're some very minor limitations for `8ch.net (8kun.top)` caused by its `OpenIB` engine due to the [lack of support for several very minor features](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/OpenIB-issues.md) in that engine.

There're [some very minor bugs](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/makaba-issues.md) for `2ch.hk` caused by its `makaba` engine.

## Testing

Unit tests:

```
npm test
```

Real-world tests:

```
npm run build
node test/test
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