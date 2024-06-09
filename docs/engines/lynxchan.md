# `lynxchan` API

[`lynxchan`](https://gitgud.io/LynxChan/LynxChan) is an alternative engine Node.js/MongoDB whose development started in 2015. Rather than mimicking any existing engine, it set off on its own path and ended up becoming a popular choice (of its time) provided that there's really not much else to choose from. Some choices made by the author are questionable and the overall approach doesn't look professional to me. For example, the engine has a bunch of quite obvious but easily-fixable [issues](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/lynxchan-issues.md) that the author refuses to recognize and has no interest in fixing. The author's demeanor, in general, is somewhat controversial and not to everyone's liking.

The APIs provided by the engine are:

* [Read-only `GET` API](https://gitgud.io/LynxChan/LynxChan/-/blob/master/doc/Json.txt) that returns data in `JSON` format.

* [Read/write `GET`/`POST` API](https://gitgud.io/LynxChan/LynxChan/-/blob/master/doc/Form.txt).

This document describes a subset of its API that could be relevant for this library. Refer to the official documentation linked above for the latest and full info.

Or, refer to `lynxchan` [source codes](https://gitgud.io/LynxChan/LynxChan/-/tree/master/src/be/form) to get the full details on the API.

Also, there's `KohlNumbra` client [source code](https://gitgud.io/Tjark/KohlNumbra/-/blob/master/src/js/api.js) that could be used as a reference.

## Input format

`POST` methods accept [`FormData`](developer.mozilla.org/docs/Web/API/FormData/FormData) as an input and return a response in `JSON` format if `?json=1` URL parameter is passed (otherwise, they return a HTML response page).

## Output format

The read-only `GET` API uses a "free" output format.

The read/write `GET`/`POST` API uses the following JSON response format:

```js
{
  status: "status of the operation",
  data: anything or null
}
```

The `status` can be:

* `bypassable`: user has been prevented from posting but its possible for him to use the block bypass to post.
* `error`: internal server occurred. The error string will be on the data field.
* `ok`: operation successful.
* `maintenance`: site is going under maintenance.
* `banned`: user is banned. In this case, `data` will be an object with the following fields:
  * `reason`: the reason of the ban.
  * `board`: board that this ban applies to.
  * `expiration: Date`: when the ban expires.
  * `warning: boolean`: if the ban is actually a warning. Warnings are cleared once they are seen.
  * `asn: number`: asn banned. An "Autonomous System Number" perhaps?
  * `range`: IP address range that is banned?
  * `banId`: id of the ban.
  * `appealled: boolean`: indicates if the ban has been already appealed.
* `hashBan`: user tried to upload a banned file. In this case, `data` will be an array where each object contains the following fields:
  * `file`: name provided for the file.
  * `boardUri`: board uri of the hash ban. If an empty string, the file is banned globally.
  * `reason`: reason of the hash ban.

If `status: "banned"` is returned, then one may attempt to ["bypass"](#bypass-a-ban) the ban.

One may also refer to `KohlNumbra` client [source code](https://gitgud.io/Tjark/KohlNumbra/blob/master/static/js/api.js) for the list of possible errors.

## Read-only `GET` API

### File

```js
{
  // File name.
  originalName: "Maskensauffaden.jpg",

  // File URL.
  path: "/.media/cdc9ee93ff7a17c01c7edebb1d6dc095fd478365ca7088c1867872717029a644.jpg",

  // Picture thumbnail URL.
  thumb: "/.media/t_cdc9ee93ff7a17c01c7edebb1d6dc095fd478365ca7088c1867872717029a644",

  // File MIME type.
  mime: "image/jpeg",

  // File size (in bytes).
  size: 361180,

  // Picture width.
  width: 2287,

  // Picture height.
  height: 1286
}
```

### Post

```js
{
  // "Thread-wise" ID of the post author.
  id: null,

  // Post author name.
  name: "Bernd",

  // Post author email.
  email: null,

  // Post author role.
  signedRole: null,

  // (optional)
  // Flag ID.
  // Supposedly a lowercased country code prefixed with a dash.
  // It's not clear whether imageboards can assign their own custom `flagCode`s.
  // It's not clear if it's a reliable assumption that this is a proper country code
  // and can't be anything else.
  // I assume it can only be a valid country code.
  flagCode: "-br",

  // (optional)
  // Flag URL.
  flag: "/.static/flags/de.png",

  // (optional)
  // Flag name.
  flagName: "Deutschland",

  // Post ID.
  postId: 5024457,

  // Post title.
  subject: null,

  // Post content (in Markdown format).
  markdown: "<a class=\"quoteLink\" href=\"/b/res/5024427.html#5024442\">&gt;&gt;5024442</a>\nDas mag alles wahr sein, aber er gab guten KC-Trunkenbolden Zuflucht, und das wird auch der neue machen, und der nach ihm. Lasse doch alle gestört sein. Solange wir nicht zuviel von einer Seite sehen müssen, soll es doch sein, ne~",

  // Post content (in HTML format).
  message: ">>5024442\r\nDas mag alles wahr sein, aber er gab guten KC-Trunkenbolden Zuflucht, und das wird auch der neue machen, und der nach ihm. Lasse doch alle gestört sein. Solange wir nicht zuviel von einer Seite sehen müssen, soll es doch sein, ne~",

  // (optional)
  // If the author was banned for this post,
  // this is gonna be the reason for the ban.
  banMessage: "Test test test",

  // Post creation date, in "ISO 8601" date format.
  creation: "2021-05-16T00:53:19.504Z",

  // (optional)
  // The date of the last time the post was edited, in "ISO 8601" date format.
  lastEditTime: "2021-05-16T00:53:19.504Z",

  // (optional)
  // The login of the last user to edit this post.
  lastEditLogin: "admin",

  // Attachments.
  // (empty if no attachments)
  files: File[]
}
```

### Thread

```js
{
  // WebSocket port for listening to new comments.
  wsPort: 8443,

  // (optional)
  // Secure WebSocket port for listening to new comments.
  wssPort: 12345,

  // Board ID.
  boardUri: "b",

  // Thread ID.
  threadId: 5024427,

  // All properties of the "main" ("opening") post of this thread.
  // All properties of that `Post` object excluding `postId`.
  ...Post,

  // Is the thread archived.
  archived: false,

  // Is the thread locked.
  locked: false,

  // Is the thread sticky.
  pinned: false,

  // Is the thread "trimming".
  cyclic: false,

  // Is the thread "auto-sage".
  // "Auto-sage" threads never get bumped, even when someone leaves a comment.
  autoSage: false,

  // Thread comments.
  // (not including the main comment)
  posts: Post[]
}
```

### Get the list of threads on a board

`GET` `/{boardId}/catalog.json`

Returns a (brief) list of threads on a board, every thread object having a shape:

```js
{
  // Thread ID.
  threadId: 123,

  // Thread subject.
  subject: "...",

  // The main comment of the thread (in HTML format).
  message: "...",

  // The main comment of the thread (in Markdown format).
  markdown: "...",

  // How many replies are there in the thread:
  // the total comments count excluding the "main" comment.
  postCount: 0,

  // How many attachments are there in the replies in this thread:
  // the total attachments count excluding the attachments of the "main" comment.
  fileCount: 0,

  // Could be used for splitting the list of threads into pages.
  page: 1,

  // Whether the thread is locked.
  locked: false,

  // Whether the thread is sticky.
  pinned: false,

  // Whether the thread is "trimming".
  cyclic: false,

  // The URL of the thumbnail of the first image posted in the thread, if any.
  thumb: "/...",

  // The MIME type of the `thumb` file.
  mime: "image/jpeg",

  // The latest comment date, in "ISO 8601" date format.
  lastBump: "2021-05-16T00:53:19.504Z",

  // Is the thread "auto-sage".
  // "Auto-sage" threads never get bumped, even when someone leaves a comment.
  autoSage: false
}
```

There's a bug in `lynxchan` engine when there're no `files` on each thread object in the `catalog.json` response. `kohlchan.net` has fixed that bug by patching the code: they include the `files` property on each thread object in the `catalog.json` response.

### Get the list of threads on a board (page)

`GET` `/{boardId}/{pageNumber}.json`

Response:

```js
{
  pageCount: 20,

  // Board name.
  boardName: "KAHANECHECK",

  // Board description.
  boardDescription: ".",

  // Board settings.
  settings: [
    "disableIds",
    "forceAnonymity"
  ],

  // Maximum comment length.
  maxMessageLength: 16384,

  // Maximum attachments count in a post.
  maxFileCount: 4,

  // The maximum attachment size (of an individual file).
  maxFileSize: "100.00 MB",

  // Indicates the captcha mode for the board.
  // 0 means no captcha,
  // 1 means only for new threads,
  // 2 means for all posts on the board.
  captchaMode: 0,

  // Indicates if the site has global captcha turned on.
  globalCaptcha: true/false,

  // Indicates whether solving a CAPTCHA is required for reporting.
  noReportCaptcha: true/false,

  // Available report categories.
  reportCategories: ["spam"],

  // (optional)
  // Board "flags" (badges).
  flagData: [{
    // ID of the flag.
    _id: 123,
    // Name of the flag.
    name: "Name"
  }, ...],

  threads: Thread[]
}
```

Each thread has a `.posts[]` property. The first `Post` is the "main comment" of the thread, the rest `Post`s are the "latest comments" in the thread.

Also, each thread has `omittedPosts: number` property (that was incorrectly named `ommitedPosts` before version `2.7.0`) — it's the count of all "omitted" comments: that would be all comments in a thread excluding the "main" comment and excluding the "latest comments" that're listed in the `posts[]` list.

Also, each thread may have an [`omittedFiles: number?`](https://gitgud.io/LynxChan/LynxChan/-/issues/53) property (that has been added in version `2.7.0`) — it's the count of all "omitted" attachments: that would be count of all attachments in all comments in a thread excluding the "main" comment and excluding the "latest comments" that're listed in the `posts[]` list. The `omittedFiles` property doesn't seem to be present when it's `0`.

### Get thread

`GET` `/{boardId}/res/{threadId}.json`

Returns a `Thread` object, with the addition of the following properties:

* `boardName`: Board name. Example: `"KAHANECHECK"`.
* `boardDescription` — Board description. Example: `"."`.
* `boardMarkdown` — Board description in markdown format. Example `null`.
* `maxMessageLength` — Max comment length. Example: `16384`.
* `usesCustomCss` — Whether the board uses custom CSS. Example: `false`.
* `usesCustomJs` — Whether the board uses custom JS. Example: `false`.
* `maxFileCount` — Maximum attachments count in a post. Example: `4`.
* `maxFileSize` — The maximum attachment size (of an individual file). Example: `"100.00 MB"`.
* `forceAnonymity` — Is `true` if there's no "Author Name" or "Author Email" inputs on this board.
* `captcha: boolean` — Is `true` if posting a comment in the thread requires solving a CAPTCHA.
* `textBoard: boolean` — Is `true` if the board is a "text" board (no attachments).

## Read/write `GET`/`POST` API

### CAPTCHA

Some actions like posting new threads, posting new comments, reporting posts, banning users, etc require solving a CAPTCHA in order to prevent spam.

#### Get CAPTCHA image

To request a CAPTCHA image, send a `GET` request to `/captcha.js`.

<!-- The response is an HTTP status `302` redirect to a new `Location` URL (a CAPTCHA challege image). Get that URL. -->

<!-- The URL has the format: `/.global/captchas/{captchaId}`, and CAPTCHA challenge ID can be extracted from it. Example of `{captchaId}`: `6091c3b9bce7b946ae3c9539`. -->

It responds with a `302 Redirect` to the CAPTCHA image URL.

Also it sets two cookies:

* `captchaid` — The CAPTCHA challenge ID. Example cookie parameters: `Path: /` and `Max-Age: 300` meaning that the captcha expires in 300 seconds if not solved.

* `captchaexpiration` — The CAPTCHA challenge expiration date. A stringified javascript date (`new Date().toUTCString()`). Example: `"Tue, 04 May 2021 22:16:58 GMT"`. Can be converted back to a `Date` object by passing this string as an argument to the `Date()` constructor.

#### Get CAPTCHA

`GET` `/noCookieCaptcha.js?json=1`

Parameters:

* `d` — (optional) The current timestamp. If the user has already requested a captcha with that `d` parameter

URL Parameters:

* `solvedCaptcha` — (optional) If the user has already solved a CAPTCHA before, specify the already solved CAPTCHA challenge ID here. Presumably, the server will determine whether a new CAPTCHA is required to be solved (for example, if the already-solved one has expired), or the user can post without solving a new CAPTCHA for now. The official docs don't explain the meaning of this parameter.

<!-- Maybe it could somehow be used a workaround for captcha expiration time not present in the response. But if the CAPTCHA has arleady expired and the user hasn't submitted a solution for it yet, the application wouldn't be able to know if it should already show a new CAPTCHA or not. -->

Returns a CAPTCHA challenge ID:

```js
{
  status: "ok",
  data: "60a05555ea4467737e851ebb"
}
```

The CAPTCHA challenge image URL is `/.global/captchas/{captchaId}`.

LynxChan engine has a bug: the received CAPTCHA challenge has a timeout and you won't be able to find it out because it's not present in the JSON response. Every CAPTCHA usually has a different expiration interval, for some reason.

A workaround for that bug would be using the regular — "with cookies" — variant of "Get CAPTCHA" API and then parse the expiration time from `set-cookie` headers.

#### Solve a CAPTCHA

To solve the received CAPTCHA challenge, `POST` to `/solveCaptcha.js?json=1`.

Parameters:

* `captchaId` — The ID of the CAPTCHA challenge. Example: `"60a05555ea4467737e851ebb"`.
* `answer` — CAPTCHA challenge solution.

The solved CAPTCHA ID is then required to be sent on all relevant `POST` actions, such as posting a comment, posting a thread, banning a user, reporting a post, etc.

### Posting Attachments

`lynxchan` de-duplicates the same files being posted across the imageboard, so for each file being uploaded one should first check whether the file has already been uploaded by someone else.

#### Check if the file has already been uploaded

`GET` `/checkFileIdentifier.js?json=1`

Parameters:

* `identifier` — A [SHA256](https://medium.com/@0xVaccaro/hashing-big-file-with-filereader-js-e0a5c898fc98) hash of the file contents.

Returns `true` if the file already exists: in such case, there's no need to upload the file to the server.

#### Adding attachments to post data

Post data is sent to the server in `FormData` format. `FormData` supports adding a parameter with the same name multiple times, in which case it doesn't overwrite the previously added value but instead preserves all added values of the parameter. For every attachment, the following parameters should be added to `FormData`:

* `fileSha256` — A SHA256 hash of the file, computed at the previous step. This is used to ID files by their content, which allows admins to block certain files from being posted on an imageboard, and it also de-duplicates the same file being posted across the imageboard.
* `fileMime` — The [MIME type](developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the file.
* `fileSpoiler` — Pass any non-empty string to indicate that the file should be hidden under a "spoiler". Pass an empty string otherwise.
* `fileName` — The file name.

The parameters listed above should be added for each file. Then, for all files that haven't been uploaded to the imageboard server yet, add them to the `files: File[]` parameter of the `FormData`. After that, the `FormData` can be posted to the server.

### Report a post

`POST` to `/contentActions.js?json=1`

Parameters:

* `action`: Action to be performed. `report`.
* `categoryReport`: Category of the report.
* `reasonReport`: Report reason.
* `globalReport`: if a non-empty string, indicates that the report is "global".
* `captchaReport`: Solved CAPTCHA ID?

### Delete or restore a post or a thread

`POST` to `/contentActions.js?json=1`

Parameters:

* `action`: action to be performed. `delete`, `trash`, `restore`, `ip-deletion`, `thread-ip-deletion`.
* `password`: password to be used for deletion.
* `deleteUploads`: if a non-empty string, only the uploads and not the posts and threads will be deleted.
* `deleteMedia`: if a non-empty string and the user is part of the global staff, when deleting files or postings, the actual media files will be removed from the server.
* `confirmation`: must be a non-empty string when using `ip-deletion` as the action.

When using "regular deletion" (what?), outputs an object with the following fields:

* `removedThreads: number`: amount of deleted threads.
* `removedPosts: number`: amount of deleted posts.

### Delete all posts and threads by a poster IP address

Deletes posts and threads from an IP address from multiple boards. Reserved for users with an role equal or lower than the global setting `clearIpMinRole`.

`POST` to `/deleteFromIp.js?json=1`

Parameters:

`ip` — the IP address.
`boards` — the IDs of the boards to have posts deleted. If not specified, the posts from the IP address will be deleted from all boards.

### Add a spoiler to post attachments

`POST` to `/contentActions.js?json=1`

Parameters:

* `action`: action to be performed. `spoil`.
* `password`: password to be used (maybe not relevant here).

### Get the list of boards

`GET` `/boards.js?json=1`

URL Parameters:

* `unindexed`: If anything is passed, displays only unindexed boards.
* `inactive`: If anything is passed, displays only inactive boards.
* `sfw`: If anything is passed, displays only sfw boards.
* `page`: The page to be viewed.
* `boardUri`: Board ID.
* `tags`: (optional) Tags to be searched for. Only boards having all of the specified tags will be returned. Example: `["tagName"]`.
* `sorting`: sorting to be used:
  * `1`: from least popular to most popular.
  * `2`: from most posts to least posts.
  * `3`: from least posts to most posts.
  * `4`: from highest PPH to lowest PPH.
  * `5`: from lowest PPH to highest PPH.
  * `6`: alphabetic order.
  * `7`: reverse alphabetic order.
  * Anything else sorts them from most popular to least popular.

Response:

```js
{
  // Can possibly be an error (like "maintenance").
  // See the POST API response format for more info.
  status: "ok",

  data: {
    // Results pages count.
    // If more than `1`, then the full list of the boards
    // can be retrieved by iterating through all avialable page numbers
    // by passing the `page` parameter of the "get boards list" API.
    pageCount: 1,

    // (optional)
    // An "overboard" is a board showing all threads
    // from all other boards.
    // It can be used to view all threads on an imageboard,
    // like viewing all the latest comments on an imageboard.
    overboard: "alle",

    // (optional)
    // A "safe-for-work" portion of the "overboard" board.
    sfwOverboard: "nvip",

    // The list of boards.
    boards: [{
      // Board ID.
      boardUri: "int",

      // Board name.
      boardName: "International",

      // Board description.
      boardDescription: ".",

      // Latest post ID.
      lastPostId: 11797395,

      // "Posts per hour" metric of the board.
      postsPerHour: 769,

      // (optional)
      // How many unique IP addresses posted on the board in the last 24 hours.
      uniqueIps: 12345,

      // A list of board "tags".
      // Can be an empty array.
      tags: [
        "menu-1/u/vip-2"
      ],

      // (optional)
      specialSettings: [
        // Indicates that the board is "safe for work".
        "sfw",

        // Indicates that the board is locked.
        "locked"
      ],

      // (optional)
      // Indicates the board has been marked inactive
      // due to its owner not logging in for too long.
      // I guess this property doesn't really have any meaning and could be ignored.
      inactive: false
    }, ...]
  }
}
```

### Create Board

`POST` to `/createBoard.js?json=1`

Parameters:

* `boardUri`: URI of the new board. 32 characters, lower case and numbers only.
* `boardName`: name of the new board. 32 characters.
* `boardDescription`: description of the new board. 128 characters.
* `captcha`: CAPTCHA solution.

### Delete Board

`POST` to `/deleteBoard.js?json=1`

Parameters:

* `boardUri`: URI of the board to be deleted.
* `confirmDeletion: boolean`: confirmation that the board should be deleted.

Allowed for board owners and users with global role lower than 2.

### Sign Up

Creates a new account.

`POST` to `/registerAccount.js?json=1`

Parameters:

`login`: 16 characters max. Only `a-Z`,`_` and `0-9` are allowed.
`password`
`email`: 64 characters max.
`captcha`: Solved CAPTCHA ID?

### Request Email Confirmation

Requests a confirmation e-mail to be sent to the user's registered e-mail. Requires authentication.

`POST` to `/requestEmailConfirmation.js?json=1`

### Confirm Email Address

`POST` to `/confirmEmail.js?json=1`

Parameters:

* `login`
* `hash` — The token that was sent in the confirmation email.

### Log In

`POST` to `/login.js?json=1`

Parameters:

* `login`
* `password`
* `remember: boolean`: if `true`, the session expiration time will be longer.

Presumably, the result is setting some cookie. Didn't check.

### Log Out

`POST` to `/logout.js?json=1`

Logs the user out invalidating their authentication cookies.

### Request Account Recovery

`POST` to `/requestAccountRecovery.js?json=1`

Parameters:

* `login`
* `captcha`: CAPTCHA solution.

Sends an e-mail to the user with a link so they can recover their account.

### Recover Account

`GET` `/recoverAccount.js?json=1`

URL parameters (because this link is clicked by the user in an account recovery email):

* `login`
* `hash`: hash of the recovery request.

Creates a new random password and e-mails it to the user.

### Create Comment

`POST` to `/replyThread.js?json=1`

Parameters:

* `noFlag`: (optional) if the board has `locationFlagMode` as `1`, and a non-empty string is passed, then it won't show the user's location flag on the comment.
* `name`: (optional) name of the poster. 32 characters.
* `email`: (optional) e-mail of the poster. 64 characters.
* `message`: (optional) message to be posted. 4096 characters. Mandatory if no files are sent.
* `subject`: (optional) subject of the thread. 128 characters.
* `password`: (optional) random autogenerated password to be used for deletion. 8 characters.
* `boardUri`: Board ID.
* `threadId`: Thread ID
* `captcha`: (optional) Solved CAPTCHA ID?
* `spoiler`: (optional) if anything is sent, indicates the images should be spoilered.
* `flag`: (optional) id of a flag to be used.

Returns: the ID of the new post (a number).

```js
{
  "status": "ok",
  "data": 123456
}
```

When posting any attachments, first [check](#check-an-attachment-before-upload) every attachment on whether it has already been uploaded to the server and whether it's banned.

One may also refer to `KohlNumbra` client [source code](https://gitgud.io/Tjark/KohlNumbra/-/blob/master/src/js/thread.js) for an implementation of posting a comment.

### Create Thread

`POST` to `/newThread.js?json=1`

Parameters are the same as for posting a new comment, only that `threadId` is omitted and `message` is required.

Returns the ID of the new thread (a number).

### Change thread settings

Performs general control actions on a thread, like locking and pinning.

`POST` to `/changeThreadSettings.js?json=1`

Parameters:

* `boardUri` — Board ID.
* `threadId` — Thread ID.
* `lock`: indicates if the thread must be locked. Any value sent will lock, if not sent, will unlock.
* `pin`: indicates if the thread must be pinned. Any value will pin, if not sent, will unpin.
* `cyclic`: indicates if the thread must be set on cyclic mode. Any value will put in cyclic mode. If not sent, will remove cyclic mode.

### Edit a post

Restricted to global staff and board staff.

`POST` to `/saveEdit.js?json=1`

Parameters:

* `boardUri`: URI of the board.
* `threadId`: id of the thread.
* `postId`: id of the post to be edited.
* `subject`: new subject. 128 characters max.
* `message`: new message.

### Archive a thread

Adds a thread to the archives. Requires authentication.

`POST` to `/archiveThread.js?json=1`

Parameters:

* `boardUri` — Board ID.
* `threadId: number` — Thread ID.
* `confirmation: boolean` — Confirmation of the action.

### Show threads archive

`GET` `/archives.js?json=1`

URL Parameters:

* `boards` — The list of board IDs.
* `page` — (optional) Page number (in case of iterating through several pages).

Response example:

```js
{
  status: "ok",
  data: {
    threads: [
      {
        boardUri: "mu",
        threadId: 764,
        creation: "2019-08-01T22:20:52.375Z",
        subject: "Musikabladefaden",
        message: "Temporäres Lager für gewünschtes Liedgut."
      },
      ...
    ],

    // Results pages count.
    // If more than `1`, then the full list of the boards
    // can be retrieved by iterating through all avialable page numbers
    // by passing the `page` parameter of the "get boards list" API.
    pages: 1
  }
}
```

### Bans

Bans can be:

* Range bans — bans a range of IP addresses.
* ASN bans — bans a whole ["Autonomous System"](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)) by its ["Autonomous System Number"](https://afrinic.net/asn).
* Hash bans — bans a file by its [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash.

Bans, unless marked as "non-bypassable", can be "bypassed" by solving a "computationally intensive" challenge (a "Proof-of-Work" mechanism):

> In addition to CAPTCHA, proof of work is required to activate the block bypass.

> It is recommended to use a modern browser like Mozilla Firefox or Google Chrome. For Tor Browser you have to use the standard security level and manually set javascript.options.wasm in about:config to true.

> Once you are finished, you will receive a link to gain access to your session in case you should ever lose your cookies. It will expire after one week of inactivity (i.e. no posting) and you will be asked to solve a single CAPTCHA regularly.

> How to solve this without your browser:

> Use this [Python script](https://gitgud.io/kohlchan-dev/kohlcash-solver/raw/master/solver.py) to activate the block bypass without JavaScript/WebAssembly.

> You will be asked to enter a value:
JGFyZ29uMmQkdj0xOSRtPTIwMDAwMCx0PTEscD0xJGNHS3llbEdwd0dFbldIMHdLZVRVTVEkQnNtdUlEbmEzYWdTbW9tQWVwZDJOMW9HRFZRNEQyOXlBdmpyUVZUdTB5dywyMDAwMDA=

> After the Python script finishes, enter the solution in the `<input/>` field below.

> Then click "Submit".

### Ban a user

`POST` to `/contentActions.js?json=1`

Parameters:

* `action`: the action to be performed. Possible values: `ban` (ban the user), `ban-delete` (ban the user and also delete their comments).
* `reasonBan`: reason of the ban.
* `banMessage`: message to be displayed in the banned content.
* `banType`: type of ban. `0` bans only the IPs of the selected posts and requires a valid expiration. `1` creates range bans off the first half of the IPs and `2` creates range bans off the first `3/4` of the IPs. `3` creates an ASN (Autonomous System Number) ban.
* `globalBan`: if any value is passed, indicates the bans are "global".
* `nonBypassable`: if a non-empty string, "broad bans" (what?) applied as part of this action will not be able to be "bypassable".
* `deleteMedia`: if a non-empty string and the user is part of the global staff, when deleting files or postings, the actual media files will be removed from the server.
* `deleteUploads`: if a non-empty string, only the uploads and not the posts and threads will be deleted.
* `duration`: duration of the ban. See the "Ban Duration" section for the format description. Defaults to 5 years.
* `captchaBan`: CAPTCHA solution. Ignored for bans when the user is part of the global staff.

### Ban duration

The syntax for setting ban durations uses the following fields:

* `y`: year
* `M`: month
* `d`: day
* `h`: hour
* `m`: minute

So if you write `"2d 1h"` it will create a 49 hour ban. The order and spacing doesn't matter. The same could be written as `"1h 2d"`.

### Unban a user

`POST` to `/liftBan.js?json=1`

Parameters:

* `banId`: id of the ban.

#### Show the list of bans

Shows the "offense record" for a given user (requires authentication? or not?).

`POST` to `/offenseRecord.js?json=1`

Parameters:

* `banId`: id of a ban to search all offenses from the same author.
* `boardUri`: uri of the board to check a posting's ip and bypass offense record.
* `postId`: postId of the posting to check the ip's and bypass' offense record.
* `threadId`: threadId of the posting to check the ip's and bypass' offense record.
* `ip`: ip to check it's offense record.

Returns an array with the offense records found. Contains objects with the following fields:

* `reason`: reason of the action.
* `global: boolean`: `true` if the action was global.
* `date: date`: date of the action taken.
* `expiration: date`: expiration of the action taken.
* `mod: string`: login of the user that took the action.

### Block Bypass

A user may use a "block bypass" feature in order to attempt to bypass a "bypassable" ban. "Block bypass" won't work for "non-bypassable" bans.

The procedure of bypassing a "bypassable" ban is:

* Try to post.
* If `{ status: "bypassable" }` response is returned:
  * Use the "block bypass" feature: solve a CAPTCHA and provide a Proof-of-Work.
* If `error: "banned"` is returned:
  * If `bypass` cookies was passed:
    * Check the "block bypass" status using "Get Block Bypass" API:
      * Examine `response.data`
        * If `valid` is `true` then it means that the ban is "non-bypassable". Won't be able to post (at least on that board).
        * If `valid` is `false`:
          * If `mode` is `0`, then can't use a "block bypass" mechanism. Won't be able to post (at least on that board).
          * If `mode` is not `0`, then attempt to "renew a bypass" (receive a new `bypass` cookie) using "Create Block Bypass" API:
            * Request a CAPTCHA challenge.
            * Post the CAPTCHA challenge solution to the "Renew bypass" API. Check that the response is `status: "ok"`.
            * Re-check "block bypass" status (with the new `bypass` cookie being set) using "Get Block Bypass" API:
              * Examine `response.data`
                * If it's still not `valid` then that would be weird. Won't be able to post (at least on that board).
                * If it's now `valid` then:
                  * If `validated` is not `false` then try to post.
                  * If `validated` is `false` then "validate" the "bypass" using the "Validate Block Bypass" API:
                    * Provide a Proof-of-Work as the `code` parameter when calling that API.
                    * Examine the `response`
                      * If `status: "ok"`, then re-check "block bypass" status.
                      * Otherwise, the Proof-of-Work might be incorrect.

### Get Block Bypass

`GET` `/blockBypass.js?json=1`

Requires a `bypass` cookie that holds a "block bypass" ID.

Responds with an object with information about the current "block bypass" status. Contains the following fields:

* `valid: boolean`: indicates if the user has a valid "block bypass".
* `validated: boolean`: indicates if the bypass needs Proof-of-Work validation. A Proof-of-Work expires: maybe after a certain amount of time, or maybe after a certain amount of content has been posted by the user. So users will have to periodically re-do their Proof-of-Work.
* `mode: number`: current "block bypass" mode.
  * `0` — disabled. The user can't use a "block bypass" mechanism.
  * `1` — enabled. The user can use a "block bypass" mechanism if required.
  * `2` — mandatory. The user must use a "block bypass" mechanism in order to post.

Response example:

```js
{
  status: "ok",
  data: {
    valid: false,
    mode: 1
  }
}
```

### Create Block Bypass

Allows the user to renew their "block bypass". "Renew" means "receive a new one", i.e. "create".

Random note: "Bypasses longer than 372 characters" (presumably, that's the total character count posted using a "bypass") require "validation", see ["Validate Block Bypass"](#validate-block-bypass).

First, request a new CAPTCHA using "Get CAPTCHA" API.

Then `POST` to `/renewBypass.js?json=1`

Parameters:

* `captcha` — CAPTCHA solution.

Request Cookies:

* `captchaid` — CAPTCHA ID.

Result:

Sets a `bypass` cookie holding the new "block bypass" ID.

On `kohlchan.net`, it responds with `{ data: null, status: "hashcash" }` JSON which tells that an additional step is required in order to be able to post on the imageboard: it requires "activating" a bypass by performing a ["proof of work"](https://kohlchan.net/addon.js/hashcash/?action=get) calculation.

### Validate Block Bypass

Validates a "block bypass" by performing a Proof-of-Work procedure.

`POST` to `/validateBypass.js?json=1`

Parameters:

* `code` — The brute forced code. To find this code follow this logic:

  * Get the `bypass` cookie value, ignore the first `24` characters.
  * Take the following `344` characters as the base string and the next `344` characters as the resulted hash.
  * Now try numbers starting from `0` as the salt through `PBKDF2` with `SHA512`, `16384` iterations and `256` derived bytes (not bits).
  * When you find a derivation that matches the resulted hash, submit that number as the code.
  * Submitting the wrong code will result in the deletion of the bypass.