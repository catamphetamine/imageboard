0.11.5 / 08.06.2024
==================

* Board
  * `board.features.sage` → `board.features.authorEmailSage`
  * `board.features.votes` → `board.features.commentRating`
  * `board.badges` → `board.authorBadges`
  * `board.notSafeForWork` → `board.explicitContent`
  * `board.commentsPerHour` → `board.stats.commentsPerHour`
  * `board.commentsPerDay` → `board.stats.commentsPerDay`
  * `board.uniquePostersPerDay` → `board.stats.uniquePostersPerDay`
  * `board.attachmentTypes` → `board.post.attachmentTypes`
  * `board.attachmentTypes`: `"imageAnimated"` → `"image:animated"`
  * `board.commentContentMinLength` → `board.post.contentMinLength`
  * `board.commentContentMaxLength` → `board.post.contentMaxLength`
  * `board.mainCommentContentMinLength` → `board.post.mainCommentContentMinLength`
  * `board.mainCommentContentMaxLength` → `board.post.mainCommentContentMaxLength`
  * `board.attachmentTypes` → `board.post.attachmentFileTypes`
  * Added `board.attachmentFileTypes`
  * `board.attachmentMaxSize` → `board.post.attachmentMaxSize`
  * `board.attachmentsMaxTotalSize` → `board.post.attachmentsMaxSize`
  * `board.attachmentsMaxCount` → `board.post.attachmentsMaxCount`

  * `board.bumpLimit` → `board.features.bumpLimit`

  * `board.mainCommentContentRequired` → `board.post.mainCommentContentRequired`
  * `board.mainCommentAttachmentsRequired` → `board.post.mainCommentAttachmentsRequired`

  * `board.features.threadTitle` → `board.post.threadTitle`
  * `board.features.commentTitle` → `board.post.commentTitle`

  * `board.features.authorName` → `board.post.authorName`
  * `board.features.authorEmail` → `board.post.authorEmail`
  * `board.features.authorEmailSage` → `board.post.authorEmailSage`
  * `board.features.authorTripCode` → `board.post.authorTripCode`
  * `board.features.commentAttachments` → `board.post.commentAttachments`
  * `board.features.threadAttachments` → `board.post.threadAttachments`
  * `board.features.threadAttachmentsRequired` → `board.post.threadAttachmentsRequired`

  * `board.threadTitleRequired` → `board.post.threadTitleRequired`

  * `board.videoAttachmentMaxSize` → `board.post.videoAttachmentMaxSize`
  * `board.videoAttachmentMaxDuration` → `board.post.videoAttachmentMaxDuration`

  * `board.createThreadMinInterval` → `board.post.threadMinInterval`
  * `board.createCommentMinInterval` → `board.post.commentMinInterval`
  * `board.createCommentWithAttachmentMinInterval` → `board.post.commentWithAttachmentsMinInterval`

  * `board.threadAttachmentsMaxCount` → `board.post.threadAttachmentsMaxCount`

  * `board.defaultAuthorName` → `board.features.defaultAuthorName`

  * `board.badges` → `board.post.authorIcons`
  * `BoardBadge` → `CommentAuthorIcon`

  * Added `board.attachmentFileExtensions`
  * Removed `commentTitle` concept from `Board` type — only a `Thread` could have a `title`.

* Thread
  * `thread.attachmentLimitReached` → `thread.attachmentsMaxCountLimitReached`

* Comment
  * `comment.authorBadgeUrl` → `comment.authorIconUrl`
  * `comment.authorBadgeName` → `comment.authorIconName`
  * `comment.authorBan` → `{ reason?: ... }`

* `ImageboardConfig`
  * `authorBadgeUrl` → `authorIconUrl`
  * `ImageboardConfig.captchaRules` → `board.post.captchaRequired` / `board.post.threadCaptchaRequired`
  * `ImageboardConfig.domainByBoard`: `"notSafeForWork"` → `"<nsfw>"`

* `postLink.meta.isRootComment` → `postLink.meta.isMainComment`

0.11.0 / 02.06.2024
==================

* (breaking change) Renamed `afterCommentsCount` parameter to `afterCommentNumber`.
* (breaking change) Changed the arguments of the `request()` function: it's now a single `parameters` object.
* (breaking change) Renamed `request()` parameter to `sendHttpRequest()`.
* (breaking change) (TypeScript) Renamed `HttpRequestError` to `HttpResponseError`.
* (breaking change) Renamed `"getThreads.sortByRating"` feature to `"getThreads.sortByRatingDesc"`.
* (breaking change) Renamed `sortByRating?: boolean` parameter to `sortBy?: 'rating-desc`.
* (breaking change) Renamed `generated: boolean` parameter of `post-link` to `contentGenerated: boolean`.
* (breaking change) Renamed `voteForComment()` to `rateComment()`.
* (breaking change) Changed the internal structure of `post-link`s. Added `meta` object property.
  * `postId` → `meta.commentId`
  * `threadId` → `meta.threadId`
  * `boardId` → `meta.boardId`
  * `postIsRoot` → removed
  * `postWasDeleted` → `meta.isDeleted`
  * `postIsExternal` → `meta.isAnotherThread`
* Renamed parameter: `latestCommentLengthLimit` → `commentLengthLimitForWithLatestComments`.
* Renamed parameter: `maxLatestCommentsPages` → `withLatestCommentsMaxPages`.
* There's no requirement to pass a custom `request()` function implementation now: the library now exports a `createHttpRequestFunction()` function that could be used to easily create one. See the readme for more details.

0.10.0 / 01.06.2024
==================

* (breaking change) Changed the arguments of functions: `findBoards()`, `getThreads()`, `getThread()`.

0.9.0 / 27.04.2024
==================

* Changed the return type of `getAllBoards()` / `getBoards()` / `getThreads()` / `getThread()` APIs: now they return an object. In that object, `getThreads()` / `getThread()` APIs now return an optional `board` info sub-object.

* Renamed `all: true/false` parameter of `getBoards()` function to `limit: false/true`.

* Split `comment.inReplyTo` property into two:
  * `comment.inReplyToIds?: CommentId[]`
  * `comment.inReplyToIdsRemoved?: CommentId[]`
  * `comment.inReplyTo?: Comment[]`

* Split `comment.replies` property into two:
  * `comment.replyIds?: CommentId[]`
  * `comment.replies?: Comment[]`

* Renamed some functions:
  * `getAllBoards()` → `getBoards()`
  * `getBoards({ all: false })` → `getTopBoards()`
  * `hasMoreBoards()` → `supportsFeature('getTopBoards')`
  * `findBoards()` → `supportsFeature('findBoards')`

0.6.32 / 31.05.2023
==================

* Renamed `onTop` → `pinned`, `onTopOrder` → `pinnedOrder`.

0.6.0 / 14.12.2022
==================

* Moved latest comments from `thread.comments` to `thread.latestComments`.

0.5.0 / 12.09.2022
==================

* Changed package exports to "ES Modules".

* Refactored some code.

* Added some new features.

* Renamed `isArchived` parameter of `getThread()` to `archived`.

* Renamed some properties of `Thread`:
  * `isSticky` → `onTop`, with an optional `onTopOrder: number` (ex. `makaba` engine)
  * `isRolling` → `trimming`
  * `isArchived` → `archived`
  * `isLocked` → `locked`
  * `isBumpLimitReached` → `bumpLimitReached`
  * `isAttachmentLimitReached` → `attachmentLimitReached`

* Renamed some properties of `Board`:
  * `areSubjectsAllowed` → `features.subject`
  * `areAttachmentsAllowed` → `features.attachments`
  * `areTagsAllowed` → `features.tags`
  * `hasVoting` → `features.votes`
  * `isSageAllowed` → `features.sage`
  * `areNamesAllowed` → `features.authorName`
  * `isTextOnly: true` → `features.attachments: false`
  * `forceAnonymity: true` → `features.authorName: false`
  * `isNotSafeForWork` → `notSafeForWork`
  * `usesShiftJISArt` → `features.shiftJISArt`
  * `usesCodeTags` → `features.codeTag`
  * `usesOekaki` → `features.oekaki`
  * `usesMath` → `features.math`

* Renamed some properties of `Comment`:
	* `isThreadAuthor` → `authorIsThreadAuthor`
	* `isSage` → `sage`

0.4.38 / 16.05.2021
==================

* `commentsCount` and `attachmentsCount` now include the "original" ("opening" / "main") comment of a thread.

* Added `withLatestComments` and `maxLatestCommentsPages` options to `getThreads()`.

* Added a "get boards list" API method on `lynxchan`.

* Added `lynxchan` API description.

0.4.37 / 04.05.2021
==================

* Updated `makaba` engine: new voting API response.

* Updated `4chan` engine to use the new ["Board Flags"](https://github.com/4chan/4chan-API/commit/d095a7af76d0a5a48e3008fb9a05e5b3bbb6c2bb) feature.

* Updated engine docs: `4chan`, `makaba`.

* Refactored voting API code.

* Added some basic posting API code (not tested).

0.4.35 / 08.04.2021
==================

* Added archived thread support in `makaba` engine.

* (miscellaneous) (advanced) The `request()` function, when throwing an error, should set the `.status` property of that error to the HTTP Response status code. The rationale is that the error status code is compared to `404` in `makaba` engine during `getThread()` call to determine whether it should look for the thread in the archive.

0.4.22 / 08.08.2020
==================

* Added `generatedQuoteNewLineCharacterLength: number?` option.

0.4.21 / 06.08.2020
==================

* Renamed `setInReplyToQuotes` to `setPostLinkQuotes`.

0.4.20 / 05.08.2020
==================

* Fixed `lynxchan` bug: `file.originalName` isn't present in `catalog.json` API response.

0.4.19 / 05.08.2020
==================

* Fixed `makaba` voting API url.

0.4.18 / 23.03.2020
==================

* Fixed LynxChan parser replacing all `\n`-s with `<br>`s in `<code>` and `<span class="aa">`.

* Fixed Kohlchan multiline `<code>`.

0.4.17 / 22.03.2020
==================

* Fixed LynxChan 2.3 replacing all `<br>`s with `\n`-s.

0.4.0 / 27.12.2019
==================

* Removed exports: `generateQuotes()`, `generatePreview()`, `generateThreadTitle()`, `setInReplyToQuotes()`.

* Added `addParseContent: boolean` option.

0.3.0 / 16.12.2019
==================

* (breaking change) Changed `request()` arguments. Previous: `request(method, url, data)`. New: `request(method, url, { body, headers })`.

0.2.0 / 10.12.2019
==================

* (breaking change) Renamed `commentAttachmentsCount` -> `attachmentsCount`: now it's supposed to include the "opening post" attachments too.

* `expandReplies: true` option now also transforms `comment.inReplyTo[]` from a list of comment ids to a list of comments.

0.1.10 / 01.12.2019
===================

* Added ["verified"](https://github.com/4chan/4chan-API/issues/76) capcode halding on `4chan.org` via the new `authorVerified: boolean?` property of a comment.

0.1.8 / 03.10.2019
===================

* (small breaking change) Renamed `authorRoleDomain` to `authorRoleScope`.

* Moved role `capcode`s to chan config files.

0.1.6 / 30.09.2019
===================

* (small breaking change) The format of `messages` changed: it now has two child objects — `comment` and `contentType`. See the README.

0.1.5 / 29.09.2019
===================

* (breaking change) `commentUrlParser` setting of an imageboard `*.json` file replaced with `commentUrl` template having `{boardId}`, `{threadId}` and `{commentId}`.

0.1.4 / 29.09.2019
===================

* If `post-link`'s `content` is autogenerated then it contains `quote`s. Previously those quotes weren't separated by `\n`s. Now they are.

0.1.3 / 29.09.2019
===================

* `quoteAutogenerated: boolean` flag of `type: "post-link"` content block was replaced with `generated: boolean` flag on each `type: "quote"` of `type: "post-link"` block's `content`.

* Renamed `skipAutogeneratedPostQuotes: boolean` option of `getCommentText()` to `skipGeneratedPostQuotes: boolean`.

0.1.0 / 25.09.2019
===================

* Initial release.
