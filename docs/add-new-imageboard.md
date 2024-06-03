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
  // Must be supported out-of-the-box (see the `./engine` directory).
  // Supported engines:
  // * `"4chan"`
  // * `"vichan"`
  // * `"OpenIB"`
  // * `"lynxchan"`
  // * `"makaba"`
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
  "api": {
    // (required if there's no "boards" config parameter)
    // "Get boards list" API URL.
    "getBoards": {
      "method": "GET",
      "url": "/boards-top20.json"
    },

    // (optional)
    // "Find boards by a query" API URL.
    // `8ch.net (8kun.top)` has about `20,000` boards total,
    // so "getBoards()" API only returns top 20 of them,
    // while "findBoards('')" API returns all `20,000` of them.
    "findBoards": {
      "method": "GET",
      "url": "/boards.json"
    },

    // (required)
    // "Get threads list" API URL template.
    "getThreads": {
      "method": "GET",
      "url": "/{boardId}/catalog.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list including their latest comments" API URL template.
    "getThreadsWithLatestComments": {
      "method": "GET",
      "url": "https://a.4cdn.org/{boardId}/catalog.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list (first page) including their latest comments" API URL template.
    "getThreadsWithLatestCommentsFirstPage": {
      "method": "GET",
      "url": "/{boardId}/index.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (optional)
    // "Get threads list (N-th page) including their latest comments" API URL template.
    // Available parameters for the page: `pageIndex`, `page` (= `pageIndex` + 1).
    "getThreadsWithLatestCommentsPage": {
      "method": "GET",
      "url": "/{boardId}/{pageIndex}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "pageIndex" }]
    },

    // (optional)
    // "Get threads stats" API URL template.
    "getThreadsStats": {
      "method": "GET",
      "url": "/{boardId}/threads.json",
      "urlParameters": [{ "name": "boardId" }]
    },

    // (required)
    // "Get thread comments" API URL template.
    "getThread": {
      "method": "GET",
      "url": "/{boardId}/res/{threadId}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "threadId" }]
    },

    // (optional)
    // "Get archived thread comments" API URL template.
    // Some engines (like `4chan`) use the same URLs
    // for both ongoing and archived threads.
    // Some engines (like `makaba`) use different URLs
    // for ongoing and archived threads.
    "getArchivedThread": {
      "method": "GET",
      "url": "/{boardId}/arch/res/{threadId}.json",
      "urlParameters": [{ "name": "boardId" }, { "name": "threadId" }]
    }
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
  // Imageboards usually store images/videos under random-generated filenames
  // and all other files under their original filename,
  // hence the separate "fileAttachmentUrl" parameter.
  "fileAttachmentUrl": "https://i.4cdn.org/{boardId}/{originalName}{ext}",

  // (is only required by `8ch.net (8kun.top)`)
  // `8ch.net (8kun.top)` has `fpath: 0/1` parameter for attachments:
  // `fpath: 1` attachments are hosted at the global
  // board-agnostic URLs (not having `{boardId}` as part of their URL)
  // and all other attachments are hosted at board-specific URLs.
  "attachmentUrlFpath": "https://media.128ducks.com/file_store/{name}{ext}",

  // (is only required by `8ch.net (8kun.top)`)
  // Attachment thumbnail URL pattern for `fpath: 1` attachments.
  // Same as "attachmentUrlFpath" but for thumbnails.
  "attachmentThumbnailUrlFpath": "https://media.128ducks.com/file_store/{name}{ext}",

  // (optional)
  // Most imageboards set author name to some default placeholder
  // like "Anonymous" when no author name has been input.
  // The parser then checks if author name is equal to the
  // "defaultAuthorName" and if it is then it leaves the `authorName` blank.
  // Can be a string or an object of shape `{ boardId: defaultAuthorName }`.
  "defaultAuthorName": "Anonymous",
  // or on a per-board basis:
  // "defaultAuthorName": {
  //  "*": "Anonymous",
  //  "ru": "Аноним",
  //  "christan": "Christanon"
  // }

  // (required for `lynxchan`)
  // Thumbnail size. Is required for `lynxchan`.
  // `lynxchan` engine currently has a bug:
  // it doesn't provide thumbnail dimensions.
  // To work around that bug, thumbnail dimensions
  // are derived from the original image aspect ratio.
  "thumbnailSize": 255
}
```