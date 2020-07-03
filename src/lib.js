const getRandomNum = max => {
  return Math.floor(Math.random() * max)
}

const updateTile = (board, y, x, empty = false) => {
  let tiles = $('#board').getElementsByClassName('tile')
  let index = x + (board[0].length*y) // map 2D to 1D index
  let content = empty ? '' : '<div class="char">👨</div>'
  tiles[index].getElementsByClassName('path')[0].innerHTML = content
}

const generateBoardMarkup = tiles => {
  const board = document.getElementById('board')

  if (!board) {
    console.error('Board element was not found in DOM')
    return
  }

  tiles.forEach(row => {
    row.forEach((tile, index) => {
      let node = document.createElement('div')
      node.classList = 'tile'

      if (typeof(tile) == 'object') {
        let path = document.createElement('div')
        path.classList = `path ${tile.previous ? tile.previous : ''}${tile.next ? tile.next : ''}`

        if (index === 0) {
          path.innerHTML = '<div class="char">👨</div>'
        }

        node.appendChild(path)
      }

      board.appendChild(node)
    })
  })
}

export const move = (direction, board, currentPosition, endPosition) => {
  let y = currentPosition[0]
  let x = currentPosition[1]

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
        updateTile(board, initialPosition[0], initialPosition[1], true)
        updateTile(board, y, x)
      }
    }
  } else {
    console.log('incorrect move', direction)
  }

  if (currentPosition[0] === endPosition[0] && currentPosition[1] === endPosition[1]) {
    console.log('finished')
  }

  return currentPosition
}

export const getDirection = (e) => {
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
    case 'up':
      switched = 'down'
      break;
    case 'down':
      switched = 'up'
      break;
    case 'right':
      switched = 'left'
      break
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

  let currentPosition = position

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
      return { board: tiles, currentPosition: currentPosition, endPosition: destination }
    }
  }
}

export const $ = selector => {
  return document.querySelector(selector)
}

export const createModal = () => {
  const modal =
    '<div id="container">' +
      '<div class="controls">' +
        '<nav class="d-pad">' +
          '<a class="up" data-key="38" href="#"></a>' +
          '<a class="right" data-key="39" href="#"></a>' +
          '<a class="down" data-key="40" href="#"></a>' +
          '<a class="left" data-key="37" href="#"></a>' +
        '</nav>' +
      '</div>' +
      '<div id="board-container">' +
        '<div id="board"></div>' +
      '</div>' +
    '</div>'

  const node = document.createElement('div')
  node.className = 'wrapper'
  node.innerHTML = modal
  $('body').appendChild(node)
}
