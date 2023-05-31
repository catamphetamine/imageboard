import getThreadRating from './getThreadRating.js'

/**
 * Sort threads by rating. Mutates the original array.
 * @param  {object} [options.threadsStats] — Threads stats index, each "stat" being an object having a `rating: number` property.
 * @return {Thread[]}
 */
export default function sortThreadsByRating(threads, { threadsStats }) {
	return threads.sort((a, b) => {
		// If `b`'s rating is heigher than `a`'s
		// then `b` goes before `a` in the list.
		return getThreadRating(b, { threadsStats }) - getThreadRating(a, { threadsStats })
	})
}