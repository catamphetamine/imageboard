# `jschan` API

[jschan](https://gitgud.io/fatchan/jschan/) is an alternative engine written in Node.js/MongoDB whose development started in 2019. Isn't really adopted by anyone, perhaps because there haven't been any new imageboards since its development has started. Compared to `lynxchan`, purely from a technical perspective, it looks much more professional and mature.

Official API docs: https://fatchan.gitgud.site/jschan-docs/

## Read-only API

### File

```js
{
	// File URL: `https://domain.com/file/{filename}`.
	"filename": "ca3a34179bf0365a3fc5285e763f35930b177ef5e65210f2108204ed7d0d1bff.gif",

	// Should this file be put under a "spoiler"?
	"spoiler": null,

	// SHA256 hash of the file.
	"hash": "ca3a34179bf0365a3fc5285e763f35930b177ef5e65210f2108204ed7d0d1bff",

	// The name of the file as it is on the uploader's device.
	"originalFilename": "thenoseknows.gif",

	// File mime-type.
	"mimetype": "image/gif",

	// File size, in bytes.
	"size": 571071,

	// File extension.
	// Filename is: `hash + extension`.
	"extension": ".gif",

	// A "pHash" (perceptual hash) is a generated hash that is produced by a special algorithm.
	// Refer: https://phash.org.
	// This hash is a fingerprint, which can be used to compare images.
	// Potential applications include:
	// * copyright protection
	// * similarity search for media files
	// * digital forensics.
	"phash": "711d1d1d1d1d2d2d",

	// Formatted file size (text).
	"sizeString": "557.7KB",

	// Thumbnail file extension.
	// Thumbnail filename is: `hash + thumbextension`.
	// Thumnail URL: `https://domain.com/file/thumb/{thumbnail}`.
	"thumbextension": ".gif",

	// Image sizes.
	"geometry": {
		// Image width.
		"width": 480,

		// Image height.
		"height": 360,

		// Thumbnail width.
		"thumbwidth": 128,

		// Thumbnail height.
		"thumbheight": 96
	},

	// Formatted image dimensions (text).
	"geometryString": "480x360",

	// Whether the file has a thumbnail.
	// For example, images always have.
	// But if it was, say, a `*.zip` archive, it wouldn't have a thumbnail.
	"hasThumb": true
}
```

<details>
<summary>Video attachment example</summary>

#####

```js
{
	"filename": "e8beb2af0c47c598906476af60dafdb2e3fb130d045205bcd471f5e0dd3c7c96.mp4",
	"spoiler": null,
	"hash": "e8beb2af0c47c598906476af60dafdb2e3fb130d045205bcd471f5e0dd3c7c96",
	"originalFilename": "Jew_boy.mp4",
	"mimetype": "video/mp4",
	"size": 3380735,
	"extension": ".mp4",
	"sizeString": "3.2MB",
	"duration": 61.300651,
	"durationString": "01:01",
	"thumbextension": ".jpg",
	"geometry": {
		"width": 640,
		"height": 368,
		"thumbwidth": 128,
		"thumbheight": 73
	},
	"geometryString": "640x368",
	"hasThumb": true
}
```
</details>

<details>
<summary>Audio attachment example</summary>

#####

```js
{
	"filename": "120b84d9cb5788789a0e3b2e59bb6f33dd176232269d96eea1e32dbcfce69747.mp3",
	"spoiler": null,
	"hash": "120b84d9cb5788789a0e3b2e59bb6f33dd176232269d96eea1e32dbcfce69747",
	"originalFilename": "imperial_march.mp3",
	"mimetype": "audio/mpeg",
	"size": 299511,
	"extension": ".mp3",
	"sizeString": "292.5KB",
	"duration": 18.703673,
	"durationString": "00:18",
	"thumbextension": ".png",
	"hasThumb": true,
	"geometry": {
		"thumbwidth": 128,
		"thumbheight": 128
	}
}
```
</details>

### Post

An object representing a post.

Has properties:

* `_id` — A textual hash ID of the post.
* `postId` — A numeric ID of the post.
* `thread` — A numeric ID of the thread. Is `null` for the root post of a thread.
* `board` — The string ID of the board.
* `date` — An ISO-formatted date of the comment. Example: `"2021-10-02T23:15:42.675Z"`.
* `backlinks` — A list of objects of shape `{ _id, postId }` containing the IDs of the `Post`s that're considered "replies" to this one.
* `quotes` — A list of objects of shape `{ _id, thread, postId }` containing the IDs of the `Post`s quoted by this post.
* `crossquotes` — A list of objects of shape `{ _id, thread, postId }` containing the IDs of the `Post`s in other threads on the same board quoted by this post.
* `files` — A list of `File` objects: attachments to this post.
* `userId` — A unique hash of the poster's IP subnet. Can be used on some boards to identify comment authors in threads on a board. Example: `"5b99f6"`.
* `banmessage` — If the author of the comment was banned for this comment, it's gonna be a text of the reason.
* `u` — A numeric ID of the user, if they're signed in.
* `name` — Comment author's name.
* `email` — Comment author's email.
* `capcode` — Comment author's "capcode" (privileged role name). Examples: `"## Admin"`, `"## Global Staff"`.
* `tripcode` — Comment author's "tripcode" (a string). Example: `"!Bd4QgbbocU"`.
* `country` — Comment author's country info. Could be an object of shape `{ code: string, name: string }`. Examples: `{ code: "TOR", name: "Tor Hidden Service" }`, `{ code: "AU", name: "Australia" }`. Or could be "custom" icon of a slightly another shape. Example: `{ name: "Ram_Ranch", code: "Ram_Ranch", src: "Ram_Ranch380da59067b3d670e7aa5a2b1c4aa6621b014b29449b90f36eb43fd92f400ddf.png", custom: true }`.
* `ip` — Comment author's IP address. I didn't see it on `94chan.org`. An object of shape `{ raw?: string, cloak?: string }`, either `raw` or `cloak` are supposed to be present.
* `spoiler` — Whether all attachments in the comment are "spoilers". A `boolean`.
* `subject` — Comment's subject. If there's no subject, it's gonna be `""` rather than `null`. Maybe this is already fixed in the latest versions of the engine.
* `message` — HTML markup of the comment's text.
* `messagehash` — A SHA256 hash of the `message`, for some reason. Perhaps it was intended to prevent editing?
* `nomarkup` — Non-HTML variant of the comment's text.
* `edited` — If this comment was edited, it's gonna be an object of shape `{ username, date }`. Example: `{ username: "admin", date: "2021-11-03T00:36:36.620Z" }`.

### Get the list of boards (paginated)

`GET` `/boards.json`

Returns an object:

* `boards: Board[]` — A list of boards on the current page.
* `page: number` — The current page, starting from `1`.
* `maxPage: number` — Total pages count.

Each `Board` object has properties:

* `webring: boolean` — Whether this board is the imageboard's own (`webring: false`) or is from some other imageboard in the "webring" (`webring: true`).
* `_id: string` — Board ID.
	* For `webring: false` boards, it's gonna be the board's URL ID. Example: `b`.
	* For `webring: true` boards, it's gonna be a globally-unique (to what extent?) hexademical ID. Example: `664782be8ea6e830494bd8cc`.
* `uri?: string` — Board URL ID when the board is a `webring: true` one. Example: `b`.
* `pph: number` — Posts made in the last hour.
* `ppd: number` — Posts made in the last day.
* `ips: number` — The count of unique users that've posted on the board in some time span.
* `tags?: string[]` — A list of tags that're available to be used when creating threads on this board.
* `settings: object`:
  * `name: string` — Board title. Example: `Random`.
  * `description: string` — Board description. If there's no description, will be an empty string.
  * `sfw: boolean` — Whether the board is "safe for work".
  * `unlistedLocal?: boolean` — Dunno. Seems to only be present for `webring: false` boards.

### Get thread with all comments

`GET` `/{boardId}/thread/{threadId}.json`

Returns a `Post` object having additional properties:

* `replies` — An array of all other `Post`s in this thread.
* `cyclic` — WHether this thread is a "cyclic" one. In "cyclic" threads, when reaching "bumplimit", new comments override old ones so that the total count of the comments is maintained at the "bumplimit".
* `locked` — Whether this thread is locked. If it's not locked, then `0`. Otherwise, `1`.
* `bumplocked` — Whether this thread is "bumplocked". "Bumplocked" threads never get "bumped", even when someone leaves a comment.
* `sticky` — Whether this thread is sticky. If it's not sticky, then `0`. If it is sticky, then it's gonna be a non-zero number representing the priority of "stickiness". For example, `sticky: 3` should be placed higher than `sticky: 1`.
* `bumped` — An ISO-formatted date of when the thread was latest "bumped", i.e. received a comment which is not a "sage" one and the thread is neither bumplocked nor has reached bumplimit. Example: `"2021-10-02T23:15:42.675Z"`. Is always not `null`.
* `replyposts` — A total number of posts in this thread, excluding the root post.
* `replyfiles` — A total number of files in posts in this thread, excluding the root post.

### Get threads on a board

`GET` `/{boardId}/catalog.json`

Returns a list of `Thread` objects.

### Get threads on a board (paginated)

Returns a paginated list of threads on a board, with latest replies for each thread.

First page:

`GET` `/{boardId}/index.json`

Subsequent pages:

`GET` `/{boardId}/{page}.json`

Returns a list of `Thread` objects. Each `Thread` object, having additional properties:

* `previewbacklinks` — Same as `backlinks` but only includes the latest posts.
* `omittedposts` — The count comments that have been skipped. "Skipped" comments are, naturally, the ones that're neither the root comment nor the latest replies.
* `omittedfiles` — The count of attachments in the comments that have been skipped. "Skipped" comments are, naturally, the ones that're neither the root comment nor the latest replies.

## Message Syntax (HTML)

```
<a class=\"quote\" href=\"/pol/thread/5119.html#5134\">&gt;&gt;5134</a>
<a rel=\"nofollow\" referrerpolicy=\"same-origin\" target=\"_blank\" href=\"https://www.youtube.com/watch?v=9nPVkpWMH9k\">https://www.youtube.com/watch?v=9nPVkpWMH9k</a>
<small>(OP)</small>
<span class=\"greentext\">&gt;Quote text blah blah blah</span>
<span class="pinktext">&lt;Pink text quote, like on 8ch.net</span>
<span class="title">inline title (red bold text)</span>
<span class="bold">bold</span>
<span class="underline">underline</span>
<span class="strike">strikethrough</span>
<span class="spoiler">spoiler text (hidden until hovered by mouse cursor)</span>
<span class="em">italic</span>
<span class="detected">((( detected )))</span>
<span class="mono">inline code (monospace)</span>
<span class="code">// block of code \n int main() {...}</span>
<pre class="aa">( ・ω・) ASCII-art.</pre>
```

## API

The API returns a response in the form of a JSON object, regardless of whether there was an error or not.

The response JSON object may contain various properties, but it seems to always contain at least `title` and `message` strings.

If there was an error, the HTTP status codes are:
* `400`	Bad Request — The request is invalid. Maybe unsupported URL or unsupported parameters.
* `403`	Forbidden — The user is not logged in, or getting a "block bypass" is required for a non-logged-in user, or the user doesn't have permission to perform the requested action.
* `404`	Not Found
* `405`	Method Not Allowed — The requested URL doesn't support the specified HTTP request method.
* `429`	Too Many Requests — You're sending too many requests too quickly.
* `500`	Internal Server Error — An unknown error occured on the server.
* `503`	Service Unavailable — The website is temporarily offline for maintenance.

## Posting

### Create a comment

`POST` a `multipart/form-data` request to `/forms/board/{boardId}/post`.

Parameters:

* `thread: number` — Thread ID.
* `email?: string` — Author email.
* `message?: string` — Comment text content.
* `postpassword?: string` — Autogenerated "password" hash that can be used for deleting the comment.
* `captcha?: string` — (optional) CAPTCHA solution, if no `bypassid` cookie is passed.

Request cookies:

* `bypassid` — (optional) "Block Bypass" ID.

If there were no errors, the response will look like:

```js
{
	postId: 8150,
	redirect: "/b/thread/8081.html#8150"
}
```

If solving a CAPTCHA is required in order to post, and no `bypassid` cookie was attached to the request, or if the attached `bypassid` is no longer valid, the response will be `403 Forbidden`:

```js
{
	title: "Forbidden",
	message: "Please complete a block bypass to continue",
	frame: "/bypass_minimal.html?language=en-GB",
	link: { href: "/bypass.html", text: "Get block bypass" }
}
```

In the example above, the user should solve a CAPTCHA in order to get issued a "block bypass". The CAPTCHA could be found at the URL which is the value of the `frame` property in the response. For example, that URL could be opened in an `<iframe/>` tag.

### Create a thread

Same as "Create a comment" but the `thread` parameter should be omitted or set to `null`.

The response supposedly looks like:

```js
{
	thread: 8081,
	redirect: "/b/thread/8081.html"
}
```

### Report

Send a `POST` request of type `multipart/form-data` to `/forms/board/{boardId}/actions`.

Parameters:

* `checkedposts: number[]` — A list of Post IDs.
* `report?: boolean` — Set to `true` to "report the selected posts to board staff".
* `global_report?: boolean` — Set to `true` to "report the selected posts to global staff".
* `report_reason: string` — Report reason.
* `captcha?: string` — (optional) CAPTCHA solution.

Request cookies:

* `bypassid` — (optional) Block Bypass ID.

## CAPTCHA

### Get CAPTCHA

To get a CAPTCHA, send a `GET` request to `/captcha` URL.

The response will contain a `set-cookie` header with `captchaid` cookie which also has an expiration date (the date when the CAPTCHA expires).

## Block Bypass

### Create Block Bypass

Allows the user to renew their "block bypass". "Renew" means "receive a new one", i.e. "create".

First, request a new CAPTCHA using "Get CAPTCHA" API.

Then `POST` to `/forms/blockbypass?language=en-GB`

Parameters:

* `captcha` — CAPTCHA solution.
<!-- * `minimal: 1` -->

Request Cookies:

* `captchaid` — CAPTCHA ID.

Result:

If the CAPTCHA solution is incorrect, the response will be `403 Forbidden`.

If the CAPTCHA solution is correct, it will respond with:

```js
{
	title: "Success",
	message: "Completed block bypass, you may go back and make your post."
}
```

And it will set a `bypassid` cookie holding the new "block bypass" ID. The expiration date of the cookie is the date when the "block bypass" expires.

## Authentication

### Sign Up

Send a `POST` request of type `multipart/form-data` to `/forms/register`.

Parameters:
* `username`
* `password`
* `passwordconfirm` — `password` repeated.
* `captcha` — (optional) CAPTCHA solution, if no `bypassid` cookie is passed.

Request cookies:
* `bypassid` — (optional) Block Bypass ID.

### Log In

Send a `POST` request of type `multipart/form-data` to `/forms/login`.

Parameters:
* `username`
* `password`

Response cookies:
* `connect.sid`

If the authentication finished normally, the response will be a `302` redirect and there'll be `set-cookie` header for `connect.sid` cookie.

In case of an incorrect username or password, the respoinse is gonna be `403 Forbidden`:

```js
{
	"title": "Forbidden",
	"message": "Incorrect username or password",
	"redirect": "/login.html?goto=%2Faccount.html"
}
```

### Log Out

Send a `POST` request to `/forms/logout`.

Request cookies:
* `connect.sid` — The same cookie that was set during log in.