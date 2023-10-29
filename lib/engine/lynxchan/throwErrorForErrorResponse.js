export default function throwErrorForErrorResponse(response) {
	const { status, data } = response
	if (status === 'ok') {
		// No error.
	} else if (status === 'error') {
		throw new Error(data)
	} else if (status === 'maintenance') {
		throw new Error('MAINTENANCE')
	} else if (status === 'banned') {
		const {
			banId,
			board: banBoardId,
			reason: banReason,
			expiration: banEndsAt,
			// (boolean) If the ban is actually a warning. Warnings are cleared once they are seen.
			warning: banWarning,
			asn: banAutonomousSystemNumber, // ?
			range: banIpAddressRange,
			appealled: banWasAppealed
		} = data
		const error = Error('BANNED')
		error.banId = banId
		error.banBoardId = banBoardId
		error.banReason = banReason
		error.banEndsAt = banEndsAt
		error.banWarning = banWarning
		error.banAutonomousSystemNumber = banAutonomousSystemNumber
		error.banIpAddressRange = banIpAddressRange
		error.banWasAppealed = banWasAppealed
		throw error
	} else if (status === 'hashBan') {
		// The user has tried to upload a banned file.
		const files = data.map(({ file, boardUri, reason }) => ({
			filename: file,
			boardId: boardUri ? boardUri.replace(/\//g, '') : undefined,
			reason
		}))
		const error = new Error('ATTACHMENT_BLACKLISTED')
		error.attachments = attachments
		throw error
	} else if (status === 'bypassable') {
		throw new Error('BYPASSABLE_BLOCK')
	} else {
		// Unknown shape of the `response` object.
		throw new Error(JSON.stringify(response))
	}
}