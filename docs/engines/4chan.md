# `4chan.org` API

## Definitions

### Post

Contains both the comment and the attachment file info.

```js
{
	// Post ID.
	"no": 184187118,

	// Post creation date (Unix timestamp; in seconds).
	"time": 1549182611,

	// Post creation date (in milliseconds).
	// Same as `time` but in milliseconds rather than seconds.
	//
	// For some weird reason, sometimes `time` is present and `tim` is not,
	// so prefer using `time` instead of `tim`. A real-world example:
	//
	// {
	//   "no": 21654916,
	//   "now": "05/30/23(Tue)01:40:17",
	//   "name": "Anonymous",
	//   "com": "<a href=\"#p21652742\" class=\"quotelink\">&gt;&gt;21652742</a><br>Do you have more of this beauty?",
	//   "time": 1685425217,
	//   "resto": 21652051
	// }
	//
	"tim": 1549182611000,

	// Post creation date (text).
	"now": "02/03/19(Sun)03:30:11",

	// (optional)
	"name": "Anonymous", // Poster name. They say it can theoretically be blank.

	// (optional)
	// A "tripcode".
	// (some weird cryptographic username having format "!tripcode!!securetripcode").
	"trip": "!Ep8pui8Vw2",

	// (optional)
	// "Capcodes" are set for "priviliged" posters (admins, moderators, etc).
	// See the "Roles" section.
	"capcode": "admin",

	// (optional)
	// Poster IP hash.
	// Is used to identify posters on some boards like `/pol/`.
	"id": "Bg9BS7Xl",

	// (optional)
	// ISO 3166-1 alpha-2 country code. Can be used on "international" boards.
	"country": "RU",

	// (optional)
	// Country name. Can be used on "international" boards.
	"country_name": "Russia",

	// (optional)
	// Board-specific flag ID. For example, `/pol/` has "political preferences" flags.
	"board_flag": "CM",

	// (optional)
	// Board-specific flag name. For example, `/pol/` has "political preferences" flags.
	"flag_name": "Communist",

	// Thread ID. Is always `0` for the "opening post" of the thread.
	"resto": 0,

	// (optional)
	// Comment HTML code.
	// Will be missing if the comment is empty.
	// (for example, in case of an attachment-only comment)
	"com": "Kitaro is framed, McNanashi stops by.<br><br>Discuss.",

	// (optional)
	// The year when 4chan "pass" was bought.
	// I guess this is some kind of an "achievement"
	// to differentiate "newfags" from "oldfags",
	// and the earlier the year the more "oldfag".
	"since4pass": 2016,

	// (optional)
	// Includes all properties of `Attachment` (if any).
}
```

### Attachment

Can be a picture (`.jpeg`, `.png`), an animated `.gif`, a `.webm` video (seems that the sound is always muted).

On the `/f/` board the OP files are always `.swf` ones, and there're no thumbnails for attachments: `tn_w === 0`, `tn_h === 0`.

They say it can also be `.pdf` (most likely with no thumbnail then: `tn_w === 0`, `tn_h === 0`).

Thumbnail extension is always `.jpg`. Thumbnail max size is `250px` for the main post of a thread and `125px` for all other posts.

If `m_img` is `1` then there's also a middle-sized image with max-width/max-height of `1024px`.

```js
{
	"filename": "Hot-girls", // Attachment file name.
	"ext": ".jpg", // Attachment file extension.
	"w": 1280, // Attachment width.
	"h": 720, // Attachment height.
	"tn_w": 250, // Attachment thumbnail width.
	"tn_h": 140, // Attachment thumbnail height.
	"tim": 1549182611230, // Attachment file name on server (UNIX timestamp + milliseconds).
	"fsize": 201912, // Attachment file size.
	"md5": "knN3NBdljasl085ylrpzfQ==", // Attachment file MD5 (24 character, packed base64 MD5 hash).

	// (optional)
	// Will be `1` if the attachment file was deleted.
	// Seems that if `filedeleted` is `1` then all other
	// attachment-related properties will be absent.
	"filedeleted": 1,

	// (optional)
	// If `1` then it means that the attachment should be
	// covered with a spoiler image.
	"spoiler": 1,

	// (optional)
	// `4chan.org` generates smaller copies of images (limited to 1024x1024)
	// for images having both width and height greater than 1024px.
	// These images are in the same location as usual but the filename ends with "m".
	// `m_img` parameter indicates that this smaller image is available.
	"m_img": 1
}
```

### Thread

Consists of the "opening post" (thread ID is the "opening post" ID) and some thread-specific properties.

```js
{
	// Includes all properties of `Post`.

	// (optional)
	// Comment subject.
	// Some boards (like `/b/`) have no subjects on threads at all.
	"sub": "Gegege no Kitaro",

	// Thread comments count.
	"replies": 24,

	// Thread comments attachments count.
	// This is the count of all attachments in the thread
	// except for the main post attachments.
	// https://github.com/vichan-devel/vichan/issues/327#issuecomment-475165783
	"images": 20,

	// `1` if the "bumplimit" is reached.
	// "Bump limit" (max comments count) is a board-wide setting.
	"bumplimit": 0,

	// `1` if the attached images limit is reached.
	// Image limit (max attachments count) is a board-wide setting.
	"imagelimit": 0,

	"semantic_url": "gegege-no-kitaro", // Whatever that is.

	// (optional)
	// At `4chan.org` each board can have a list of "custom spoilers" for attachments.
	// `custom_spoiler` is a number, and if it's `5`, for example, then it means that
	// the board has five custom spoilers defined: from `1` to `5`.
	// One can then choose any one of the available custom spoiler ids.
	// Custom spoiler URLs are: https://s.4cdn.org/image/spoiler-{boardId}{customSpoilerId}.png
	// Every time a new post is added to a thread the chosen custom spoiler id is rotated.
	"custom_spoiler": 1,

	// (optional)
	// `1` if the thread "sticky" (pinned).
	"sticky": 1,

	// (optional)
	// `1` if the thread is locked.
	"closed": 1,

	// (optional)
	// `1` if the thread is "archived" (has been moved to board "archive").
	// On imageboards, threads "expire" due to being pushed off the
	// last page of a board because there haven't been new replies.
	// On some boards, such "expired" threads are moved into an "archive"
	// rather than just being deleted immediately.
	// Eventually, a thread is deleted from the archive too.
	// Not all boards have archival feature enabled.
	// https://github.com/4chan/4chan-API/blob/master/pages/Archive.md
	"archived": 1,

	// (optional)
	// The date when the thread was "archived" (Unix time).
	// I assume it's in UTC+0 timezone.
	"archived_on": 1344571233,

	// (optional)
	// Can only be present on the `/f/` board.
	// I guess it describes the attached `.swf` file there.
	"tag": "Other",

	// (optional)
	// If a priviliged user (admin, moderator, etc) replies
	// in the thread then this object will contain the respective post IDs.
	"capcode_replies": {"admin":[1234,1267]},

	// (only for `catalog.json` API)
	// This is how many posts are there in the thread
	// minus `last_replies.length` minus `1` for the main post.
	"omitted_posts": 19,

	// (only for `catalog.json` API)
	// This is how many attachments are there in the thread
	// minus the attachments count in both `last_replies` and the main post.
	"omitted_images": 15,

	// (only for `catalog.json` API)
	// "Last modified" date (Unix time).
	// Includes replies, deletions, and sticky/closed status changes.
	"last_modified": 1549184316,

	// (optional)
	// (only for `catalog.json` API)
	// A random number of last replies in the thread.
	// Can be anything from zero to five on `4chan.org`.
	// For example, if there're 3 posts total in a thread
	// (the first being the main post and the two other being "comments")
	// then `last_replies` can contain just the last post (no logic).
	// Will be absent if there're no replies.
	"last_replies": Post[],

	// (only for `/thread/THREAD-ID.json` API response)
	// Unique poster IPs count.
	"unique_ips": 44,

	// (only for `/thread/THREAD-ID.json` API response)
	// Ignore this property. See the "Auto-refresh" section for more info on "tail" API.
	"tail_size": 50,
}
```

### Board

```js
{
	// Board URL ID.
	"board": "3",

	// Board name.
	"title": "3DCG",

	// Is the board "Safe for Work" (doesn't contain any "explicit" content).
	"ws_board": 1,

	// Threads per page.
	"per_page": 15,

	// Max thread pages.
	"pages": 10,

	// Max comment attachment size.
	"max_filesize": 4194304,

	// Max comment `.webm` attachment size.
	"max_webm_filesize": 3145728,

	// Max comment `.webm` attachment duration.
	"max_webm_duration": 120,

	// Max comment length.
	"max_comment_chars": 2000,

	// The "bump limit" for threads on the board.
	// (How much comments max will "bump" the thread,
	//  i.e. how much comments max will move to the top of the threads list)
	"bump_limit": 310,

	// The maximum number of attachments allowed in the comments of the thread.
	"image_limit": 150,

	"cooldowns": {
		// Cooldown for creating a thread.
		// A user won't be able to create a new thread until the cooldown passes.
		"threads": 600,

		// Cooldown for leaving a reply in a thread.
		"replies": 60,

		// Perhaps a cooldown for attaching an image to a comment in a thread.
		// I guess it can be ignored if it's the same as the `replies` cooldown.
		"images": 60
	},

	// Board description.
	"meta_description": "&quot;/3/ - 3DCG&quot; is 4chan's board for 3D modeling and imagery.",

	// Is `1` if threads on this board are "archived" for some time period
	// (usually 3 days) before eventually being deleted.
	"is_archived": 1,

	// (optional)
	// Whether the board uses "spoilers" for attachments.
	"spoilers": 1,

	// (optional)
	// The amount of "custom spoilers" used for attachments on the board.
	// If present, then is always greater than `0`.
	// Every time a new thread is started it gets assigned a random spoiler ID
	// and then all comments in such thread having attachments will have
	// the spoiler with the assigned spoiler ID.
	// So, in a given thread all attachments have the same spoiler image
	// but on a given board different threads have different spoiler images.
	"custom_spoilers": 2,

	// (optional)
	// Is `1` if the author name for every comment is forced to be "Anonymous".
	"forced_anon": 1,

	// (optional)
	// Is `1` if the board shows comment poster IDs as "(ID: /6oj2yjC)"
	// in the comment header.
	"user_ids": 1,

	// (optional)
	// Is `1` if the board shows comment poster country flags.
	// For example, country flags are enabled on "international" boards: /bant/, /pol/.
	"country_flags": 1,

	// (optional)
	// Array of board-specific flag codes mapped to flag names.
	"board_flags": {
		"BL": "Black Nationalist",
		"CM": "Communist",
		...
	},

	// (optional)
	// Can be used for requiring "high-res" images.
	// For example, is used on `/hr/` "High Resolution" board.
	"min_image_width": 480,

	// (optional)
	// Can be used for requiring "high-res" images.
	// For example, is used on `/hr/` "High Resolution" board.
	"min_image_height": 600,

	// (optional)
	// Is `1` if uploaded `.webm` videos aren't being muted on this board.
	// By default uploaded `.webm` videos are muted in order to avoid "screamers".
	"webm_audio": 1,

	// (optional)
	// Whether "Shift JIS" ("ASCII art") tags are enabled on this board.
	"sjis_tags": 1,

	// (optional)
	// Whether this board supports posting "oekaki" drawings
	// via the "oekaki" drawing widget.
	"oekaki": 1,

	// (optional)
	// If `1` then replies in threads on this board can't have attachments.
	// "Main" ("opening") posts of threads can have attachments but aren't forced to:
	// when creating a new thread, the poster can choose whether to attach a picture or not.
	//
	// For example, `/news/` board has this setting:
	//
	// "Please note that although /news/ is a text board,
	//  the thread creator is permitted to upload an image to the original post.
	//  All replies to the thread, however, are to be strictly text only."
	//
	"text_only": 1
}
```

## Syntax

Message HTML syntax is:

* `<strong>...</strong>` — bold text.
* `<b>...</b>` — bold text (legacy).
* `<em>...</em>` — italic text.
* `<i>...</i>` — italic text (legacy).
* `<u>...</u>` — underlined text.
* `<s>...</s>` — spoiler text.
* `<span class="sjis">...</span>` — ["ShiftJIS art"](https://en.wikipedia.org/wiki/Shift_JIS) (for example, is enabled on `/jp/` board). Should use a "ShiftJIS"-compatible font like ["Mona"](https://en.wikipedia.org/wiki/Mona_Font) or "MS PGothic". Should preserve sequences of white space. Lines should be broken at newline characters (or to prevent overflow).
* `<pre class="prettyprint">...</pre>` — code (for example, is enabled on `/g/` board).
* `[math]...[/math]` — inline math (for example, is enabled on `/sci/` board).
* `[eq]...[/eq]` — block-level math (for example, is enabled on `/sci/` board).
* `<span class="quote">...</span>` — quoted text (starts with a `>`).
* `<span class="deadlink">...</span>` — deleted post link.
* `<a href="#p184569592" class="quotelink">...</a>` — post link (starts with a `>>`).
* `<a href="...">...</a>` — other links (the URL may be in any form: relative like `/a/thread/184064641#p184154285` or `/r/`, absolute like `https://boards.4chan.org/wsr/`, absolute-same-protocol like `//boards.4chan.org/wsr/`).
* "Advanced" users may occasionally use unconventional markup like `<p>`, `<div align="center"/>`, `<h1>`, `<span class="fortune" style="color:#789922;">...</span>`, `<span style="color: red; font-size: xx-large;">...</span>`, `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`, `<font size="4">...</font>`, `<font color="red">...</font>`, `<ul/>`, `<li/>`, `<blink/>`, `<table>`, `<tr>`, `<td>`, `<img src="//static.4chan.org/image/temp/dinosaur.gif"/>`, so all unknown/invalid tags should be ignored by just displaying their content (which can itself contain unknown/invalid tags).

## API

### Get boards list

[https://a.4cdn.org/boards.json](https://a.4cdn.org/boards.json)

```js
{
	"boards": Board[]
}
```

### Get threads list

[https://a.4cdn.org/a/catalog.json](https://a.4cdn.org/a/catalog.json)

```js
[
	{
		"page": 1,
		"threads": Thread[]
	},
	{
		page: 2,
		threads: Thread[]
	},
	...
]
```

### Get threads page

For the first page:

[https://a.4cdn.org/a/1.json](https://a.4cdn.org/a/1.json)

```js
{
	"threads": Thread[]
}
```

I don't know what for does this API endpoint exist. Fetching any "next" page after the first one would result in an incorrect threads list because by that time the first page has already changed.

### Get thread IDs list (and their latest comment dates)

I don't know what for does this API endpoint exist. `4chan` seems to query it on a thread page periodically.

[`https://a.4cdn.org/g/threads.json`](https://a.4cdn.org/g/threads.json)

```js
[
	{
		"page": 1,
		"threads": [
			{
				"no": 51971506,
				"last_modified": 1536364716,
				"replies": 123
			},
			{
				"no": 69694831,
				"last_modified": 1549505043,
				"replies": 456
			},
			// ...
		]
	},
	...
]
```

### Get thread

https://a.4cdn.org/a/thread/THREAD-ID.json

```js
{
	"posts": Post[]
}
```

The first `Post` has various thread info being a [Thread](#thread) object. The other posts are regular [Post](#post) objects.

### Search

`GET` https://p.4chan.org/api/search?q=<search-query>&o=0&l=50

Parameters:

* `q` — Search query
* `o` — Offset (how many search results to skip)
* `l` — Limit (how many search results to return: from `o` to `o + l`)
* `b` — (optional) Board ID to search on.

Result:

* `body`
  * `board: string` — Board ID to search on. `""` when no board ID has been specified.
  * `nhits: number` — Search results count.
  * `offset: string` — The offset parameter. For some weird reason, a stringified number.
  * `query: string` — The search query.
  * `threads: object[]`
    * `board: string` — Board ID.
    * `thread: string` — Some kind of a weird thread ID. Seems to be a stringified thread ID prefixed with a `"t"`. Example: `"t248833993"`.
    * `posts: Post[]` — An array of `Post` objects.

Response headers:

* No CORS headers. A proxy is required for any application not running at `p.4chan.org` domain.

### Get "Popular threads" list

Seems to be [no such API endpoint](https://github.com/4chan/4chan-API/issues/64).

"Chanu" mobile apps seem to just [parse the HTML](https://github.com/grzegorznittner/chanu/blob/8a65b87847ff1aea0366cf3c1e03d70edb94e36c/app/src/main/java/com/chanapps/four/service/FetchPopularThreadsService.java#L277-L286) of the "Popular threads" section of `4chan.org` main page to get the list of "Popular threads".

There's also a website called [`4stats.io`](4stats.io). I contacted `4stats.io` admins and they replied with a detailed explanation. Their approach to calculating "posts per minute" and "threads per minute" stats of a board is:

* [Get the list of threads in a board](#get-threads-list).

* Find the max post ID (the ID of the latest comment on a board) and max thread ID.

* Store `maxPostID` and `maxThreadID` somewhere in state until the next refresh.

* Wait for `N` minutes.

* Get the list of threads in a board again. Find the max post ID and max thread ID again.

* Post IDs are local to a board so the amount of posts added since the previous refresh is the difference of max post IDs: `newMaxPostID - state.maxPostID`. Divide it by `N` and it will be the "posts per minute" stats for the board.

* Count the amount of threads having IDs greater than `state.maxThreadId`. Divide that amount by `N` and it will be the "threads per minute" stats for the board. This stats is not completely accurate because it may have missed some threads that have been created and then deleted (or expired) in-between the refreshes.

The above steps are performed for each board with a delay of `>= 1 sec` between moving from one board to another due to the 4chan API request rate limit of "max one request per second".

To get "posts per minute" stats of a thread (for example, for sorting threads by "popularity"):

```
postsCount = thread.repliesCount + 1
threadLifetimeInMinutes = (currentUnixTimestamp - thread.createdAtUnixTimestamp) / 60
postsPerMinute = postsCount / threadLifetimeInMinutes
```

That would be an average "posts per minute" stats for a thread across its entire lifespan. It's not completely accurate because it assumes that replies are evenly spread throughout the thread's lifetime.

Even though the "posts per minute" stats for a thread is an approximation, it can still be a good-enough indicator of what kind of threads people generally participate in (aka "popular" threads).

If a thread is a new one then its "posts per minute" stats is not reliable. For example, if `thread.createdAtUnixTimestamp` is equal to `currentUnixTimestamp` then it's `postsPerMinute` is `Infinity` due to the division by zero. So a thread's lifetime should be assumed at least a minute.

Or, for example, if a thread has been created just a minute earlier, then its `postsPerMinute` stats is `1` and it will be moved to the top of the rating on a "slow" board just because other threads only usually get something like a single comment in an hour.

So a rating of a thread should account for two metrics: the "posts per minute" stats and the total posts count in the thread.

<details>
<summary>See an example</summary>

#####

```js
function calculateThreadRating(thread) {
	let threadLifetime = Date.now() - thread.createdAt.getTime()
	// The server time can be off due to misconfiguration.
	if (threadLifetime < 0) {
		threadLifetime = 0
	}
	let threadLifetimeInMinutes = (threadLifetime / 1000) / 60
	// If a thread is a new one then its "posts per minute" stats is not reliable.
	// For example, if `thread.createdAtUnixTimestamp` is equal to `currentUnixTimestamp`
	// then it's `postsPerMinute` is `Infinity` due to the division by zero.
	// So a thread's lifetime should be assumed at least a minute.
	if (threadLifetimeInMinutes < 1) {
		threadLifetimeInMinutes = 1
	}
	const postsPerMinute = thread.commentsCount / threadLifetimeInMinutes
	switch (thread.commentsCount) {
		case 1:
			return 0
		case 2:
			return 0.01 * postsPerMinute
		case 3:
			return 0.05 * postsPerMinute
		case 4:
			return 0.1 * postsPerMinute
		case 5:
			return 0.3 * postsPerMinute
		case 6:
			return 0.5 * postsPerMinute
		case 7:
			return 0.7 * postsPerMinute
		case 8:
			return 0.8 * postsPerMinute
		case 9:
			return 0.9 * postsPerMinute
		default:
			return postsPerMinute
	}
}
```
</details>

#####


Alternatively, a precise "posts per minute" stats for a thread could be calculated by first storing `thread.replies` count somewhere in a state, and then, at the next refresh, after `N` minutes, the precise "posts per minute" stats for the thread would be calculated as `(thread.replies - getStateForMinutesAgo(N).findThreadById(thread.id).replies) / N`. Such "more precise" approach would require storing more data in the database and is therefore more complex. It's likely that the "stateless" approximation already provides good-enough results.

### CAPTCHA

Previously, `4chan` was using Google ReCaptcha.

Now it seems to be using its homemade captcha. Perhaps because Google started charging for ReCaptcha, or perhaps to make it more "challenged".

"Get CAPTCHA" API has a rate limit per user. For example, if one tries to send an HTTP request to "get CAPTCHA" API two times in rapid succession, the first one will return a normal response while the second one will return a "posting cooldown" error response. This seems to be some kind of an anti-spam / anti-wipe protection when a given IP address can only post something at most, say, once in a minute.

To get a captcha "challenge", one could `GET` `https://sys.4chan.org/captcha?board=<board-id>&thread_id=<thread-id>`.

The `thread_id` parameter is should be absent when requesting a CAPTCHA to create a new thread.

The response is gonna be in JSON format and will contain a `ticket` property:

```js
{
	// `ticket` property is only present when no `ticket` URL query parameter was passed.
	// The app is meant to attach this `ticket` parameter when sending any subsequent "get CAPTCHA" request.
	"ticket": "1716709153.76712fdcbfd848eca37095cb24282a878e51d217566da89d8b3161cde473c648",

	// The rest of the properties have the same values every time,
	// so just ignore them.

	// "Posting cooldown" time, in seconds.
	"pcd": 60,
	// "Posting cooldown" error message.
	"pcd_msg": "Please wait a while before making a post"
}
```

The application should wait for the amount of seconds specified in the `pcd` response parameter and then re-send the request to "get CAPTCHA" API with the provided `ticket` parameter:

`GET` `https://sys.4chan.org/captcha?board=<board-id>&thread_id=<thread-id>&ticket=<ticket>`.

(`4chan.org` website seems to obtain a `ticket` the same way and then stores it in "local storage" under `4chan-tc-ticket` key)

If the application doesn't wait for the amount of seconds specified by the `pcd` parameter before sending a new request to "get CAPTCHA" API, the response will be:

```js
{
	// "Posting cooldown" time, in seconds.
	"pcd": 59,
	// "Posting cooldown" error message.
	"pcd_msg": "Please wait a while before making a post"
}
```

If the application re-requests a new CAPTCHA too often, the response will be:

```js
{
  "error": "You have to wait a while before doing this again",
  "cd": 27 // Time to wait, in seconds
}
```

Response (no error):

```js
{
  "challenge": "<captcha-challenge-id>",
  "ttl": 120, // Captcha challenge lifetime, in seconds.
  "cd": 45, // Some kind of a "cooldown"? Perhaps in seconds. Perhaps a time to pass before the user could request another captcha challenge.
  "img": "<base64-encoded captcha foreground image>",
  "img_width": 277, // captcha foreground image width.
  "img_height": 80, // captcha foreground image height.
  "bg": "<base64-encoded captcha background image>",
  "bg_width": 326 // captcha background image width.
}
```

The CAPTCHA is comprised of two images that're supposed to be superimposed on each other. The horizontal shift for superimposing the images is supposed to be found interactively by the user. After the correct horizontal shift is found, the user can attempt to guess the characters depicted on the superimposed image.

`GET`-ting the "get CAPTCHA" URL described above is only available from `sys.4chan.org` domain itself (CORS policy).

If one attempts on using certain tools to bypass CORS restrictions, like a CORS proxy, then it still wouldn't work that well: when attempting to `GET` a CAPTCHA using the "get CAPTCHA" URL, it still returns a standard CloudFlare anti-spam HTML verification page: `Checking your browser before accessing "sys.4chan.org". This process is automatic. Your browser will redirect to your requested content shortly. Please allow up to 5 seconds...`, which means that it would be cumbersome to use for 3rd-party applications, and won't work at all for 3rd-party websites.

To work around those issues, 3rd-party websites could use a slightly different technique for getting CAPTCHA info: by embedding an `<iframe/>` on a page and then setting the `src` URL of that `<iframe/>` to be the same "get captcha" URL but with an additional query parameter — `&framed=1` — which makes it return a HTML page instead of a JSON.

But when attempted to `<iframe/>` it on a 3rd-party website, it throws an error: `Refused to display 'sys.4chan.com' in a frame because an ancestor violates the following Content Security Policy directive: "frame-ancestors https://*.4chan.org"`. The reason is [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) HTTP response header having value `frame-ancestors https://*.4chan.org;`. The fix would be either not specifying that HTTP response header at all, or specifying it to be `frame ancestors *;`. So seems like currently the "framed" method [doesn't work](https://github.com/4chan/4chan-API/issues/100) either for 3rd-party websites.

I did attempt to proxy the CAPTCHA frame URL to manually strip `Content-Security-Policy` header from it but the HTTP response was `403 Forbidden` with text "Please turn JavaScript on and reload the page", so I dunno.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			window.parent.postMessage({
				"twister": {
					"challenge": "<captcha-challenge-id>",
					"ttl": 120,
					... // The parameters are the same ones that're returned when not using "&framed=1".
				}
			}, '*')
			// "*" means that any 3rd-party domain could embed this page in an <iframe/> and receive the message.
		</script>
	</head>
	<body>
	</body>
</html>
```

To get CAPTCHA info from such `<iframe/>`, a 3rd-party website would add the following code on a page:

```js
window.addEventListener('message', function(event) {
  // `event.origin` — "https://sys.4chan.org"
  // `event.data` — `{ twister: { challenge: "...", ... } }`
  // `event.source` — Can message back via `event.source.postMessage(...)`
  console.log('Captcha', event.data.twister)
})
```

### Post a comment

Send a `POST` request of type `multipart/form-data` to `https://sys.4channel.org/<board-id>/post`

Parameters:

<!-- * `MAX_FILE_SIZE` — Maximum attachment size (in bytes). Board's `max_filesize` from `https://a.4cdn.org/boards.json`. -->
* `mode` — The type of action being performed. Set to `"regist"` for posting a comment or a thread. Other possible values: `"report"`, `"admin"`, `"usrdel"`, `"admindel"`, `"rebuild"`, `"rebuildall"`.
<!-- * `admin` — Administrator's password. -->
* `resto` — Thread ID.
* `name` — Author's name (optional).
* `email` — Author's email (optional).
* `pwd` — The value of a legacy `4chan_pass` cookie (optional). See the description of it at the end of this section. The suggested way is not including it.
* `com` — Comment text.
* `flag` — Some boards support board-specific "flags" (icons). For example, on `/pol/` board those "flags" indicate comment author's "political preferences". (optional).
* `upfile` — Attachment file binary object (optional).
* `spoiler` — A boolean indicating whether the attachment should be marked as a "spoiler" (optional). <!-- Maybe set to "on" if `true`. -->
* `filetag` — Is only used on `/f/` board. An ID of the "tag" of a file: `0` (Hentai), `1` (Japanese), `2` (Anime), `3` (Game), `4` (Other), `5` (Loop), `6` (Porn).

Additional parameters for Google ReCaptcha:

* `recaptcha_challenge_field` — (Alternative?) CAPTCHA "challenge" id.
* `recaptcha_response_field` — (Alternative?) CAPTCHA "challenge" solution.
* `g-recaptcha-response` — Google ReCaptcha solution.

Additional parameters for 4chan captcha:

* `t-response` — CAPTCHA "challenge" solution (the characters depicted on the captcha image).
* `t-challenge` — CAPTCHA "challenge" id.

Unknown parameters:

* `awt: 1` — ??? Ignore and don't include this one.

The response is in HTML format by default and in JSON format if the HTTP request specifies an `Accept: application/json` header.

"Success" response example (HTML):

```html
<!DOCTYPE html><head><meta http-equiv="refresh" content="1;URL=http://boards.4chan.org/bant/thread/7466194#p7466464"><link rel="shortcut icon" href="//s.4cdn.org/image/favicon.ico"><title>Post successful!</title><link rel="stylesheet" title="switch" href="//s.4cdn.org/css/yotsubanew.685.css"></head><body style="margin-top: 20%; text-align: center;"><h1 style="font-size:36pt;">Post successful!</h1><!-- thread:7466194,no:7466464 --></body></html>
```

Error response example (HTML):

```html
...
<span id="errmsg" style="color: red;">Error: Specified thread does not exist.</span><br><br>[<a href=http://boards.4chan.org/b/>Return</a>]
...
```

Incorrect CAPTCHA solution response example (HTML) (this also seems to be the case when the "pass" cookie value is not a valid "pass"):

```html
...
<span id="errmsg" style="color: red;">Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href="https://www.4chan.org/pass" target="_blank">Learn More</a>]</span><br><br>[<a href=https://boards.4channel.org/g/>Return</a>]
...
```

"Success" response example (JSON):

```js
{
	// Thread ID, in which the new comment has been added.
	"tid": 918926345,

	// The ID of the new comment.
	"pid": 918928299
}
```

Incorrect CAPTCHA solution response example (JSON) (this also seems to be the case when the "pass" cookie value is not a valid "pass"):

```js
{
	"error": "Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https://www.4chan.org/pass\" target=\"_blank\">Learn More</a>]"
}
```

Known error messages:

* `"Error: Specified thread does not exist."` (didn't check)
* `"Error: Our system thinks your post is spam. Please reformat and try again."` (didn't check)
* `"Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https://www.4chan.org/pass\" target=\"_blank\">Learn More</a>]"`
* Cases when the user is banned (didn't check)
* Cases when the thread is closed (didn't check)
* ...

Side effect: When posting a comment or a thread (?), `4chan` seems to set a legacy cookie called [`4chan_pass`](https://github.com/4chan/4chan-API/issues/91#issuecomment-874370066) which has a random-generated "password" that could be used to delete the comment. Since then, they say that `4chan` has tightened their restrictions on comment deletion, so the cookie doesn't seem to be used for that stuff. They also say that `4chan` has found an unrelated use case for that cookie: they say that `4chan` uses it to detect "ban evaders" — people that switch their IP address to an unbanned one to get around their ban. They say `4chan` automatically bans people posting from a different IP address buth with the same `4chan_pass` cookie.

### Post a thread

Same as posting a comment, but without specifying a `resto` parameter and with additional parameters:

* `sub` — Thread title.
* `textonly` — Set to true when posting  (optional).

"Success" response example (HTML):

(same as in "Post a comment" but with `thread` being `0` and `no` being the new thread ID)

"Success" response example (JSON):

(same as in "Post a comment" but with `tid` being `0` and `pid` being the new thread ID)

```js
{
	// This value is a constant one.
	"tid": 0,

	// The ID of the new thread.
	"pid": 918928299
}
```

### Report a post

Send a `POST` request of type `multipart/form-data` to `https://sys.4chan.org/{boardId}/imgboard.php`

Parameters:

* `mode` — `"report"`
* `no` — Reported comment or thread ID.
* `cat_id` — Report category id (a number) (required). Each board has its own set of report categories. There're a lot of them, and there seems to be no way of getting that info via a JSON API.
* `recaptcha_challenge_field` — (Alternative?) CAPTCHA "challenge" id.
* `recaptcha_response_field` — (Alternative?) CAPTCHA "challenge" solution.
* `g-recaptcha-response` — Google ReCaptcha solution.

The response is in HTML format by default and in JSON format if the HTTP request specifies an `Accept: application/json` header.

"Success" response example (HTML):

```html
...
<body><h3><font color='#FF0000'>Report submitted! This window will close in 3 seconds...</font></h3></body>
...
```

Error response example (HTML):

```html
...
<body><h3><font color='#FF0000'>Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href="https://www.4chan.org/pass" target="_blank">Learn More</a>]</font></h3>
...
```

(the HTML markup of "report" API error response is different from the markup of "post" API error response)

"Success" response example (JSON):

(unknown)

Error response example (JSON):

```js
{
  "error": "Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https:\/\/www.4chan.org\/pass\" target=\"_blank\">Learn More<\/a>]"
}
```

Known error messages:

* `"Error: Our system thinks your post is spam."` (didn't check)
* `"Error: You seem to have mistyped the CAPTCHA. Please try again.<br><br>4chan Pass users can bypass this CAPTCHA. [<a href=\"https:\/\/www.4chan.org\/pass\" target=\"_blank\">Learn More<\/a>]"`
* Cases when comment ID wasn't found (didn't check)
* Cases when the user is banned (didn't check)
* ...

Since there seems to be no API for getting a list of valid report categories for a specific board those have been hardcoded in `reportReasons` property in `4chan/index.json` file: when a report reason object has a `boards` property then it's only applicable to that board; otherwise, it's available for use on any board.

Another approach would be opening a new browser window with `4chan.org` report page URL. The URL of the page is the same as the one of the POST API, with the same `mode` and `no` parameters: `https://sys.4chan.org/{boardId}/imgboard.php?mode=report&no=12345678`.

### Pass

Users can bypass solving a CAPTCHA when posting comments or threads by purchasing a paid subscription called a "pass".

After purchasing a "pass", the user can [log in](https://sys.4chan.org/auth) with that "pass" (a string) and a "PIN" code (password) for it.

A "pass" has a length of 10 characters and a numeric PIN for it is 6 characters long.

A "pass" allows to bypass ISP, IP range, and country blocks. For example, a certain IP subnet might be banned due to being known to be used by spammers, and a "pass" is supposed to allow posting from such IP subnet. Although a "pass" won't bypass an individual IP ban, that is a ban for a certain IP address rather than for an IP subnet.

A "pass" will be permanently suspended for posting spam messages, advertising of any kind, or posting content that violates United States law.

Once logged in with a "pass", the user must maintain their IP address, or they will have to re-log-in with the "pass". The user could be logged in with a "pass" simultaneously on multiple devices only if all those devices share the same IP address.

In a given 30-minute interval, the user could log in with a "pass" multiple times but only from a single IP address. Attempts to log in from another IP address before the 30-minute cooldown has passed will be rejected.

A pass could only be purchased for a year period, not less.

All those restrictions are to prevent spammers from using a "pass" to bypass anti-spam protection.

### Log In

Send a `POST` request of type `multipart/form-data` to `https://sys.4chan.org/auth` (or `https://sys.4channel.org/auth`).

Parameters:

* `xhr` — (optional?) Set to `1` to instruct the server to send the response in `application/json` format. By default, when omitted (?), it would send the response in `text/html` format.
* `id` — The "pass".
* `pin` — The PIN code for the "pass".
* `long_login` — (optional) Set to `1` to "remember the device" for 1 year. Leave empty otherwise. Basically, a "Remember me" checkbox.

Response example:

```js
{
	// (?) status: ...,
	message: "Your device is now authorized." // Didn't check. Hypothetically, it looks like this.
}
```

Response cookies:

* `pass_id` — "Pass ID" cookie. An old code dump somewhere on the internet says that the value of the cookie can be `"0"`, in which case it should be ignored, but maybe that's no longer the case. In future, the server will check this `pass_id` cookie value when posting a comment or a thread, or when submitting a report.
* `pass_enabled` — `1`. Supposedly, this somehow tells the website or the server that the user is logged in.

In case of an error, it still returns an HTTP status 200 response, but with a different response JSON object.

Response examples in case of an error:

```js
{
	status: -1,
	message: 'Your Token must be exactly 10 characters.' // The `id` parameter must be a string of 10 characters.
}
```

```js
{
	status: -1,
	message: 'You have left one or more fields blank.' // Some parameter wasn't specified. Didn't check. Hypothetically, it looks like this.
}
```

```js
{
	status: -1,
	message: 'Incorrect Token or PIN.'
}
```

<!--
Some other error message regexp, in case of an HTML response:

```html
...
<strong style=\"color: red; font-size: larger;\">(.*?)</strong>
...
```
-->

They also [say](https://github.com/4chan/4chan-API/issues/91#issuecomment-889684456) that `4chan` restricts the ability to share a "pass" by restricting a "pass" to be used only from a single IP address in a given timeframe. Didn't check.

### Log Out

Send a `POST` request to `https://sys.4chan.org/auth` (or `https://sys.4channel.org/auth`).

It will clear `pass_id` and `pass_enabled` cookies.

Didn't check.

### Roles

If a comment has a `capcode` then it implies that the poster is a priviliged one. Possible `capcode`s:

* `"admin"` for admins
* `"admin_highlight"` for some kind of "highlighted" admins
* `"mod"` for moderators
* `"manager"` for "managers"
* `"developer"` for developers
* `"founder"` for founders
* `"verified"` for [verified](https://github.com/4chan/4chan-API/issues/76) posters

"Janitors" don't get a `capcode`. See [4chan FAQ on "capcodes"](https://www.4chan.org/faq#capcode).

### URLs

Images: `//i.4cdn.org/${board}${tim}${ext}`

Thumbnails: `//i.4cdn.org/${board}/${tim}s.jpg`

Spoiler image: `//s.4cdn.org/image/spoiler.png`

Custom spoilers: `//s.4cdn.org/image/spoiler-${board}${custom_spoiler}.png`

Country flags: `//s.4cdn.org/image/country/${country}.gif`

Board flags: `//s.4cdn.org/image/flags/[board]/[code].gif`

### `<wbr>`

I figured that 4chan places `<wbr>` ("word break") tags when something not having spaces is longer than 35 characters. [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr) is a legacy HTML tag for explicitly defined "word breaks". `4chan.org` inserts `<wbr>` in long URLs every 35 characters presumably to prevent post text overflow. I don't see any point in that because CSS can handle such things using a combination of `overflow-wrap: break-word` and `word-break: break-word` so I simply discard all `<wbr>`s in my code (otherwise they'd mess with hyperlink autodetection). I could replace all `<wbr>`s with `"\u200b"` (a "zero-width" space for indicating possible line break points) but then hyperlink autodetection code would have to filter them out,
and as I already said above line-breaking long text is handled by CSS. Also `4chan.org` sometimes has `<wbr>` in weird places. [For example](https://github.com/4chan/4chan-API/issues/66), given the equation `[math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[<wbr>/math]` `4chan.org` has inserted `<wbr>` after 35 characters of the whole equation markup while in reality it either should not have inserted a `<wbr>` or should have inserted it somewhere other place than the `[/math]` closing tag.

### Math

`4chan.org`'s `/sci/` board allows posting formulae using TeX (or LaTeX) syntax. Inline formulae are delimited with `[math]...[/math]` tags, block level ones — with `[eqn]...[/eqn]` tags. Example:

```js
{
	com: "See the equation for [math]f(x)[/math]:<br><br>[eqn]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/eqn]"
}
```

`4chan.org` uses [MathJAX](https://en.wikipedia.org/wiki/MathJax) library for displaying the equations. MathJAX uses its own "mathematical" font for displaying math.

### Archive

On [some](https://github.com/4chan/4chan-API/blob/master/pages/Boards.md) boards, when a thread is pushed off the last page of the board, it doesn't get immediately erased, and instead becomes "archived" for some time. The [official 4chan docs](https://github.com/4chan/4chan-API/blob/master/pages/Archive.md) don't go into specifics on what the exact time interval is, so I assume the time be 3 days, and the maximum number of currently archived threads be `3000` (the older ones get erased by the newer ones in case of an overflow).

Archived threads are closed to new posts. They have `archived` flag set to `1`.

### Auto-refresh

"Tail" API was introduced for reducing bandwidth when auto-refreshing comments in a thread.

To get a list of all comments in a thread one would send a request to the "get thread" API. For example, `http://a.4cdn.org/a/thread/185776347.json`.

Then, when a user navigates to the thread page and scrolls down to the bottom of the page, the program should start "auto-refreshing" the thread in order to get new messages. This is done using the "tail" API which has `-tail` appended to the "get thread" API URL. In this case, that would be `http://a.4cdn.org/a/thread/185776347-tail.json`. That URL doesn't always exist: the `-tail.json` file is only created for a thread when it reaches a certain comments count threshold.

The response of the "tail" API is the same as the one of the regular "get thread" API with the exception that the first `post` doesn't contain various thread info and instead looks like this:

```js
posts[0] = {
	// Thread id.
	"no": 185776347,

	// Is "bump limit" reached?
	"bumplimit": 0,

	// Is "image limit" reached?
	"imagelimit": 0,

	// Is the thread closed?
	"closed": 1,

	// Is the thread archived?
	"archived": 1,

	// I'd assume `sticky: 1` would be here too in case of a "pinned" thread,
	// though not confirmed on any real-world example.

	// Does the thread use a custom (board-specific) "spoiler"
	// image instead of the default one?
	"custom_spoiler": 1,

	// Total comments count in the thread,
	// not including the "main" ("original") comment.
	"replies": 195,

	// Total attachments count in the thread.
	"images": 82,

	// Unique poster IPs count.
	"unique_ips": 44,

	// The length of the `posts[]` array
	// (minus one for the opening post)
	// in this API response.
	"tail_size": 50,

	// The `id` of the comment that comes before
	// the first comment of the "tail".
	// In other words, it's the `id` of the last comment
	// not included in the "tail" API response.
	"tail_id": 185788827
}
```

In this example, the "tail" API returns an array of 51 `post`s with `tail_size` equal to `50`.

The auto-refresh algorithm is:

1. Query `-tail.json`. If it doesn't exist, then perform a full thread refresh and go to step 5.
2. Check if `posts[0].tail_id` is less than or equal to the current "latest comment ID".
3. If it is, then there're no missed comments. Append new comments starting from `id > "latest comment ID"`.
4. If it's not, then it means that since the last "auto-refresh" there have been too much new comments and some of them are missing in `-tail.json`, so perform a full thread refresh.
5. Update the "latest comment ID" and wait for the next auto-refresh.

I checked some `/a/` and `/b/` threads and the comments count threshold for `-tail.json` file to exist appears to be 101 comments in a thread.