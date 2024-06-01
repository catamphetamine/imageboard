import parseBoardsResponse from './parseBoardsResponse.js'

describe('parseBoardsResponse', () => {
	it('should parse boards response', () => {
		parseBoardsResponse({
			"topBoards": [
				{
					"boardUri": "rus",
					"boardName": "Russian"
				},
				{
					"boardUri": "dobrochan",
					"boardName": "Доброчан"
				}
			],
			"latestPosts": [
				{
					"boardUri": "bb",
					"threadId": 86173,
					"postId": 104739,
					"previewText": "&gt;&gt;103974\nПосле первых 25 примерно час не чувствовал эффекта, думал его и не будет, нюфаг же.\n\nА вот вчера таки решился пойти куп"
				},
				{
					"boardUri": "polru",
					"threadId": 350927,
					"postId": 351844,
					"previewText": "&gt;&gt;351843\nква ква"
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765578,
					"previewText": "gonna make my chai stronger than recommended, because I'm a mad cunt"
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765577,
					"previewText": "&gt;&gt;765576\nVaping steroids?"
				},
				{
					"boardUri": "agatha2",
					"threadId": 37094,
					"postId": 37241,
					"previewText": "&gt;&gt;37240\nIt was Elias with a bunch of numbers but I already deleted the account since she caught on lol, she thinks she's smart b"
				},
				{
					"boardUri": "polru",
					"threadId": 350927,
					"postId": 351843,
					"previewText": "&gt;&gt;351842\r\nНа праздник в мос-ква должен летет как мне кажется."
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765576,
					"previewText": "i read vaping increases athletic performance"
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765575,
					"previewText": "&gt;&gt;765570\nI've never seen this one but I've always meant to so this is good."
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765574,
					"previewText": "Went to the shops to get a vape. Had a valium a bit before I went. \nFelt very relaxed and friendly. Almost wanted to talk to str"
				},
				{
					"boardUri": "ausneets",
					"threadId": 765132,
					"postId": 765573,
					"previewText": "&gt;&gt;765540\nWomen all play mercy in overwatch. I used to give them so much shit when I played it because they didn't heal me fast e"
				}
			],
			"latestImages": [
				{
					"boardUri": "news",
					"threadId": 21670,
					"thumb": "/.media/t_e44b44e9a1dba09df8f7ca439c023c66-imagejpeg"
				},
				{
					"boardUri": "news",
					"threadId": 21673,
					"thumb": "/.media/t_303e2c7e8ffa989c2c6f629ac2aae005-imagejpeg"
				},
				{
					"boardUri": "news",
					"threadId": 21674,
					"thumb": "/.media/t_b407bc71f3579e4f760e7d3dbd38aaa7-imagejpeg"
				},
				{
					"boardUri": "news",
					"threadId": 21677,
					"thumb": "/.media/t_8cdb5c7a1e9ff01d0e58d52b984e1187-imagepng"
				},
				{
					"boardUri": "news",
					"threadId": 21678,
					"thumb": "/.media/t_14f0e1958f2916291f06a9cb887f2225-imagejpeg"
				},
				{
					"boardUri": "news",
					"threadId": 21679,
					"thumb": "/.media/t_694eab94a9d134e4bcef7981a9df02f2-imagejpeg"
				}
			],
			"version": "1.7.5"
		}).should.deep.equal([
			{
				id: 'rus',
				title: 'Russian'
			},
			{
				id: 'dobrochan',
				title: 'Доброчан'
			}
		])
	})
})