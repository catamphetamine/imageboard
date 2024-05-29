# `imageboard`

An easy uniform wrapper over the popular [imageboards](https://tvtropes.org/pmwiki/pmwiki.php/Main/Imageboards)' API.

[More on each engine's API](#imageboards-api)

[Thoughts](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/thoughts.md)

Originally created as part of the [`anychan`](https://gitlab.com/catamphetamine/anychan) imageboard GUI.

Supported engines:

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

 <!-- P.S. The [demo](https://anychans.github.io/) website doesn't seem to work with any known `jschan` imageboard because all of them use CloudFlare anti-DDoS protection that doesn't allow through the [CORS proxy](https://gitlab.com/catamphetamine/anychan/-/tree/master/docs/proxy/README.md). -->

  1. [junkuchan.org](https://junkuchan.org) — [demo](https://anychans.github.io/junkuchan)
  2. [jakparty.soy](https://jakparty.soy) — [demo](https://anychans.github.io/jakpartysoy)
  3. [heolkek.cafe](https://heolkek.cafe)
  4. [27chan.org](https://27chan.org/)
  5. [niuchan.org](https://niuchan.org/)
  6. [zzzchan.xyz](https://zzzchan.xyz)
  7. [trashchan.xyz](https://trashchan.xyz/)
  8. [94chan.org](https://94chan.org/)
  9. [ptchan.org](https://ptchan.org/)

  <!-- 2. [94chan.org](https://94chan.org/) — [demo](https://anychans.github.io/94chan). The website is behind a CloudFlare-alike DDoS protection and returns `403 Forbidden` for the "demo" CORS proxy, but it is functional when accessed through one's [own CORS proxy](https://gitlab.com/catamphetamine/anychan/-/blob/master/docs/proxy/README.md) running at `localhost`. -->

  <!-- 3. [ptchan.org](https://ptchan.org/) — [demo](https://anychans.github.io/ptchan). The website is behind a CloudFlare-alike DDoS protection and returns [`403 Forbidden`](https://gitgud.io/fatchan/haproxy-protection/-/issues/24) for a CORS proxy. -->

* [makaba](https://2ch.hk/api/) — `2ch.hk`'s proprietary engine.

  1. [2ch.hk](https://2ch.hk/) — [demo](https://anychans.github.io/2ch)

Features:

* (optional) Parse comments HTML into structured JSON documents.
* (optional) Automatically generate shortened "previews" for long comments.
* (optional) Automatically insert quoted posts' text when none provided.
* (optional) Automatically generate thread title when it's missing.
* (not on all imageboards) Create threads and post comments. Report comments.

## Install

```
npm install imageboard --save
```

## Example

In this example, we'll be using Node.js.

Create a folder and `cd` into it.

For making HTTP requests, we'll be using [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch), though any other library could be used. Node.js doesn't have `fetch()` yet so install a "polyfill" for it.

```
npm install node-fetch --save
```

This example will be using `4chan.org` as a data source. Create a file called `fourChan.js` and paste the following code into it.

```js
import fetch, { FormData } from 'node-fetch'
import imageboard from 'imageboard'

const fourChan = imageboard('4chan', {
  // Sends an HTTP request.
  // See the description of `imageboard()` function options for more details.
  request: (method, url, { body, headers, cookies }) => {
    // If request "Content-Type" is set to be "multipart/form-data",
    // convert the `body` object to a `FormData` instance.
    if (headers['content-type'] === 'multipart/form-data') {
      body = createFormData(body)
      // Remove `Content-Type` header so that it autogenerates it from the `FormData`.
      // Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
      delete headers['content-type']
    } else {
      body = JSON.stringify(body)
    }
    // Send `cookies` when not running in a web browser.
    headers['cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
    // Send HTTP request.
    return fetch(url, {
      method,
      headers,
      body,
      // By default, `fetch()` follows any redirects in the process.
      // Many imageboards have API endpoints that set cookies and then redirect.
      // If `fetch()` was to follow those redirects, those `set-cookie` headers
      // from a `status: 302` response would be ignored, and the `imageboard` library
      // should be able to inspect those `set-cookie` headers in order to extract
      // their values. So `fetch()` is specifically configured to not follow redirects.
      redirect: 'manual'
    }).then((response) => {
      if (response.status < 400) {
        return response.text().then((responseText) => ({
          url: response.url,
          status: response.status,
          headers: response.headers,
          responseText
        }))
      }
      return rejectWithErrorForResponse(response)
    })
  }
})

export default fourChan

// Creates an error from a `fetch()` response.
// Returns a `Promise` and rejects it with the error.
function rejectWithErrorForResponse(response) {
  const error = new Error(response.statusText)
  error.url = response.url
  error.status = response.status
  error.headers = response.headers
  return response.text().then(
    (responseText) => {
      error.responseText = responseText
      throw error
    },
    (error_) => {
      throw error
    }
  )
}

// Converts an object to a `FormData` instance.
function createFormData(body) {
  // * For 'multipart/form-data', use `FormData` class.
  // * For 'application/x-www-form-urlencoded', use `URLSearchParams` class.
  const formData = new FormData()
  if (body) {
    for (const key of Object.keys(body)) {
      if (body[key] !== undefined && body[key] !== null) {
        if (Array.isArray(body[key])) {
          for (const element of body[key]) {
            formData.append(key + '[]', element)
          }
        } else {
          formData.append(key, body[key])
        }
      }
    }
  }
  return formData
}
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

* `request(method, url, options): Promise` — (required) Sends HTTP requests to an imageboard's API. Must not follow HTTP redirects.
  * Arguments:
    * `method: string` — HTTP request method, in upper case.
    * `url: string` — HTTP request URL.
    * `options: object`
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
await request("GET", "https://8kun.top/boards.json") === {
  url: "https://8kun.top/boards.json",
  responseText: "[
    { "uri": "b", "title": "Random" },
    ...
  ]"
}
```

<details>
<summary>Returning <code>responseText</code> is understandable, but what does it use <code>url</code> and <code>headers</code> for?</summary>

######

`url` is used when reading archived threads on `2ch.hk` imageboard. When requesting an archived thread on `2ch.hk`, it always redirects to a URL that looks like `/boardId/arch/yyyy-mm-dd/res/threadId.json`. As one can see, there's the `archivedAt` date in that final "redirect-to" URL, and it's nowhere else to be read. So this library has to have the access to the final URL after any redirects.

`headers` are used when parsing an imageboard API's response to a "log in" request: this library attempts to read the authentication cookie value from that response in order to return it to the application code.
</details>

<details>
<summary>Making HTTP requests in a web browser will most likely require a CORS proxy.</summary>

######

None of the imageboards (`4chan.org`, `8kun.top`, `2ch.hk`, etc) allow calling their API from other websites in a web browser: they're all configured to block [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for a third party website to be able to query their API.

To bypass CORS limitations, the `request()` function would have to call `fetch()` not with the original imageboard URL like `https://imageboard.net/boards.json` directly but rather with a "proxied" URL like `https://my-cors-proxy-address.net/?url=${encodeURIComponent('https://imageboard.net/boards.json')}`.

[How to set up a CORS proxy](https://gitlab.com/catamphetamine/anychan/#proxy).
</details>

* `commentUrl?: string` — A template to use when formatting the `url` property of `type: "post-link"`s (links to other comments) in parsed comments' `content`. Is `"/{boardId}/{threadId}#{commentId}"` by default.

* `threadUrl?: string` — A template to use when formatting the `url` property of `type: "post-link"`s (links to threads) in parsed comments' `content`. Is `"/{boardId}/{threadId}"` by default.

* `messages?: Messages` — "Messages" ("strings", "labels") used when parsing comments `content`. See [Messages](#messages).

* `commentLengthLimit?: number` — A `number` telling the maximum comment length (in "points" which can be thought of as "characters and character equivalents for non-text content") upon exceeding which a preview is generated for a comment (as `comment.contentPreview`).

* `useRelativeUrls?: boolean` — Determines whether to use relative or absolute URLs for attachments. Relative URLs are for the cases when an imageboard is temporarily hosted on an alternative domain and so all attachments are too meaning that the default imageboard domain name shouldn't be present in attachment URLs. Is `false` by default.

Advanced `options`:

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

## `imageboard` methods

### `supportsFeature(feature: string)`

Tells whether the imageboard supports a certain feature.

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

Parameters:

* `query: string` — Search query.

Returns an object with properties:

* `boards` — a list of [Boards](#board)

This function isn't currently implemented in any of the supported imageboard engines. To see if a given imageboard supports this function, use `supportsFeature('findBoards')` function.

### `getThreads()`

Fetches a list of threads on a board.

Parameters:

* `boardId: string` — Board ID.

* `options?: object` — An optional `options` object that can be used to override some of the `options` passed to the `imageboard()` function. Additionally, it could also contain the following options:

  * `withLatestComments: boolean` — Pass `true` to get latest comments for each thread. Latest comments are added as `thread.latestComments[]`, but not necessarily for all threads in the list, because the result might differ depending on the imageboard engine. For example, `4chan` provides latest comments for all threads in the list as part of its "get threads list" API response, while other imageboard engines don't — which is lame — and so the latest comments have to somehow be fetched separately by, for example, going through the "pages" of threads on a board. When doing so, some `threads` might not get their `latestComments[]` at all, resulting in `thread.latestComments[]` being `undefined`. That might happen for different reasons. One reason is that the list of threads on a board changes between the individual "read page" requests, so some threads might get lost in this space-time gap. Another reason is that it wouldn't be practical to go through all of the "pages" because that'd put unnecessary load on the server, and that's when `maxLatestCommentsPages` parameter comes into effect.

  * `maxLatestCommentsPages: number` — The maximum number of threads list "pages" to fetch in order to get the latest comments for each thread. When the engine doesn't provide the latest comments for each thread as part of its generic "get threads list" API response, the latest comments are fetched by going through every "page" of threads on a board. Therefore, to get the latest comments for all threads on a board, the code has to fetch all "pages", of which there may be many (for example, 10). At the same time, usually imageboards warn the user of the "max one API request per second" rate limit (which, of course, isn't actually imposed). So the code decides to play it safe and defaults to fetching just the first "page" of threads to get just those threads' latest comments, and doesn't set the latest comments for the rest of the threads. A developer may specify a larger count of "pages" to be fetched. It would be safe to specify "over the top" (larger than actual) pages count because the code will just discard all "Not found" errors. All pages are fetched simultaneously for better UX due to shorter loading time, so consider web browser limits for the maximum number of concurrent HTTP requests when setting this parameter to a high number.

  * `latestCommentLengthLimit: number` — Same as `commentLengthLimit` but for `thread.latestComments`.

  * `sortByRating: boolean` — Set to `true` to sort threads by "rating", if it's available.

Returns an object with properties:

* `threads` — a list of [Threads](#thread)
* `boards` — (optional) [Board](#board)

### `getThread()`

Fetches a thread.

Parameters:

* `boardId: string` — Board ID.

* `threadId: number` — Thread ID.

* `options: object?` — An optional `options` object that can be used to override some of the `options` passed to the `imageboard()` function. Additionally, it could also contain the following options:

  * `archived: boolean` — (optional) Pass `true` when requesting an archived thread. This flag is not required in any way, but, for `makaba` engine, it reduces the number of HTTP Requests from 2 to 1 because in that case it doesn't have to attempt to read the thread by a non-"archived" URL (which returns `404 Not Found`) before attempting to read it by an "archived" URL.

  * `afterCommentId: number` — (optional) (experimental) Could be used to only fetch comments after a certain comment.

  * `afterCommentsCount: number` — (optional) (experimental) Could be used to only fetch comments after a certain comments count (counting from the first comment in the thread).


Returns an object with properties:

* `thread` — [Thread](#thread)
* `board` — (optional) [Board](#board)

<!--
### `parseCommentContent(comment: Comment, { boardId: string, threadId: number })`

Parses `comment` content if `parseContent: false` option was used when creating an `imageboard` instance.
-->

### `voteForComment()`

Some imageboards (like [`2ch.hk`](https://2ch.hk)) allow upvoting or downvoting threads and comments on certain boards (like [`/po/`litics on `2ch.hk`](https://2ch.hk/po)).

Parameters:

* `boardId: string` — Board ID.
* `threadId: number` — Thread ID.
* `commentId: number` — Comment ID.
* `up: boolean` — Upvote or downvote.

Returns:

* `true` — The vote has been accepted.
* `false` — The vote has not been accepted. For example, if the user has already voted.

### `createThread()`

Creates a new thread on a board.

Parameters:

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

Parameters:

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

Parameters:

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

Parameters:

* `captchaId: string` — Captcha ID.
* `captchaSolution: string` — Captcha solution.

Returns an object:

* `token: string` — "Block bypass" token.
* `expiresAt: date` — The date when the "block bypass" token expires.

### `logIn()`

Performs a login.

Parameters:

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

Parameters:

* `boardId: string` — Board ID.
* `threadId: number` — Thread ID.
* `commentId: number` — Comment ID.
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

  // Board category.
  category: string?,

  // Is this board "Not Safe For Work".
  notSafeForWork: boolean?,

  // "Bump limit" for threads on this board.
  bumpLimit: number?,

  // "Comments posted per hour" stats for this board.
  commentsPerHour: number?,

  // "Comments posted per day" stats for this board.
  commentsPerDay: number?,

  // "Unique comment posters per day" stats for this board.
  uniquePostersPerDay: number?,

  // Allowed attachment types.
  attachmentTypes: string[]?,

  // The maximum attachments count in a comment or when posting a new thread.
  // Only present for 4chan.org
  attachmentsMaxCount: number?,

  // The maximum overall attachments count in a thread.
  // Only present for 4chan.org
  threadAttachmentsMaxCount: number?,

  // Minimum comment length on the board (a board-wide setting).
  // Is used in `jschan`.
  commentContentMinLength: number?,

  // Maximum comment length on the board (a board-wide setting).
  // Only present for `4chan.org`.
  // `2ch.hk` also has it but doesn't return it as part of the `/boards.json` response.
  commentContentMaxLength: number?,

  // Minimum comment length when creating a thread on the board (a board-wide setting).
  // Is used in `jschan`.
  mainCommentContentMinLength: number?,

  // Maximum comment length when creating a thread on the board (a board-wide setting).
  // Is used in `jschan`.
  mainCommentContentMaxLength: number?,

  // Whether thread title is required when creating it.
  // Is used in `jschan`.
  threadTitleRequired: boolean?,

  // Whether comment text is required when creating a thread.
  // Is used in `jschan`.
  mainCommentContentRequired: boolean?,

  // Whether comment attachments are required when creating a thread.
  // Is used in `jschan`.
  mainCommentAttachmentRequired: boolean?,

  // Maximum attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  attachmentMaxSize: number?,

  // Maximum total attachments size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org` or `2ch.hk`.
  attachmentsMaxTotalSize: number?,

  // Maximum video attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  videoAttachmentMaxSize: number?,

  // Maximum video attachment duration (in seconds) in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  videoAttachmentMaxDuration: number?,

  // Create new thread cooldown.
  // Only present for `4chan.org`.
  createThreadMinInterval: number?,

  // Post new comment cooldown.
  // Only present for `4chan.org`.
  createCommentMinInterval: number?,

  // Post new comment with an attachment cooldown.
  // Only present for `4chan.org`.
  createCommentWithAttachmentMinInterval: number?,

  // The language that's used on the board.
  // For example, `kohlchan.net` has a separate `/ru/` board for Russian-speaking users.
  language: string?,

  // An array of "badges" (like country flags but not country flags)
  // that can be used when posting a new reply or creating a new thread.
  // Each "badge" has an `id` and a `title`.
  badges: object[]?,

  // Default comment author name (when left blank).
  defaultAuthorName: string?,

  // The "features" supported or not supported on this board.
  features: {
    // Whether "sage" is allowed when posting comments on this board.
    // Is used in `4chan.org`.
    sage: boolean?,

    // Whether to show a "Name" field in a "post new comment" form on this board.
    // Is used in `2ch.hk` and `jschan`.
    authorName: boolean?,

    // Whether to show an "Email" field in a "post new comment" form on this board.
    // Is used in `jschan`.
    authorEmail: boolean?,

    // Whether the board has custom badges.
    // Is used in `jschan`.
    badges: boolean?,

    // Whether the board allows specifying a title when creating a thread.
    // Is used in `jschan`.
    threadTitle: boolean?,

    // Whether the board allows specifying a title when posting a comment.
    // Is used in `jschan`.
    commentTitle: boolean?
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

  // Attachments count in comments of this thread.
  // (not including the attachments of the main comment of the thread).
  commentAttachmentsCount: number,

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
  pinned: boolean?,
  // The order of a "sticky" ("pinned") thread amongst other "sticky" ("pinned") ones.
  pinnedOrder: number?,

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
    commentContentMaxLength: number,

    // (`2ch.hk` only)
    // Maximum total attachments size for a post.
    attachmentsMaxTotalSize: number,

    // (`lynxchan` only)
    // Maximum attachment size for a post.
    attachmentMaxSize: number,

    // (`lynxchan` only)
    // Maximum attachments count for a post.
    attachmentsMaxCount: number,

    // Board "feature" flags.
    features: {
      // (`2ch.hk` only)
      // If this board disallows "Subject" field when posting a new reply
      // or creating a new thread, this flag is gonna be `false`.
      threadTitle: boolean,
      commentTitle: boolean,

      // (`2ch.hk` only)
      // Whether this board allows attachments on posts.
      attachments: boolean,

      // (`2ch.hk` only)
      // Whether this board allows specifying "tags" when creating a new thread.
      threadTags: boolean,

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

  // The IDs of the comments to which this `comment` replies.
  // If some of the replies have been deleted, their IDs will not be present in this list.
  inReplyToIds: number[]?,

  // If this `comment` replies to some other comments that have been deleted,
  // then this is gonna be the list of IDs of such deleted comments.
  inReplyToIdsRemoved: number[]?,

  // If `expandReplies: true` option was passed
  // then `inReplyTo` property will be a list of `Comment`s.
  // (excluding deleted comments).
  inReplyTo: Comment[]?,

  // The IDs of the comments that are replies to this `comment`.
  replyIds: number[]?,

  // If `expandReplies: true` option was passed
  // then `replies` will be a list of `Comment`s that reply to this `comment`.
  replies: Comment[]?
}
```

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
    "getBoards": {
      "method": "GET",
      "url": "/boards-top20.json"
    },

    // (optional)
    // "Find boards by a query" API URL.
    // `8ch.net (8kun.top)` has about `20,000` boards total,
    // so "getBoards()" API only returns top 20 of them,
    // while "findBoards('')" API returns all `20,000` of them.
    "findBoards": {
      "method": "GET",
      "url": "/boards.json"
    },

    // (required)
    // "Get threads list" API URL template.
    "getThreads": {
      "method": "GET",
      "url": "/{boardId}/catalog.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list including their latest comments" API URL template.
    "getThreadsWithLatestComments": {
      "method": "GET",
      "url": "https://a.4cdn.org/{boardId}/catalog.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list (first page) including their latest comments" API URL template.
    "getThreadsWithLatestCommentsFirstPage": {
      "method": "GET",
      "url": "/{boardId}/index.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list (N-th page) including their latest comments" API URL template.
    // Available parameters for the page: `pageIndex`, `page` (= `pageIndex` + 1).
    "getThreadsWithLatestCommentsPage": {
      "method": "GET",
      "url": "/{boardId}/{pageIndex}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "pageIndex" }]
    },

    // (optional)
    // "Get threads stats" API URL template.
    "getThreadsStats": {
      "method": "GET",
      "url": "/{boardId}/threads.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (required)
    // "Get thread comments" API URL template.
    "getThread": {
      "method": "GET",
      "url": "/{boardId}/res/{threadId}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "threadId" }]
    },

    // (optional)
    // "Get archived thread comments" API URL template.
    // Some engines (like `4chan`) use the same URLs
    // for both ongoing and archived threads.
    // Some engines (like `makaba`) use different URLs
    // for ongoing and archived threads.
    "getArchivedThread": {
      "method": "GET",
      "url": "/{boardId}/arch/res/{threadId}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "threadId" }]
    }
  },

  // (required)
  // A template for a board URL.
  // Isn't used anywhere in this library,
  // but third party applications like `anychan`
  // might use it to generate a link to the "original" board.
  "boardUrl": "/{boardId}",

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
  "attachmentUrlFpath": "https://media.128ducks.com/file_store/{name}{ext}",

  // (is only required by `8ch.net (8kun.top)`)
  // Attachment thumbnail URL pattern for `fpath: 1` attachments.
  // Same as "attachmentUrlFpath" but for thumbnails.
  "attachmentThumbnailUrlFpath": "https://media.128ducks.com/file_store/{name}{ext}",

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

* Create the imageboard's folder in `./chans` directory.
  * Create `index.json` file in that folder. See other imageboards as an example. See [Imageboard config](#imageboard-config) for the explanation of the `index.json` file format.
  * An `index.json.js` file will be automatically created from `index.json` file at the "build" step, so there's no need to created it by hand.
* Create the imageboard's folder in `./lib/chan` directory.
  * Create `index.js` file in that folder. See other imageboards as an example.
* Open `./lib/chan/getConfig.js` file and add the new imageboard to the list.
* Open `./lib/chan/index.js` file and add the new imageboard to the list.

The next steps depend on whether the imageboard uses an already supported engine or a new one.

#### Existing engine

If the imageboard runs on an already supported engine, then most likely no additional setup is required.

In some rare cases, an imageboard might have its own "custom" comment HTML syntax which could be different from the other imageboards running on the same engine. For example, that's the case with `4chan`-alike imageboards. In such case, go to the engine's directory — `./lib/engine/<engine.id>` — and edit `index.js` file of the engine to instruct it to use a different set of [comment markup syntax](#comment-markup-syntax) plugins specific to the new imageboard when passing a `parseCommentContentPlugins` parameter to the `super()` constructor. To differentiate between different imageboards that use the same engine, one could use the `imageboardConfig.id` parameter that is available in the `constructor()` of the class. For an example, see how it's done in `./lib/engine/4chan/index.js`.

#### New engine

If the new imageboard runs on a new engine that isn't supported out-of-the-box:

* In case of any questions, see other engines as an example.
* Create the new engine's folder in `./lib/engine` directory: `./lib/engine/<engine.id>`.
* Create an `index.js` file in the `./lib/engine/<engine.id>` folder. The file should export an [engine implementation](#engine-implementation) class. That would also involve creating a file with the "settings" for the engine at `./lib/engine/<engine.id>/settings.json` path.
* Open `./lib/engine/index.js` file and add the new engine to the list.
* Open `./lib/engine/getConfig.js` file and add the new engine to the list.

#####

#### Testing

Test the new imageboard:

```
npm run build
npm run test-chan <imageboard-id>
```

## Engine implementation

An "engine implementation" is a javascript class that extends `./lib/Engine.js` base class and sits at `./lib/engine/<engine.id>/index.js` path.

The implementation class must implement a pre-defined set of functions for interfacing with the engine's API. Each such function receives two arguments — `response` data and `options` object — and is expected to return a result in a certain format. Basically, an "engine implementation" class acts as a translator from the engine's API output format to the `imageboard` package output format.

The functions are:

* `parseBoards()` or `parseBoardsPage()`, depending on whether the engine returns the list of boards all at once or paginated — Returns a list of `Board` objects.
* `parseThreads()` — Returns a list of `Thread` objects.
* `parseThread()` — Returns a `Thread` object.
* `parseComment()` — Returns a `Comment` object.
* Other functions are optional. See existing engines as an example.

In order to parse `Comment` objects from the API output, it must describe the [comment markup syntax](#comment-markup-syntax) specific to the engine. For example, if the engine uses HTML for comments content, the code must pass a list of [comment markup syntax](#comment-markup-syntax) definitions in the form of a `parseCommentContentPlugins` parameter to the `super()` constructor inside the class `constructor()`.

That was for the output of the API, but what about the input of the API? The input part is configured in a separate "engine settings" file at `./lib/engine/<engine-id>/settings.json` path. That file defines any default "settings" for the engine that the `imageboard` package could use, such as `attachmentUrl`, `attachmentThumbnailUrl`, etc. A given imageboard can replace any of those settings in its own `settings.json` file, if required.

In addition to defining the default parameters for the engine, the "engine settings" file describes the input of the engine's API under the `api` key: there, it describes how `imageboard` package input format should be translated into the engine's API input format.

The keys of an `api` definition object should be pre-defined API method names such as `getBoards` or `getBoardsPage`, `getThreads`, `getThread`, etc. See the `settings.json` files of the existing engines as an example, or refer to the `index.json` files of specific imageboards in the `./chans` folder. In general, each value of the `api` definition object should be an object with properties:

* `method` — The method of the HTTP request: `"GET"`, `"POST"`, etc.
* `url` — The URL of the HTTP request. Can contain "parameters" in curly braces.
* `urlParameters?: object[]` — If the `url` contains any "parameters", this should be a list of objects defining those "parameters":
  * `name: string` — The parameter name.
  * `input?: object` — Describes where to get the parameter value from.
  * `defaultValue?: string` — An optional default value for the parameter.
  * For the complete set of properties, see `ImageboardConfigApiMethod` type in `./types/ImageboardConfig.d.ts` file.
* `cookies?: object[]` — An optional array of cookie values to send as part of the HTTP request.
  * The structure is the same as for `urlParameters`.
* `parameters?: object[]` — For `GET` HTTP requests, these're URL query parameters. For `POST` HTTP requests, these're body parameters.
  * The structure is the same as for `urlParameters`.
* `requestType?: string` — HTTP request type. Default is `application/json`.
* `responseType?: string` — HTTP response type. Default is `application/json`.

## Comment markup syntax

Imageboard comments are originally formatted in HTML, so they're parsed into a tree structure using [`social-components-parser`](https://gitlab.com/catamphetamine/social-components-parser). Different imageboards use their own comment HTML syntax. For example, bold text could be `<strong>bold</strong>` at some imageboards, `<b>bold</b>` at other imageboards and `<span class="bold">bold</span>` at the other imageboards, even if they all used the same engine. Hence, every imageboard requires defining their own "comment markup syntax" in `./src/imageboard/engine/${engine}` directory.

"Comment markup syntax" is a list of "content element type" descriptors.

A "content element type" descriptor is an object having properties:

* `tag: String` — HTML tag (in lower case).
* `attributes: object[]?` — A set of HTML tag attribute filters. An attribute filter is an object of shape `{ name: String, value: String }`.
* `createElement(content: PostContent, node, options): PostContent?` — Receives child `content` and wraps it in a parent content element (see [Post Content](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md) docs). Can return `undefined`. Can return a string, an object or an array of strings or objects. `node` is the DOM `Node` and provides methods like `getAttribute(name: String)`. `options` is an object providing some configuration options like `commentUrl` template for parsing comment links (`<a href="/b/123#456">&gt;&gt;456</a>`).

Example:

```html
<strong>bold <span class="italic">text</span></strong>
```

Plugins:

```js
const parseBold = {
  tag: 'strong',
  createElement(content) {
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
  createElement(content) {
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