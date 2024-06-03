# Board

```js
{
  // Board ID.
  // Example: "b".
  id: string,

  // Board title.
  // Example: "Anime & Manga".
  title: string,

  // Board description.
  description: string?,

  // Board category.
  category: string?,

  // Is this board "Not Safe For Work".
  notSafeForWork: boolean?,

  // "Bump limit" for threads on this board.
  bumpLimit: number?,

  // "Comments posted per hour" stats for this board.
  commentsPerHour: number?,

  // "Comments posted per day" stats for this board.
  commentsPerDay: number?,

  // "Unique comment posters per day" stats for this board.
  uniquePostersPerDay: number?,

  // Allowed attachment types.
  attachmentTypes: string[]?,

  // The maximum attachments count in a comment or when posting a new thread.
  // Only present for 4chan.org
  attachmentsMaxCount: number?,

  // The maximum overall attachments count in a thread.
  // Only present for 4chan.org
  threadAttachmentsMaxCount: number?,

  // Minimum comment length on the board (a board-wide setting).
  // Is used in `jschan`.
  commentContentMinLength: number?,

  // Maximum comment length on the board (a board-wide setting).
  // Only present for `4chan.org`.
  // `2ch.hk` also has it but doesn't return it as part of the `/boards.json` response.
  commentContentMaxLength: number?,

  // Minimum comment length when creating a thread on the board (a board-wide setting).
  // Is used in `jschan`.
  mainCommentContentMinLength: number?,

  // Maximum comment length when creating a thread on the board (a board-wide setting).
  // Is used in `jschan`.
  mainCommentContentMaxLength: number?,

  // Whether thread title is required when creating it.
  // Is used in `jschan`.
  threadTitleRequired: boolean?,

  // Whether comment text is required when creating a thread.
  // Is used in `jschan`.
  mainCommentContentRequired: boolean?,

  // Whether comment attachments are required when creating a thread.
  // Is used in `jschan`.
  mainCommentAttachmentRequired: boolean?,

  // Maximum attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  attachmentMaxSize: number?,

  // Maximum total attachments size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org` or `2ch.hk`.
  attachmentsMaxTotalSize: number?,

  // Maximum video attachment size in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  videoAttachmentMaxSize: number?,

  // Maximum video attachment duration (in seconds) in a thread on the board (a board-wide setting).
  // Only present for `4chan.org`.
  videoAttachmentMaxDuration: number?,

  // Create new thread cooldown.
  // Only present for `4chan.org`.
  createThreadMinInterval: number?,

  // Post new comment cooldown.
  // Only present for `4chan.org`.
  createCommentMinInterval: number?,

  // Post new comment with an attachment cooldown.
  // Only present for `4chan.org`.
  createCommentWithAttachmentMinInterval: number?,

  // The language that's used on the board.
  // For example, `kohlchan.net` has a separate `/ru/` board for Russian-speaking users.
  language: string?,

  // An array of "badges" (like country flags but not country flags)
  // that can be used when posting a new reply or creating a new thread.
  // Each "badge" has an `id` and a `title`.
  badges: object[]?,

  // Default comment author name (when left blank).
  defaultAuthorName: string?,

  // The "features" supported or not supported on this board.
  features: {
    // Whether "sage" is allowed when posting comments on this board.
    // Is used in `4chan.org`.
    sage: boolean?,

    // Whether to show a "Name" field in a "post new comment" form on this board.
    // Is used in `2ch.hk` and `jschan`.
    authorName: boolean?,

    // Whether to show an "Email" field in a "post new comment" form on this board.
    // Is used in `jschan`.
    authorEmail: boolean?,

    // Whether the board has custom badges.
    // Is used in `jschan`.
    badges: boolean?,

    // Whether the board allows specifying a title when creating a thread.
    // Is used in `jschan`.
    threadTitle: boolean?,

    // Whether the board allows specifying a title when posting a comment.
    // Is used in `jschan`.
    commentTitle: boolean?
  }
}
```