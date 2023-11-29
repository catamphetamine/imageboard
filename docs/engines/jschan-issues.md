# jschan

While adding support for [jschan](https://gitgud.io/fatchan/jschan/), several issues have been discovered in the engine.

## Medium Issues

### Doesn't have a version of `/catalog.json` with latest replies

Instead of going `4chan.org`'s route, which returns `latest_replies` for each thread in the `/catalog.json` response, `jschan` provides a separate API for getting a paginated list of threads on a board, and that API responds with latest `replies` for each thread.

The issue with that approach is that on a high-loaded imageboard like `4chan.org`, new threads appear quickly and old threads get bumped-out, so by the time the user requests the second page, all pages have already shifted and the user will no longer see the full list of threads on a board: by the time they scroll to the second page, the ones that have been on the second/third/etc page have already been bumped to the first page so the user won't see them because they won't be re-fetching the prevous pages.

The only simple solution to the issue seems to be the `4chan.org`'s way.

### Doesn't output total page count in paginated threads response

When requesting a page of threads on a board using URL like `/{boardId}/{page}.json`, it doesn't tell the total number of pages available, so the application doesn't know how much `{page}`s can it fetch from the server and at which `{page}` should it stop.

### Doesn't return "block bypass" expiration date

When creating a "block bypass", it sets a cookie called `bypass` with some expiration date. But there's no way for a web-browser application to read that expiration date because it can only read the cookie's value from `document.cookie` and that's it. So the backend should also set some kind of a `bypassExpiresAt` cookie. Or, better, it should return a proper JSON response containing both the bypass token and its expiration date.

### Doesn't return CAPTCHA expiration date

When requesting a CAPTCHA, it sets a cookie called `captchaid` with some expiration date. But there's no way for a web-browser application to read that expiration date because it can only read the cookie's value from `document.cookie` and that's it. So the backend should also set some kind of a `captchaExpiresAt` cookie. Or, better, it should return a proper JSON response containing both CAPTCHA ID and CAPTCHA expiration date.