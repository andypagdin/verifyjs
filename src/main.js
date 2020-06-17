document.body.addEventListener('click', e => {
  if (e.target && e.target.nodeName == 'A') {
    e.preventDefault()
    getDirection(Number(e.target.dataset.key))
  }
})

document.body.onkeyup = e => getDirection(e.which)

const getDirection = key => {
  switch (key) {
    case 37: move('left'); break
    case 38: move('up'); break
    case 39: move('right'); break
    case 40: move('down'); break
  }
}

const move = direction => {
  console.log('moving', direction)
}

const getCell = (matrix, y, x) => {
  let value, hasValue

  try {
    hasValue = matrix[y][x] !== undefined
    value = hasValue ? matrix[y][x] : null
  } catch (e) {
    value = null
  }

  return value
}

const getMoves = (matrix, y, x, destinationY) => {
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

const isLastColumn = (col, max) => {
  return col === max ? true : false
}

const getRandomNum = max => {
  return Math.floor(Math.random() * max)
}

const generateBoardMarkup = tiles => {
  const board = document.getElementById('board')

  tiles.forEach(row => {
    row.forEach((tile, index) => {
      let node = document.createElement('div')
      node.classList = 'tile'
      node.dataset.index = index

      if (typeof(tile) == 'object') {
        let path = document.createElement('div')
        path.classList = `path ${tile.previous ? tile.previous : ''}${tile.next ? tile.next : ''}`
        node.appendChild(path)
      }

      board.appendChild(node)
    })
  })
}

const flip = val => {
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

const generatePath = () => {
  const tiles = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]

  let previousPosition
  let position = [getRandomNum(4), 0] // y, x
  let destination = [getRandomNum(4), 5] // y, x

  let found = false
  while (!found) {
    // Get possible movements
    let moves = getMoves(tiles, position[0], position[1], destination[0])

    // Randomly choose a move
    let move = moves[getRandomNum(moves.length)]

    // Update previous position
    previousPosition = { y: position[0], x: position[1], direction: position[2] }

    // Update tile with previous and next path data
    tiles[position[0]][position[1]] = { previous: flip(previousPosition.direction), next: move.direction }

    // Make the move
    position = [move.y, move.x, move.direction]

    // Did we reach the destination?
    if (position[0] == destination[0] && position[1] == destination[1]) {
      tiles[move.y][move.x] = { previous: flip(move.direction), next: undefined }
      found = true
      generateBoardMarkup(tiles)
    }
  }
}

module.exports = {
  getCell: getCell,
  isLastColumn: isLastColumn,
  getMoves: getMoves
}
