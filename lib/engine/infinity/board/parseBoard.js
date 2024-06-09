import getLanguageFromLocale from '../../../utility/getLanguageFromLocale.js'

export default function parseBoard(board) {
  const parsedBoard = {
    id: board.uri,
    title: board.title,
    description: board.subtitle,
    language: board.locale && parseLanguage(board.locale),
    explicitContent: board.sfw === '0',
    stats: {
      commentsPerHour: board.pph_average
      // Also has properties: `board.ppd` and `board.pph`.
    },
    post: {
      threadTags: board.tags.length > 0
    },
    features: {
      threadTags: board.tags,
    }
  }

  // // `board.active` is a number.
  // // "Active ISPs" is short hand for
  // // "number of /16 subnet ranges to post on this board in the last 72 hours."
  // // It is not a perfect metric and does not account for number of lurkers
  // // (users who only read the board and do not post) or the number of users
  // // sharing an IP range (for example, all Tor users are considered one active user).
  // // In the entire Internet, there are only 16,384 /16 ranges (also known as Class B networks),
  // // with 65,536 addresses per range. So, if /v/ or /pol/ has 3,000 ranges (active users),
  // // that means their posters represent 18% of the possible number of ranges on the Internet.
  // // Many ISPs only have one or two ranges.
  // board.activePostersShare = board.active / 16384

  return parsedBoard
}

const EIGHT_CHAN_LANGUAGE_CODE_BY_NAME = {
  'English': 'en',
  'Polski': 'pl',
  'Русский': 'ru',
  'Français': 'fr',
  'Italiano': 'it',
  'Magyar': 'hu',
  'Nederlands Vlaams': 'nl',
  'Deutsch': 'de',
  'Español': 'es',
  'Português': 'pt'
}

function parseLanguage(locale) {
  const language = getLanguageFromLocale(locale)
  if (language) {
    if (language.toLowerCase() !== language) {
      // `8kun.top` uses "localized language name" instead of "locale" in the `locale` property.
      const languageCode = EIGHT_CHAN_LANGUAGE_CODE_BY_NAME[language]
      if (languageCode) {
        return languageCode
      } else {
        console.warn(`Unknown board locale: "${locale}"`)
        return undefined
      }
    }
    return language
  }
}