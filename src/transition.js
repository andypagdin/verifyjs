import { $, getCharacter } from './lib'

const getTileAtIndex = (board, position) => {
  const tiles = $('#vfy-board').getElementsByClassName('vfy-tile')
  const index = convertToOneDimentional(board, position[0], position[1])
  return tiles[index]
}

export const difference = (a, b) => Math.abs(a - b)

export const convertToOneDimentional = (board, y, x) => x + (board[0].length * y)

export const updateTile = (board, y, x, empty = false) => {
  const tile = getTileAtIndex(board, [y, x])
  const content = empty ? '' : getCharacter()
  tile.getElementsByClassName('vfy-path')[0].innerHTML = content
}

export const transitionToPosition = (board, from, to, direction) => {
  let animationClass

  switch (direction) {
    case 'right': animationClass = 'left'; break
    case 'up': animationClass = 'top'; break
    case 'down': animationClass = 'top'; break
  }

  const moveCount = from[0] !== to[0] ? difference(from[0], to[0]) : difference(from[1], to[1])
  const offset = moveCount * $('#vfy-board').getElementsByClassName('vfy-tile')[0].offsetWidth

  const tile = getTileAtIndex(board, from)
  const char = tile.getElementsByClassName('vfy-char')[0]
  const charWrapper = tile.getElementsByClassName('vfy-char-wrapper')[0]

  char.classList.add('vfy-char-run')
  charWrapper.style[animationClass] = direction === 'up' ? `-${offset}px` : `${offset}px`

  charWrapper.ontransitionend = () => {
    updateTile(board, from[0], from[1], true)
    updateTile(board, to[0], to[1])
  }
}

export const transitionInProgress = (board, currentPosition) => {
  const tile = getTileAtIndex(board, currentPosition)
  return !tile.getElementsByClassName('vfy-char')[0]
}
