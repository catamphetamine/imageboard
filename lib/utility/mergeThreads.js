export default function mergeThreads(threads1, threads2) {
	const threads = threads1.slice()
	for (const thread of threads2) {
		if (!threads.find(_ => _.id === thread.id)) {
			threads.push(thread)
		}
	}
	return threads
}