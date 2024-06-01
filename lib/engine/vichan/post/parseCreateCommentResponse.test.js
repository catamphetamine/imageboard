import parseCreateCommentResponse from './parseCreateCommentResponse.js'

describe('engine/infinity/post/parseCreateCommentResponse', () => {
  it('should parse "create comment" API response', () => {
    parseCreateCommentResponse({
      // The URL of the comment to redirect to.
      "redirect": "\/random\/res\/108867.html#108897",

      // Supposedly, `noko: true` flag means "redirect to the comment".
      //
      // https://www.urbandictionary.com/define.php?term=noko
      // "noko — A magical word that, when typed in the email field of a chan post form before
      //  posting, returns you directly to the thread you just posted in instead of the thread list."
      // "Example: I use "noko" on /b/ to avoid losing track of my threads."
      //
      "noko": true,

      // Comment ID or thread ID.
      "id": "108897"
    }).should.deep.equal({
      id: 108897
    })
  })
})