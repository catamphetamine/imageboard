// Stupid Node.js can't even `import` JSON files.
// https://stackoverflow.com/questions/72348042/typeerror-err-unknown-file-extension-unknown-file-extension-json-for-node
// Using a `*.json.js` duplicate file workaround.

import fs from 'fs'

for (const child of fs.readdirSync('./chans', { withFileTypes: true })) {
	if (!child.isFile()) {
		const chanId = child.name
		const json = fs.readFileSync(`./chans/${chanId}/index.json`, 'utf8')
		fs.writeFileSync(`./chans/${chanId}/index.json.js`, 'export default ' + json, 'utf8')
	}
}