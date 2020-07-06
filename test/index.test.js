import * as Verify from '../src/index'
import * as lib from '../src/lib'

const $ = lib.$
const successMessage = 'Verification successful'
const failMessage = 'Incorrect move'
const closeMessage = 'Modal closed before verification complete'

describe('Verify action DOM', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('removes elements from DOM on close icon click', done => {
    const callback = (result, message) => {
      expect(result).toEqual(2)
      expect(message).toEqual(closeMessage)
      done()
    }

    Verify.action(callback)

    $('.vfy-close').click()
  })

  it('removes elements from DOM on wrapper mask click', done => {
    const callback = (result, message) => {
      expect(result).toEqual(2)
      expect(message).toEqual(closeMessage)
      done()
    }

    Verify.action(callback)

    $('.vfy-wrapper').click()
  })

  it('does not remove elements from the DOM on puzzle interaction', () => {
    Verify.action(() => {})

    $('#vfy-container').click()
    $('.vfy-right').click()

    expect(document.body.innerHTML).not.toEqual('')
  })
})

describe('Verify action results', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns 0 on incorrect move (moving left from starting position will always be incorrect)', done => {
    const callback = (result, message) => {
      expect(result).toEqual(0)
      expect(message).toEqual(`${failMessage} left`)
      done()
    }

    Verify.action(callback)

    $('.vfy-left').click()
  })

  it('returns 1 on verification success', done => {
    jest.spyOn(lib, 'generateBoard').mockImplementation(() => {
      const board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, { "previous": "down", "next": "right" }, { "previous": "left", "next": "right" }, { "previous": "left", "next": "right" }, { "previous": "left", "next": "down" }],
        [{ "next": "right" }, { "previous": "left", "next": "down" }, { "previous": "down", "next": "up" }, 0, 0, { "previous": "up", "next": "down" }],
        [0, { "previous": "up", "next": "right" }, { "previous": "left", "next": "up" }, 0, 0, { "previous": "up" }]
      ]
      lib.generateBoardMarkup(board)
      return { board: board, currentPosition: [2, 0], endPosition: [3, 5] }
    })

    const callback = (result, message) => {
      expect(result).toEqual(1)
      expect(message).toEqual(successMessage)
      done()
    }

    Verify.action(callback)

    $('.vfy-right').click()
    $('.vfy-down').click()
    $('.vfy-right').click()
    $('.vfy-up').click()
    $('.vfy-right').click()
    $('.vfy-down').click()
  })
})