# `vichan` API

[`vichan`](https://github.com/vichan-devel/vichan) engine was originally a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine with some added features.

The engine was developed as an open-source alternative to the proprietary `4chan.org` engine, and so it mimicks `4chan.org`.

After `4chan.org` added their [JSON API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.md) in 2012 so did `vichan`, and they did it in a way that it's compatible with `4chan.org` JSON API. For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same.

In November 2017, `vichan` engine was put in "no longer being maintained" state, although later, around 2022, a group of volunteers seems to have picked up the development from the former maintainer.

### Differences from `4chan`

* Threads have `cyclical` property that can be `"0"` or `"1"`. For some weird reason, it's not a number but rather a string.

* Weirdly, `tim` is a string rather than a number.

* "Get threads page" API URLs include page index rather than page number. In other words, pages start with `0.json` rather than `1.json`.

* There can be multiple attachments in a comment: if there's more than one attachment, an `additional_files` array is present in a Post.

### Imageboards

* [`lainchan.org`](https://lainchan.org/) — Uses a custom fork of `vichan`
* [`soyjak.party`](https://soyjak.party/)
* [`vichan.pl`](https://vichan.pl/)

### Post a comment

Send a `POST` request of type `multipart/form-data` to `/post.php`

Parameters:

* `thread` — Thread ID.
* `board` — Board ID.
* `name` — Author's name (optional).
* `email` — Author's email (optional). Set to `"sage"` to prevent "bumping" the thread with this comment.
* `subject` — Comment title.
* `body` — Comment text.
* `password` — An optional password for own post/attachment deletion.
* `embed` — Allows specifying a link to "embedded" content such as a YouTube video. Replaces any attachments.
* `page` — Unknown. Seems to be `1` when creating a new thread being at the first page of a board.
* `json_response` — Set to `1` to receive the HTTP response in `application/json` format.
* `post` — (seen at `soyjak.party`) Unknown. Has value `"New Reply"`. I'd assume that this parameter could be omitted.
* `file` — Attachment.
* `spoiler` — Set to `"on"` to mark the attachment with a "spoiler" label.
* `no-bump` — Set to `"on"` to emulate "sage" behavior. In other words, posting a comment in a thread while having this flag `"on"` will not bump that thread.

<!-- Also, posting a comment or a thread might require supplying a [CAPTCHA solution](#get-a-captcha). -->

"Success" response example:

```js
{
  // The URL of the comment to redirect to.
  "redirect": "\/random\/res\/108867.html#108897",

  // Supposedly, `noko: true` flag means "redirect to the comment".
  //
  // https://www.urbandictionary.com/define.php?term=noko
  // "noko — A magical word that, when typed in the email field of a chan post form before
  //  posting, returns you directly to the thread you just posted in instead of the thread list."
  // "Example: I use "noko" on /b/ to avoid losing track of my threads."
  //
  "noko": true,

  // Comment ID or thread ID.
  "id": "108897",

  // Dunno what `post_type` property is.
  // * `post_type: false` is returned on `8kun.top`.
  // * `post_type` is not returned in `vichan` engine.
  "post_type": false
}
```

### Post a thread

Supposedly, same as posting a comment, but without specifying the `thread` parameter, and with additional parameters:

* `show_ids` — (seen at `soyjak.party`) Enables showing comment author IP address hashes in the new thread.
* `images_only` — (seen at `soyjak.party`) Only allows posting comments with image attachments in the new thread.
* `post` — (seen at `soyjak.party`) Unknown. Has value `"New Topic"`. I'd assume that this parameter could be omitted.