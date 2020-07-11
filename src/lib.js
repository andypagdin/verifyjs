import { transitionToPosition, transitionInProgress } from './transition'

const getRandomNum = max => {
  return Math.floor(Math.random() * max)
}

export const getCharacter = () => {
  return '<div class="vfy-char"></div>'
}

export const getEmptyTiles = tiles => {
  let emptyTiles = []
  tiles.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      if (typeof(tile) === 'number') {
        emptyTiles.push([rowIndex, tileIndex])
      }
    })
  })
  return emptyTiles
}

export const addDecoration = (tiles, emptyTiles, decoration) => {
  for (let i = 0; i < decoration.count; i++) {
    const rand = getRandomNum(emptyTiles.length)
    const tile = emptyTiles[rand]
    if (tile) {
      tiles[tile[0]][tile[1]] = { decoration: decoration.name }
      emptyTiles.splice(rand, 1)
    }
  }
}

export const generateBoardMarkup = tiles => {
  const emptyTiles = getEmptyTiles(tiles)

  const decorations = [
    { name: 'vfy-large-rock', count: 3 },
    { name: 'vfy-weeds-one', count: 1 },
    { name: 'vfy-weeds-two', count: 2 },
    { name: 'vfy-weeds-three', count: 2 },
    { name: 'vfy-weeds-four', count: 4 }
  ]
  decorations.forEach(decoration => {
    addDecoration(tiles, emptyTiles, decoration)
  })

  const boardElement = $('#vfy-board')

  if (!boardElement) {
    console.error('Board element was not found in DOM')
    return
  }

  tiles.forEach(row => {
    row.forEach((tile, index) => {
      let node = document.createElement('div')
      node.classList = 'vfy-tile'

      let path = document.createElement('div')
      if (typeof(tile) == 'object') {
        if (tile.decoration) {
          path.classList = `vfy-path ${tile.decoration}`
        } else {
          path.classList = `vfy-path ${tile.previous ? 'vfy-' + tile.previous : ''}${tile.next ? 'vfy-' + tile.next : ''}`
          if (index === 0) path.innerHTML = getCharacter()
        }
      }
      else {
        path.classList = 'vfy-path vfy-bg'
      }

      node.appendChild(path)
      boardElement.appendChild(node)
    })
  })
}

export const move = (direction, board, currentPosition, endPosition) => {
  let y = currentPosition[0]
  let x = currentPosition[1]

  if (transitionInProgress(board, currentPosition)) return currentPosition

  let initialPosition = [y, x]
  let currentTile = board[y][x]

  if (currentTile.next == direction) {
    let keepMoving = true

    while (keepMoving) {
      switch (direction) {
        case 'right': {
          currentTile = getCell(board, y, x+1)
          x = x+1
          break
        }
        case 'up': {
          currentTile = getCell(board, y-1, x)
          y = y-1
          break
        }
        case 'down': {
          currentTile = getCell(board, y+1, x)
          y = y+1
          break
        }
      }

      if (currentTile.next !== direction) {
        keepMoving = false
        currentPosition = [y, x]
      }
    }
  } else {
    return { message: `Incorrect move ${direction}`, result: 0 }
  }

  if (currentPosition[0] === endPosition[0] && currentPosition[1] === endPosition[1]) {
    return { message: 'Verification successful', result: 1 }
  } else {
    transitionToPosition(board, initialPosition, [y, x], direction)
  }

  return currentPosition
}

export const getDirection = e => {
  if (e.target && e.target.nodeName == 'A') {
    e.preventDefault()

    let direction
    switch (Number(e.target.dataset.key)) {
      case 37: direction = 'left'; break
      case 38: direction = 'up'; break
      case 39: direction = 'right'; break
      case 40: direction = 'down'; break
    }

    return direction
  }
}

export const flip = val => {
  let switched
  switch(val) {
    case 'up': switched = 'down'; break
    case 'down': switched = 'up'; break
    case 'right': switched = 'left'; break
  }
  return switched
}

export const getCell = (matrix, y, x) => {
  let value, hasValue

  try {
    hasValue = matrix[y][x] !== undefined
    value = hasValue ? matrix[y][x] : null
  } catch (e) {
    value = null
  }

  return value
}

export const isLastColumn = (col, max) => {
  return col === max ? true : false
}

export const getMoves = (matrix, y, x, destinationY) => {
  let moves = []
  let matrixLength = matrix[0].length - 1

  // Always move right on the first and second to last move
  if (x === 0 || x === matrixLength - 1) {
    return [{ y: y, x: x+1, direction: 'right' }]
  }

  let up = getCell(matrix, y-1, x)
  let down = getCell(matrix, y+1, x)
  let right = getCell(matrix, y, x+1)

  if (up !== null && up === 0) {
    // Do not move away from the destination Y
    if (isLastColumn(x, matrixLength) && y - 1 < destinationY) {
      return [{ y: y+1, x: x, direction: 'down' }]
    }
    moves.push({ y: y-1, x: x, direction: 'up' })
  }

  if (down !== null && down === 0) {
    // Do not move away from the destination Y
    if (isLastColumn(x, matrixLength) && y + 1 > destinationY) {
      return [{ y: y-1, x: x, direction: 'up' }]
    }
    moves.push({ y: y+1, x: x, direction: 'down' })
  }

  if (right !== null && right === 0) {
    moves.push({ y: y, x: x+1, direction: 'right' })
  }

  return moves
}

export const generateBoard = () => {
  const tiles = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]

  let position = [getRandomNum(4), 0]
  let destination = [getRandomNum(4), 5]

  let initialPosition = position

  let found = false
  while (!found) {
    // Get possible movements
    let moves = getMoves(tiles, position[0], position[1], destination[0])

    // Randomly choose a move
    let move = moves[getRandomNum(moves.length)]

    // Update tile with previous and next path data
    tiles[position[0]][position[1]] = { previous: flip(position[2]), next: move.direction }

    // Make the move
    position = [move.y, move.x, move.direction]

    // Did we reach the destination?
    if (position[0] == destination[0] && position[1] == destination[1]) {
      tiles[move.y][move.x] = { previous: flip(move.direction), next: undefined }
      found = true
      generateBoardMarkup(tiles)
      return { board: tiles, currentPosition: initialPosition, endPosition: destination }
    }
  }
}

export const $ = selector => {
  return document.querySelector(selector)
}

export const createModal = () => {
  const close =
    '<svg viewBox="0 0 1024 1024" width="30" height="30">' +
      '<path d="M512 451.67l225.835-225.835a42.667 42.667 0 0 1 60.33 60.33L572.331 512l225.834 225.835a42.667 42.667 0 0 1-60.33 60.33L512 572.331 286.165 798.165a42.667 42.667 0 1 1-60.33-60.33L451.669 512 225.835 286.165a42.667 42.667 0 0 1 60.33-60.33L512 451.669z" p-id="3735" fill="#000"></path>' +
    '</svg>'

  const modal =
    `<div class="vfy-close">${close}</div>` +
    '<div id="vfy-container">' +
      '<div class="vfy-controls">' +
        '<nav class="vfy-d-pad">' +
          '<a class="vfy-up" data-key="38" href="#"></a>' +
          '<a class="vfy-right" data-key="39" href="#"></a>' +
          '<a class="vfy-down" data-key="40" href="#"></a>' +
          '<a class="vfy-left" data-key="37" href="#"></a>' +
        '</nav>' +
      '</div>' +
      '<div id="vfy-board"></div>' +
    '</div>'

  const node = document.createElement('div')
  node.className = 'vfy-wrapper'
  node.innerHTML = modal
  $('body').appendChild(node)
}

export const showResult = (result, handleControlClick) => {
  $('.vfy-controls').removeEventListener('click', handleControlClick, true)

  const faCheck = {
    icon:
      '<svg width="60" height="60" viewBox="0 0 512 512">' +
        '<path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>' +
      '</svg>',
    labelClass: 'check'
  }
  const faTimes = {
    icon:
      '<svg width="60" height="60" viewBox="0 0 352 512">' +
        '<path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>' +
      '</svg>',
    labelClass: 'times'
  }

  let { icon, labelClass } = (result === 1) ? faCheck : faTimes

  const marker =
    '<label class="vfy-result-label">' +
      '<span class="vfy-result-label-text">' +
        `<span class="vfy-result-label-icon-${labelClass}">` +
          `<span class="icon">${icon}</span>` +
        '</span>' +
      '</span>' +
    '</label>'

  $('#vfy-board').innerHTML = marker

  setTimeout(() => {
    removeModal()
  }, 700)
}

export const removeModal = () => {
  $('.vfy-wrapper').remove()
}
