# `vichan` API

[`vichan`](https://github.com/vichan-devel/vichan) engine was originally a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine having more features.

After `4chan.org` added their [JSON API](https://gitlab.com/catamphetamine/imageboard/blob/master/docs/engines/4chan.md) in 2012 so did `vichan`, and they did it in a way that it's compatible with `4chan.org` JSON API. For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same.

As of November 2017, `vichan` engine is no longer being maintained.

### Differences from `4chan`

* Threads have `cyclical` property that can be `"0"` or `"1"`. For some weird reason, it's not a number but rather a string.

* Weirdly, `tim` is a string rather than a number.

* "Get threads page" API URLs include page index rather than page number. In other words, pages start with `0.json` rather than `1.json`.

* There can be multiple attachments in a comment: if there's more than one attachment, an `additional_files` array is present in a Post.