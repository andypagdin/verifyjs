import { updateTile, transitionToPosition, difference } from '../src/transition'
import { $, createModal, generateBoardMarkup, getCharacter } from '../src/lib'

let board

describe('transition helpers', () => {
  it('returns the difference between 2 numbers', () => {
    expect(difference(5, 2)).toEqual(3)
  })
})

describe('transition module', () => {
  beforeEach(() => {
    board = [[0, 0, 0], [{ "previous": "left", "next": "right" }, 0, 0], [0, 0, 0]]
    createModal()
    generateBoardMarkup(board)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('updates a tile on the board with the given character', () => {
    updateTile(board, 1, 1)

    const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
    const result = tiles[4].getElementsByClassName('vfy-path')[0].innerHTML

    expect(result).toEqual(getCharacter())
  })

  it('updates a tile on the board removing the character', () => {
    updateTile(board, 1, 1, true)

    const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
    const result = tiles[4].getElementsByClassName('vfy-path')[0].innerHTML

    expect(result).toEqual('')
  })

  it('transitions the character from one tile to another correctly', () => {
    transitionToPosition(board, [1, 0], [1, 1], 'right')

    let char = $('.vfy-char')

    expect(char.classList).toContain('vfy-char-run')
    expect(char.style.left).toEqual('48px')
  })
})