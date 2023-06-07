import sortThreadsWithPinnedOnTop from './sortThreadsWithPinnedOnTop.js'

describe('sortThreadsWithPinnedOnTop', function() {
	it('should sort threads with pinned ones on top', function() {
		const sortThreadsByDateDescending = (threads) => {
			return threads.sort((a, b) => {
				return b.createdAt.getTime() - a.createdAt.getTime()
			})
		}

		const threads = [
			{
				id: 3,
				createdAt: new Date('2020-05-01')
			},
			{
				id: 2,
				createdAt: new Date('2020-05-01'),
				pinned: true
			},
			{
				id: 8,
				createdAt: new Date('2020-07-01'),
				pinned: true
			},
			{
				id: 4,
				createdAt: new Date('2020-06-01')
			},
			{
				id: 7,
				createdAt: new Date('2020-07-01'),
				pinned: true,
				pinnedOrder: 10
			},
			{
				id: 6,
				createdAt: new Date('2020-07-01')
			},
			{
				id: 5,
				createdAt: new Date('2020-06-01'),
				pinned: true,
				pinnedOrder: 5
			},
			{
				id: 1,
				createdAt: new Date('2020-01-01')
			}
		]

		const sortedOrder = [5, 7, 8, 2, 6, 4, 3, 1]

		sortThreadsWithPinnedOnTop(threads, sortThreadsByDateDescending)
			.map(_ => _.id).should.deep.equal(sortedOrder)

		// Should mutate the original list.
		threads.map(_ => _.id).should.deep.equal(sortedOrder)
	})
})