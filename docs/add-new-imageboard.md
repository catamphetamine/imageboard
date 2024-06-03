# Adding a new imageboard

To add a new imageboard:

* Create the imageboard's folder in `./chans` directory.
  * Create `index.json` file in that folder. See other imageboards as an example. See [Imageboard config](#imageboard-config) for the explanation of the `index.json` file format.
  * An `index.json.js` file will be automatically created from `index.json` file at the "build" step, so there's no need to created it by hand.
* Create the imageboard's folder in `./lib/chan` directory.
  * Create `index.js` file in that folder. See other imageboards as an example.
* Open `./lib/chans/getConfig.js` file and add the new imageboard to the list.
* Open `./lib/chans/index.js` file and add the new imageboard to the list.

The next steps depend on whether the imageboard uses an already supported engine or a new one.

### New engine

For a new engine, follow the instructions in [`docs/add-new-engine.md`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/add-new-engine.md) to add the support for the new engine. After the new engine support has been added, see [Existing engine](#existing-section) section.

### Existing engine

If the imageboard runs on an already supported engine, no additional setup is required.

#### Testing

Test the new imageboard:

```
npm run build
npm run test-chan <imageboard-id>
```

#### Comment HTML markup syntax

In some rare cases, an imageboard might have its own "custom" comment HTML syntax which could be different from the other imageboards running on the same engine. For example, that's the case with `4chan`-alike imageboards. In such case, go to the engine's directory — `./lib/engine/<engine.id>` — and edit `index.js` file of the engine to instruct it to use a different set of [comment markup syntax](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/add-new-engine.md#comment-markup-syntax) plugins specific to the new imageboard when passing a `parseCommentContentPlugins` parameter to the `super()` constructor. To differentiate between different imageboards that use the same engine, one could use the `imageboardConfig.id` parameter that is available in the `constructor()` of the class. For an example, see how it's done in `./lib/engine/4chan/index.js`.

## Imageboard config

See [`./types/ImageboardConfig.d.ts`](https://gitlab.com/catamphetamine/imageboard/-/blob/master/types/ImageboardConfig.d.ts) file for the full and up-to-date description of the "imageboard config" structure.

```js
{
  // (required)
  // Imageboard unique ID.
  "id": "4chan",

  // (required)
  // Imageboard website domain name.
  "domain": "4chan.org",

  // (required)
  // The engine the imageboard runs on.
  // Must be supported out-of-the-box (see the list of supported engines).
  "engine": "vichan",

  // (optional)
  // Boards list.
  // Some smaller older imageboards don't provide a "get boards list" API.
  // For such imageboards the boards list is "hardcoded" in the config.
  "boards": [
    {
      // (required)
      // Board ID.
      "id": "λ",

      // (required)
      // Board title.
      "title": "Programming",

      // (optional)
      // Board category.
      // Can be used to display boards grouped by category.
      "category": "Technology"
    },
    ...
  ],

  // (required)
  // See `./types/ImageboardConfig.d.ts` for the specification of the `api` configuration.
  "api": {
    // "Get boards list" API.
    "getBoards": {
      "method": "GET",
      "url": "/boards.json"
    },

    // "Get top boards list" API.
    "getTopBoards": {
      "method": "GET",
      "url": "/boards-top20.json"
    },

    // "Get threads list" API.
    "getThreads": {
      "method": "GET",
      "url": "/{boardId}/catalog.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // "Get thread comments" API.
    "getThread": {
      "method": "GET",
      "url": "/{boardId}/res/{threadId}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "threadId" }]
    },

    ...
  },

  // (required)
  // A template for a board URL.
  // Isn't used anywhere in this library,
  // but third party applications like `anychan`
  // might use it to generate a link to the "original" board.
  "boardUrl": "/{boardId}",

  // (required)
  // A template for a thread URL.
  // Isn't used anywhere in this library,
  // but third party applications like `anychan`
  // might use it to generate a link to the "original" thread.
  "threadUrl": "/{boardId}/res/{threadId}.html",

  // (required)
  // A template for a comment URL.
  // Is used when parsing links to other comments in comment HTML.
  "commentUrl": "/{boardId}/res/{threadId}.html#{commentId}",

  // (optional)
  // Attachment URL template.
  // Is required for imageboard engines that don't
  // provide the full attachment URL (`vichan`)
  // or for imageboards that host attachments on another domain
  // (`4chan` hosts attachments at `https://i.4cdn.org`).
  // Available parameters are:
  // * boardId — Board ID ("b", etc).
  // * name — Attachment filename on server.
  // * originalName — Original attachment filename, is used for non-image file attachments.
  // * ext — "." character plus attachment file extension.
  "attachmentUrl": "https://i.4cdn.org/{boardId}/{name}{ext}",

  // (optional)
  // Attachment thumbnail URL pattern.
  // Same as "attachmentUrl" but for thumbnails.
  "attachmentThumbnailUrl": "https://i.4cdn.org/{boardId}/{name}s.jpg",

  // (optional)
  // Most imageboards set author name to some default placeholder
  // like "Anonymous" when no author name has been input.
  // The parser then checks if author name is equal to the
  // "defaultAuthorName" and if it is then it leaves the `authorName` blank.
  // Can be a string or an object of shape `{ boardId: defaultAuthorName }`.
  "defaultAuthorName": "Anonymous",
  //
  // or on a per-board basis:
  // "defaultAuthorName": {
  //  "*": "Anonymous",
  //  "ru": "Аноним",
  //  "christan": "Christanon"
  // }

  ...
}
```