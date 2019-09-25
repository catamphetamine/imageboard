# Content types

Content can not just be in textual form, it can also be a picture, a video, an audio, a social media post.

## Picture

```js
{
	// Picture MIME type. Example: "image/jpeg".
	type: string,

	// Picture width.
	width: number,

	// Picture height.
	height: number,

	// Picture file size (in bytes).
	size: number?,

	// Picture file URL.
	url: string,

	// `true` in case of an image with transparent background.
	transparentBackground: boolean?,

	// (optional)
	// Extra picture sizes (thumbnails).
	sizes: [
		{
			// Thumbnail MIME type.
			type: string,

			// Thumbnail width.
			width: number,

			// Thumbnail height.
			height: number,

			// Thumbnail file URL.
			url: string
		}
	]
}
```

## Video

Videos can be video files or videos provided by some service like YouTube. Video files require a `type` and a `url`. Videos provided by a service require a `provider` and an `id`.

```js
{
	// Video MIME type.
	// Is required if `url` is defined.
	// Example: "video/webm".
	type: string?,

	// Video file URL.
	// Either `url`/`type` or `provider`/`id` is required.
	url: string?,

	// Video provider.
	// Examples: "YouTube", "Vimeo".
	provider: string?,

	// Video ID.
	// Is required if `provider` is defined.
	// Example: "4oAZRMomBJ0".
	id: string?,

	// Video width.
	width: number?,

	// Video height.
	height: number?,

	// Video file size (in bytes).
	size: number?,

	// Video duration (in seconds).
	duration: number?,

	// Video thumbnail (poster).
	// (see "Picture" section for more details)
	picture: Picture
}
```

## Audio

```js
{
	// MIME-type.
	type: string?,

	// Audio file URL.
	url: string?

	// Audio file provider.
	// (Could be something like "SoundCloud").
	provider: string?

	// Audio file ID if `provider` is defined.
	// Example: "510788520".
	id: string?

	// `author` is optional even for `url` audio files.
	author: string?,

	// `title` is required for `url` audio files.
	title: string?
}
```

## File

```js
{
	// File MIME type.
	// Example: "application/pdf".
	type: string,

	// File name.
	// Example: "Report".
	name: string,

	// File extension with a dot.
	// Example: ".pdf".
	ext: string,

	// File size (in bytes).
	size: number,

	// File URL.
	url: string
}
```

## Social

```js
{
	// Social media.
	// Examples: "Twitter", "Instagram".
	provider: string,

	// Social media post URL.
	url: string?,

	// Social media post date.
	date: Date?,

	author: {
		// Social media author ID.
		// Example: "realdonaldtrump".
		id: string,

		// Author name.
		// Example: "Donald J. Trump".
		name: string?,

		// Author social media page.
		// Example: "https://twitter.com/realdonaldtrump".
		url: string,

		// Author's "user picture".
		picture: Picture?
	},

	// Social media post content.
	content: string?

	// Social media post attachments.
	// For example, for an Instagram post
	// that would be the picture attachment(s).
	attachments: Attachment[]?
}
```