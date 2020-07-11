import { $, getCharacter } from './lib'


const difference = (a, b) => Math.abs(a - b)

export const updateTile = (board, y, x, empty = false) => {
  const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
  const index = convertToOneDimentional(board, y, x)
  const content = empty ? '' : getCharacter()
  tiles[index].getElementsByClassName('vfy-path')[0].innerHTML = content
}

export const transitionToPosition = (board, from, to, direction) => {
  let animationClass

  switch (direction) {
    case 'right': animationClass = 'left'; break
    case 'up': animationClass = 'top'; break
    case 'down': animationClass = 'top'; break
  }

  let moveCount = (from[0] !== to[0])
    ? difference(from[0], to[0])
    : difference(from[1], to[1])
  let offset = moveCount * 48

  const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
  const index = convertToOneDimentional(board, from[0], from[1])
  const char = tiles[index].getElementsByClassName('vfy-char')[0]

  char.classList.add('vfy-char-run')
  char.style[animationClass] = (direction === 'up') ? `-${offset}px` : `${offset}px`

  setTimeout(() => {
    updateTile(board, from[0], from[1], true)
    updateTile(board, to[0], to[1])
  }, 1000)
}

export const transitionInProgress = (board, currentPosition) => {
  const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
  const index = convertToOneDimentional(board, currentPosition[0], currentPosition[1])
  return !tiles[index].getElementsByClassName('vfy-char')[0]
}

export const convertToOneDimentional = (board, y, x) => x + (board[0].length * y)
