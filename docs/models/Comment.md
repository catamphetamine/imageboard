# Comment

See [`./types/Comment.d.ts`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/types/Comment.d.ts) for the most up-to-date description of the `Comment` structure.

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