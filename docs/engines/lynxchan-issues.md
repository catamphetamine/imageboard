# lynxchan

While adding support for [`lynxchan`](https://gitgud.io/LynxChan/LynxChan), several issues have been discovered in the engine.

## Major Issues

### No thread thumbnail size in catalog API response

In `/catalog.json` response, it only returns a thread thumbnail's MIME type and URL, but doesn't tell anything about the thumbnail's width or height:

```js
{
  ...
  "thumb": "/.media/t_8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d",
  "mime": "image/jpeg"
}
```

Without having `width` and `height` of a thumbnail, a 3rd party client [won't be able](https://gitlab.com/catamphetamine/imageboard/-/issues/1#note_394935541) to display such thumbnail correctly if the client doesn't simply expand-and-clip thread thumbnails in order to fit them in squares and instead shows thread thumbnails as is in their true aspect ratio.

### No thread creation date in catalog API response

There's [no thread creation date](https://gitlab.com/catamphetamine/imageboard/-/issues/1) property returned on threads in `/catalog.json` API response. There's only `lastBump` property but that's the date of the latest comment in a thread, not the thread's creation date.

```js
{
  "page": 1,
  "threadId": 58,
  "subject": "Fraudlulent Benchmarks",
  "message": "...",
  "markdown": "...",
  "locked": false,
  "pinned": false,
  "cyclic": false,
  "autoSage": false,
  "lastBump": "2021-10-19T03:43:57.137Z"
}
```

The `lastBump` date property here is meaningless because it only signals that there's some new comment in the thread since a previous refresh date. But `/catalog.json` API is not used to watch threads. Instead, it's used for what it says — for simply displaying a list of threads on a board.

When querying a specific thread directly, `creation` date is available on the first post of the thread. But it's not available in `/catalog.json` API response.

Without thread creation date being returned, a 3rd-party client won't be able to show thread creation date in the list of threads on a board. Also, a 3rd-party client won't be able to sort threads by thread creation date ("Show newest threads first"). The default sorting order in `/catalog.json` API response is by `lastBump` descending.

For comparison, `4chan.org` provides a `time` property on threads in [`/catalog.json`](https://a.4cdn.org/a/catalog.json).

### No board category in `/boards.js?json=1` API response

There's no info about board category on boards in the list of boards in `/boards.js?json=1` API response. There're `tags[]` but "tags" aren't "category".

##### `kohlchan.net`

`kohlchan` works around that limitation by hacking category info in tags. For example, `tags: ["menu-4/n/sonstiges-2"]` on a board means that the board belongs to the fourth menu section where it should be on the second position in the "Sonstiges" category.

## Medium Issues

### Only the first picture in a thread is available in catalog API response

In `/catalog.json` response, it [only](https://gitlab.com/catamphetamine/imageboard/-/issues/1#note_394918880) returns the first picture in a thread's original (starting) comment, and doesn't return the rest of the pictures, if there're any:

```js
{
  ...
  "thumb": "/.media/t_8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d",
  "mime": "image/jpeg"
}
```

Without that info, a 3rd-party client won't be able to show the other pictures attached to a thread's original (starting) comment, if there're any, and the user won't see those pictures if they don't click on the thread itself in the list of threads when browsing a board.

### No thumbnail width and height in `files[]`

No width and height is returned for thumbnails in the list of `files[]` in a comment when fetching a thread.

```js
{
  ...
  "posts": [
  {
    ...
    "files": [
      {
        "originalName": "1560055496171s.jpg",
        "path": "/.media/8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d.jpg",
        "thumb": "/.media/t_8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d",
        "mime": "image/jpeg",
        "size": 6446,
        "width": 211,
        "height": 250
      }
    ]
  }
]
```

A workaround is to calculate thumbnail width and height based on the original full-sized image dimensions, but that's not a 100% precise approach because it's unknown how exactly the thumbnail engine on the server side rounds fractional pixels when generating a thumbnail. Does it stretch `60.3px` to `61px`? Does it trim `60.9px` to `60px`? Or does it round fractional dimensions using the conventional number rounding? Seems like the latter, but it's not specified anywhere. A single added or removed row of pixels wouldn't be noticeable but still the app shouldn't needlessly do that type of weird hacky guessing.

### No file size or original file name in catalog API response

It doesn't provide the "original" file name for an attachment in catalog API response. If a user has only uploaded a PDF attachment when creating a thread, a 3rd-party client won't be able to show the "original" file name and size, like `"A Random Walk Down Wall Street.pdf" (5.5 MB)`, to the user in a list of threads on a board. Instead it will just be a generic "PDF document" icon based on the `mime` type of the attachment.

"Original" file name is returned on attachments when fetching a specific thread data:

```js
{
  ...
  "posts": [
  {
    ...
    "files": [
      {
        "originalName": "A Random Walk Down Wall Street.pdf",
        "path": "/.media/b22705cabce1d8bd94d1fae75d24b86a904fc2be5473f6a16dc789304ab3fd11.pdf",
        "thumb": "/genericThumb.png",
        "mime": "application/pdf",
        "size": 5500000,
        "width": null,
        "height": null
      }
    ]
  }
]
```

## Minor Issues

### No thread thumbnail full size image URL in catalog API response

In `/catalog.json` response, it only returns a thread thumbnail's URL and doesn't return the URL of the full-sized image:

```js
{
  ...
  "thumb": "/.media/t_8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d",
  "mime": "image/jpeg"
}
```

Without the full-sized image URL, a 3rd-party client won't be able to show the original image when the user clicks on a thread's thumbnail in the list of threads on a board.

##### `kohlchan.net`

`kohlchan.net` wrote their own "addon" that provides `files[]` array on threads in `/catalog.json` API response.

### No MIME type on thumbnails in `files[]`

No MIME type is returned for thumbnails in the list of `files[]` in a comment when fetching a thread:

```js
{
  ...
  "posts": [
  {
    ...
    "files": [
      {
        "originalName": "1560055496171s.jpg",
        "path": "/.media/8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d.jpg",
        "thumb": "/.media/t_8fcb22539d80c23a397ab4ff607f7e56d8bd572e0d774959a5f07559e3e2fd5d",
        "mime": "image/jpeg",
        "size": 6446,
        "width": 211,
        "height": 250
      }
    ]
  }
]
```

Without that info, it's unclear to a 3rd-party client how exactly should it render the thumbnail. Is it a `*.jpg` file? Or a `*.png` file? Or a `*.gif` file? Maybe a `*.webp` file? Or an `*.apng` file? If the attachment is a video, what is the MIME type of its thumbnail? It's convenient when the image rendering component provided by the Operating System is "smart" and inspects the image file header in order to find out how should the image be decoded and rendered. But the engine shouldn't make such broad assumptions.

### No duration is returned for video files

When fetching a specific thread, if there's a video attachment in some comment, there's no `duration` property telling how long the video is.

```js
{
  ...
  "posts": [
  {
    ...
    "files": [
      {
        "originalName": "кот-дискотека.webm",
        "path": "/.media/2a62309267ca91d71addcdda86c59d68d8ec8be8e0b13648a5eef7bf280d90e8.webm",
        "thumb": "/.media/t_2a62309267ca91d71addcdda86c59d68d8ec8be8e0b13648a5eef7bf280d90e8",
        "mime": "video/webm",
        "size": 543175,
        "width": null,
        "height": null
      }
    ]
  }
]
```

Without video duration, a 3rd-party client won't be able to show the user a duration badge on such video attachment thumbnail.

### No thread author role in catalog API response

There's no `signedRole` (thread author role) property on threads in `/catalog.json` API response for threads created by a privileged user. At the same time, `signedRole` property is available when fetching a specific thread's data.

Without this info in `/catalog.json` API response, a 3rd-party client won't be able to show that a thread was created by a moderator or an admin in a list of threads on a board.

### No poster IDs in catalog API response

Some imageboards show poster "unique" IDs on some boards like `4chan.org` does `/int/` or `/pol/`, or like `lynxchan`'s demo site does on [`/lynx/`](https://yeshoney.xyz/lynx) board (example: `Id: 9dbc91` in a comment's header). That is to identify the same author posting several comments in a specific thread, or on the imageboard in general, so that a user would be able to participate in a dialogue with another person, or even hide all of their comments and threads.

`lynxchan` engine doesn't return those author IDs in `/catalog.json` API response.

Without that info, a 3rd-party client won't be able to auto-hide threads by "blacklisted" authors in a list of threads on a board.

### No `postCount` or `fileCount` in "fetch thread" API response

There're `postCount` and `fileCount` properties returned in `/catalog.json` API response, but there're no such properties in "fetch thread" API response.

While `postCount` could be relatively easily calculated as `posts.length`, `filesCount` would require iterating through each post in order to calculate the total attachments count in a thread, which is still an easy task but why does a 3rd-party client have to do such a thing when those properties could be provided in the API response.

### In some cases, a thread doesn't have `postCount` or `fileCount` in catalog API response

There will be no `postCount` property in `/catalog.json` API response for threads that don't have any replies.

There will be no `fileCount` property in `/catalog.json` API response for threads that don't have any attachments in any of the replies.

While such weird cases could be handled by a 3rd-party client, why not be consistent and provide those two properties for all threads in catalog API response.