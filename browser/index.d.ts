import {
	Imageboard,
	ImageboardId,
	ImageboardConfig,
	ImageboardOptions
} from '../index.d.js'

declare function Imageboard(imageboardIdOrConfig: ImageboardId | ImageboardConfig, options?: ImageboardOptions): Imageboard;

export default Imageboard;
