export default function parseGetCaptchaResponse(response) {
	if (response.error) {
		onError(response)
		return
	}

	const {
		challenge,
		ttl,
		cd,
		img,
		img_width,
		img_height,
		bg,
		bg_width
	} = response

	return {
		captcha: {
			id: challenge,
			image: {
				type: 'image/png',
				url: 'data:image/png;base64,' + img,
				width: img_width,
				height: img_height
			},
			backgroundImage: {
				type: 'image/png',
				url: 'data:image/png;base64,' + bg,
				width: bg_width,
				height: img_height
			},
			type: 'text',
			challengeType: 'image-slider',
			expiresAt: new Date(Date.now() + ttl * 1000)
		},
		canRequestNewCaptchaAt: new Date(Date.now() + cd * 1000)
	}
}

function onError(response) {
	switch (response.error) {
		case 'You have to wait a while before doing this again':
			const errorInstance = new Error('RATE_LIMIT_EXCEEDED')
			if (typeof response.cd === 'number') {
				errorInstance.canRequestNewCaptchaAt = new Date(Date.now() + response.cd * 1000)
			}
			throw errorInstance
		default:
			throw new Error(response.error)
	}
}