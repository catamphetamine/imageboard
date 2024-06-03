# Adding a new engine

To add a new imageboard engine:

* Create the new engine's folder in `./lib/engine` directory: `./lib/engine/<engine.id>`.
* Create an `index.js` file in the `./lib/engine/<engine.id>` folder. The file should export an [engine implementation](#engine-implementation) class. That would also involve creating a file with the "settings" for the engine at `./lib/engine/<engine.id>/settings.json` path.
* Open `./lib/engine/index.js` file and add the new engine to the list.
* Open `./lib/engine/getConfig.js` file and add the new engine to the list.

In case of any questions, see other engines as an example.

## Engine implementation

An "engine implementation" is a javascript class that extends `./lib/Engine.js` base class and sits at `./lib/engine/<engine.id>/index.js` path.

The implementation class must implement a pre-defined set of functions for interfacing with the engine's API. Each such function receives two arguments — `response` data and `options` object — and is expected to return a result in a certain format. Basically, an "engine implementation" class acts as a translator from the engine's API output format to the `imageboard` package output format.

The functions are:

* `parseBoards()` or `parseBoardsPage()`, depending on whether the engine returns the list of boards all at once or paginated — Returns a list of `Board` objects.
* `parseThreads()` — Returns a list of `Thread` objects.
* `parseThread()` — Returns a `Thread` object.
* `parseComment()` — Returns a `Comment` object.
* Other functions are optional. See existing engines as an example.

In order to parse `Comment` objects from the API output, it must describe the [comment markup syntax](#comment-markup-syntax) specific to the engine. For example, if the engine uses HTML for comments content, the code must pass a list of [comment markup syntax](#comment-markup-syntax) definitions in the form of a `parseCommentContentPlugins` parameter to the `super()` constructor inside the class `constructor()`.

That was for the output of the API, but what about the input of the API? The input part is configured in a separate "engine settings" file at `./lib/engine/<engine-id>/settings.json` path. That file defines any default "settings" for the engine that the `imageboard` package could use, such as `attachmentUrl`, `attachmentThumbnailUrl`, etc. A given imageboard can replace any of those settings in its own `settings.json` file, if required.

In addition to defining the default parameters for the engine, the "engine settings" file describes the input of the engine's API under the `api` key: there, it describes how `imageboard` package input format should be translated into the engine's API input format.

The keys of an `api` definition object should be pre-defined API method names such as `getBoards` or `getBoardsPage`, `getThreads`, `getThread`, etc. See the `settings.json` files of the existing engines as an example, or refer to the `index.json` files of specific imageboards in the `./chans` folder. In general, each value of the `api` definition object should be an object with properties:

* `method` — The method of the HTTP request: `"GET"`, `"POST"`, etc.
* `url` — The URL of the HTTP request. Can contain "parameters" in curly braces.
* `urlParameters?: object[]` — If the `url` contains any "parameters", this should be a list of objects defining those "parameters":
  * `name: string` — The parameter name.
  * `input?: object` — Describes where to get the parameter value from.
  * `defaultValue?: string` — An optional default value for the parameter.
  * For the complete set of properties, see `ImageboardConfigApiMethod` type in `./types/ImageboardConfig.d.ts` file.
* `cookies?: object[]` — An optional array of cookie values to send as part of the HTTP request.
  * The structure is the same as for `urlParameters`.
* `parameters?: object[]` — For `GET` HTTP requests, these're URL query parameters. For `POST` HTTP requests, these're body parameters.
  * The structure is the same as for `urlParameters`.
* `requestType?: string` — HTTP request type. Default is `application/json`.
* `responseType?: string` — HTTP response type. Default is `application/json`.

## Comment markup syntax

Imageboard comments are originally formatted in HTML, so they're parsed into a tree structure using [`social-components-parser`](https://gitlab.com/catamphetamine/social-components-parser). Different imageboards use their own comment HTML syntax. For example, bold text could be `<strong>bold</strong>` at some imageboards, `<b>bold</b>` at other imageboards and `<span class="bold">bold</span>` at the other imageboards, even if they all used the same engine. Hence, every imageboard requires defining their own "comment markup syntax" in `./src/imageboard/engine/${engine}` directory.

"Comment markup syntax" is a list of "content element type" descriptors.

A "content element type" descriptor is an object having properties:

* `tag: String` — HTML tag (in lower case).
* `attributes: object[]?` — A set of HTML tag attribute filters. An attribute filter is an object of shape `{ name: String, value: String }`.
* `createElement(content: PostContent, node, options): PostContent?` — Receives child `content` and wraps it in a parent content element (see [Post Content](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md) docs). Can return `undefined`. Can return a string, an object or an array of strings or objects. `node` is the DOM `Node` and provides methods like `getAttribute(name: String)`. `options` is an object providing some configuration options like `commentUrl` template for parsing comment links (`<a href="/b/123#456">&gt;&gt;456</a>`).

Example:

```html
<strong>bold <span class="italic">text</span></strong>
```

Plugins:

```js
const parseBold = {
  tag: 'strong',
  createElement(content) {
    return {
      type: 'text',
      style: 'bold',
      content
    }
  }
}

const parseItalic = {
  tag: 'span',
  attributes: [{
    name: 'class',
    value: 'italic'
  }],
  createElement(content) {
    return {
      type: 'text',
      style: 'italic',
      content
    }
  }
}

export default [
  parseBold,
  parseItalic
]
```

Result:

```js
[
  [
    {
      type: 'text',
      style: 'bold',
      content: [
        'bold ',
        {
          type: 'text',
          style: 'italic',
          content: 'text'
        }
      ]
    }
  ]
]
```
