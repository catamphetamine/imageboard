export * from './types/index.d.js';

// For some weird reason, TypeScript doesn't seem to know how to properly re-export `default`
// as part of the `export * from` statement above.
import { default as Imageboard } from './types/index.d.js';
export default Imageboard;