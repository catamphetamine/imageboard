# makaba

While adding support for `2ch.hk` some very minor bugs have been discovered in the `makaba` engine (as of September 2022).

* Incorrect `posts_count` property in "get threads page" API response: doesn't include the original comment of the thread.

* (feature) Doesn't provide an API to get a list of threads with latest comments. For example, there is `catalog.json` API that provides a list of threads but that list doesn't contain the latest comments. They could create a new API `catalog-comments.json` that would be same as `catalog.json` but would include a few latest comments for each thread.

* (has a hacky workaround) A request to get an archived thread's JSON results in a `404 Not Found` error. Example: `https://2ch.hk/b/res/119034529.json`. The code manually detects such "Not found" errors to resend the request to get the archived thread's JSON with the `/arch/` URL prefix. Example: `https://2ch.hk/b/arch/res/119034529.json`. This URL gets redirected to something like: `https://2ch.hk/b/arch/2016-03-06/res/119034529.json`. Then, the code employs another hack to get the "final" URL (after the redirect), and then it extracts the `2016-03-06` date from it. Aside from being the general info, the archived date is also required in order to transform relative image URLs to absolute ones for really old threads between March 6th, 2016 and November 12th, 2016. Example: `thumb/119034529/14572604256670s.jpg` -> `https://2ch.hk/b/arch/2016-03-06/thumb/119034529/14572604256670s.jpg`.