import {
	ContentBlock,
	Attachment
} from 'social-components';

export type CommentId = number;

export interface Comment {
  // Comment ID.
	id: CommentId;

  // Comment title ("subject").
	title?: string;

  // The date on which the comment was created.
	createdAt: Date;

  // "Last Modified Date" of the comment.
  //
  // I guess it includes all possible comment "modification"
  // actions like editing comment text, deleting attachments, etc.
  // Is present on "modified" comments in "get thread comments"
  // API response of `lynxchan` engine.
  //
	updatedAt?: Date;

	// Tells if the comment author is the thread author.
	//
  // This feature is used on `2ch.hk` imageboard:
  // 2ch.hk` provides means for "original posters" to identify themselves
  // when replying in their own threads with a previously set "OP" cookie.
  //
	authorIsThreadAuthor?: boolean;

  // Some imageboards identify their users by a hash of their IP address subnet
  // on some of their boards (for example, all imageboards do that on `/pol/` boards).
  // On `8ch` and `lynxchan` it's a three-byte hex string (like "d1e8f1"),
  // on `4chan` it's a 8-character case-sensitive alphanumeric string (like "Bg9BS7Xl").
  //
  // Even when a thread uses `authorIds` for its comments, not all of them
  // might have it. For example, on `4chan`, users with "capcodes" (moderators, etc)
  // don't have an `authorId`.
  //
	authorId?: string;

  // If `authorId` is present then it's converted into a HEX color.
  // Example: "#c05a7f".
	authorIdColor?: string;

  // Comment author name.
	authorName?: string;

  // If this flag is `true` then it means that `authorName` is an equivalent of an `authorId`.
  // For example, `2ch.hk` autogenerates `authorName` based on IP address subnet hash on `/po` board.
	authorNameIsId?: boolean;

  // Comment author's email address.
	authorEmail?: string;

  // Comment author's "tripcode".
  // https://encyclopediadramatica.rs/Tripcode
	authorTripCode?: string;

  // A two-letter ISO country code (or "ZZ" for "Anonymized").
  // Imageboards usually show poster flags on `/int/` boards.
	authorCountry?: string;

	//
  // Some imageboards allow comment author icons on some boards.
  //
  // For example, `kohlchan.net` shows user icons on `/int/` board.
  // Author icon examples in this case: "UA", "RU-MOW", "TEXAS", "PROXYFAG", etc.
  // `authorIconUrl` is `/.static/flags/${authorIconId}.png`.
  // `authorIconName` examples in this case: "Ukraine", "Moscow", "Texas", "Proxy", etc.
  //
  // Also, `2ch.hk` allows icons for posts on various boards like `/po/`.
  // Author icon examples in this case: "nya", "liber", "comm", "libertar", etc.
  // `authorIconUrl` is `/icons/logos/${authorIconId}.png`.
  // `authorIconName` examples in this case: "Nya", "Либерализм", "Коммунизм", "Либертарианство", etc.
  //
	authorIconUrl?: string;
	authorIconName?: string;

  // If the comment was posted by a "priviliged" user
  // then it's gonna be the role of the comment author.
  // Examples: "administrator", "moderator".
	authorRole?: string;

  // `8ch.net (8kun.top)` and `lynxchan` have "global adiministrators"
  // and "board administrators", and "global moderators"
  // and "board moderators", so `authorRoleScope` is gonna be
  // "board" for a "board administrator" or "board moderator".
	authorRoleScope?: string;

  // If `true` then it means that the author was banned for the message.
	authorBan?: {
	  // An optional `String` with the ban reason.
		reason?: string
	};

  // If `true` then it means that the author has been verified
  // to be the one who they're claiming to be.
  // For example, `{ authorName: "Gabe Newell", authorVerified: true }`
  // would mean that that's real Gabe Newell posting in an "Ask Me Anything" thread.
  // It's the same as the "verified" checkmark on celebrities pages on social media like Twitter.
	authorVerified?: boolean;

  // If this comment was posted with a "sage".
  // https://knowyourmeme.com/memes/sage
	sage?: boolean;

  // Upvotes count for this comment.
  // If comment rating is enabled, `upvotes` could or could not be present.
	upvotes?: number;

  // Downvotes count for this comment.
  // If comment rating is enabled, `upvotes` could or could not be present.
	downvotes?: number;

  // Comment content.
  //
  // If `parseContent: false` option was passed then `content` will be
  // whatever was returned from the server (usually an HTML string or `undefined`).
  // Otherwise, the `content` is gonna be a `Content` structure (or `undefined`).
	// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md
	//
  // Example: `[['Comment text']]`.
  //
	content?: RawCommentContent | ParsedCommentContent;

  // If the `content` is too long a preview is generated.
	contentPreview?: ParsedCommentContent;

  // The IDs of the comments to which this `comment` replies.
  // If some of the replies have been deleted, their IDs will not be present in this list.
	inReplyToIds?: CommentId[];

  // If this `comment` replies to some other comments that have been deleted,
  // then this is gonna be the list of IDs of such deleted comments.
	inReplyToIdsRemoved?: CommentId[];

	// If there're `inReplyToIds` and `expandReplies: true` flag was passed,
	// this is going to be a list of the "in-reply-to" comments.
	inReplyTo?: Comment[];

  // The IDs of the comments that are replies to this `comment`.
	replyIds?: CommentId[];

	// If there're `replyIds` and `expandReplies: true` flag was passed,
	// this is going to be a list of the "reply" comments.
	replies?: Comment[];

  // Comment attachments.
	attachments?: Attachment[];

	// Parses `comment.content`, if it hasn't been parsed yet.
	// `comment.content` doesn't get parsed automatically when `parseContent: false` flag is passed.
	parseContent?: (options?: { getCommentById?: GetCommentById }) => void;

	// Creates `comment.contentPreview` property on the `comment` object, if required.
	// It might be required depending on the "max length" parameters set for comments.
	// `comment.contentPreview` is gonna be a shortened version of `comment.content`.
	createContentPreview?: (options?: { maxLength?: number }) => void;

	// Returns `true` if `comment.content` has been parsed.
	hasContentBeenParsed?: () => boolean;

	// An application should call this function whenever the `content` of the `Comment` changes.
	//
	// When could the `content` of a comment change? For example, when some resources
	// like YouTube video links from the `content` get "loaded" and auto-"embedded".
	//
	// This function will update any related stuff such as the autogenerated quotes in replies to this comment.
	//
	// This function returns an array of `id`s of the comments whose content got affected (and was updated).
	//
	onContentChange?: (options?: { getCommentById: GetCommentById }) => CommentId[];
}

export type RawCommentContent = string;

// This library always returns an array of content blocks when parsing a comment's content,
// even when it's just a single "block" of simple text like `[["Text"]]`.
// That's just how `social-components-parser` works.
//
// export type ParsedCommentContent = Content;
export type ParsedCommentContent = ContentBlock[];

export type GetCommentById = (id: CommentId) => Comment | undefined;