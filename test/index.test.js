const getPossibleMoves = require('../src/index')

describe('Gets correct possible moves', () => {
  const tiles = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]

  it('gets correct inital moves', () => {
    const possibleMoves = [
      [1, 1]
    ]
    expect(getPossibleMoves([1, 0], [0, 5], tiles)).toEqual(possibleMoves)
  })

  it('gets correct second moves', () => {
    const possibleMoves = [
      [1, 2], [0, 1], [2, 1]
    ]
    expect(getPossibleMoves([1, 1], [0, 5], tiles)).toEqual(possibleMoves)
  })

  it('gets correct last column move', () => {
    const possibleMoves = [
      [0, 5]
    ]
    expect(getPossibleMoves([1, 5], [0, 5], tiles)).toEqual(possibleMoves)
  })
})