import { flip, getCell, isLastColumn, getMoves, createModal, generateBoard } from '../src/lib'

describe('library helpers', () => {
  it ('flips direction', () => {
    expect(flip('up')).toEqual('down')
    expect(flip('right')).toEqual('left')
    expect(flip('down')).toEqual('up')
  })

  it('gets the correct cell in matrix from a given position', () => {
    const board = [
      [0, 0, 0],
      [0, 0, 6],
      [0, 0, 0]
    ]
    expect(getCell(board, 1, 2)).toEqual(6)
  })

  it('correctly returns is last column from a given position and max length', () => {
    expect(isLastColumn(3, 5)).toBeFalsy()
    expect(isLastColumn(5, 5)).toBeTruthy()
  })

  it('creates modal', () => {
    const modal =
      '<div class="vfy-wrapper">' +
        '<div id="vfy-container">' +
          '<div class="vfy-controls">' +
            '<nav class="vfy-d-pad">' +
              '<a class="vfy-up" data-key="38" href="#"></a>' +
              '<a class="vfy-right" data-key="39" href="#"></a>' +
              '<a class="vfy-down" data-key="40" href="#"></a>' +
              '<a class="vfy-left" data-key="37" href="#"></a>' +
            '</nav>' +
          '</div>' +
          '<div id="vfy-board-container">' +
            '<div id="vfy-board"></div>' +
          '</div>' +
        '</div>' +
      '</div>'

    createModal()
    expect(document.body.innerHTML).toEqual(modal)
  })
})

describe('return correct moves for a given position on the board', () => {
  const board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]

  it('returns correct moves for given position y: 1 x: 1', () => {
    const expectedMoves = [
      { y: 0, x: 1, direction: 'up' },
      { y: 2, x: 1, direction: 'down' },
      { y: 1, x: 2, direction: 'right' }
    ]
    expect(getMoves(board, 1, 1, 0)).toEqual(expectedMoves)
  })

  it('returns correct moves for given position y: 0 x: 1', () => {
    const expectedMoves = [
      { y: 1, x: 1, direction: 'down' },
      { y: 0, x: 2, direction: 'right' }
    ]
    expect(getMoves(board, 0, 1, 0)).toEqual(expectedMoves)
  })

  it('returns correct down move for given position y: 1 x: 5 final column', () => {
    const expectedMoves = [
      { y: 2, x: 5, direction: 'down' }
    ]
    expect(getMoves(board, 1, 5, 3)).toEqual(expectedMoves)
  })

  it('returns correct up move for given position y: 2 x: 5 final column', () => {
    const expectedMoves = [
      { y: 1, x: 5, direction: 'up' }
    ]
    expect(getMoves(board, 2, 5, 0)).toEqual(expectedMoves)
  })

  it('returns correct finishing up move for given position y: 1 x: 5 final column', () => {
    const expectedMoves = [
      { y: 0, x: 5, direction: 'up' }
    ]
    expect(getMoves(board, 1, 5, 0)).toEqual(expectedMoves)
  })

  it('returns correct finishing down move for given position y: 1 x: 5 final column', () => {
    const expectedMoves = [
      { y: 2, x: 5, direction: 'down' }
    ]
    expect(getMoves(board, 1, 5, 2)).toEqual(expectedMoves)
  })

  it('always returns right on the first and second to last move', () => {
    const expectedMoveOne = [
      { y: 1, x: 1, direction: 'right' }
    ]
    expect(getMoves(board, 1, 0, 5)).toEqual(expectedMoveOne)

    const expectedMoveTwo = [
      { y: 1, x: 5, direction: 'right' }
    ]
    expect(getMoves(board, 1, 4, 5)).toEqual(expectedMoveTwo)
  })
})