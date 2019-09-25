# Attachments

See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md) for more details.

## Picture

```js
{
	type: "picture",
	spoiler: boolean?,
	// (see "Picture" section for more details)
	picture: Picture
}
```

* `spoiler` is for cases when a picture contains a possible "spoiler" which makes it appear blurred until the user clicks on it.

* See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md#picture) for more details on `Picture`.

## Video

```js
{
	type: "video",
	spoiler: boolean?,
	// (see "Video" section for more details)
	video: Video
}
```

* `spoiler` is for cases when a video contains a possible "spoiler" which makes it appear blurred until the user clicks on it.

* See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md#video) for more details on `Video`.

## Audio

```js
{
	type: "audio",
	audio: Audio
}
```

* See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md#audio) for more details on `Audio`.

## File

```js
{
	type: "file",
	file: File
}
```

* See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md#file) for more details on `File`.

## Social

Embedded tweets, etc.

```js
{
	type: "social",
	social: Social
}
```

* See [`Post Content Types`](https://github.com/catamphetamine/social-components/tree/master/docs/Post/PostContentTypes.md#social) for more details on `Social`.
