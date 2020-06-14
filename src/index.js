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

const getPossibleMoves = (position, destination, tiles) => {
  // always move right on first move
  if (position[1] === 0) return [[position[0], 1]]

  // always move right on second to last move
  if (position[1] === tiles[0].length - 2) return [[position[0], 5]]

  let right = tiles[position[0]][position[1] + 1]
  let up = tiles[position[0] - 1]
    ? tiles[position[0] - 1][position[1]]
    : undefined
  let down = tiles[position[0] + 1]
    ? tiles[position[0] + 1][position[1]]
    : undefined

  let moves = []

  if (right !== undefined) {
    moves.push([ position[0], position[1] + 1 ])
  }

  // TODO: tidy last column logic
  if (up !== undefined && up == 0) {
    // If the current position is on the last line
    // only move up if it is towards the destination
    if (position[1] == destination[1]) {
      if (position[0] - 1 >= destination[0]) {
        moves.push([ position[0] - 1, position[1] ])
      }
    } else {
      moves.push([ position[0] - 1, position[1] ])
    }
  }

  if (down !== undefined && down == 0) {
    // If the current position is on the last line
    // only move down if it is towards the destination
    if (position[1] == destination[1]) {
      if (position[0] + 1 <= destination[0]) {
        moves.push([ position[0] + 1, position[1] ])
      }
    } else {
      moves.push([ position[0] + 1, position[1] ])
    }
  }

  return moves
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
      node.innerHTML = tile

      board.appendChild(node)
    })
  })
}

const generatePath = () => {
  const tiles = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]

  let position = [getRandomNum(4), 0] // x, y
  let destination = [getRandomNum(4), 5] // x, y

  let tries = 1
  let found = false
  tiles[position[0]][0] = tries

  while (!found) {
    tries++

    // Get possible movements
    let moves = getPossibleMoves(position, destination, tiles)

    // Randomly choose a move
    let move = moves[getRandomNum(moves.length)]

    // Make the move
    position = [move[0], move[1]]

    // Update tile
    tiles[position[0]][position[1]] = tries

    // Did we reach final position?
    if (position[0] == destination[0] && position[1] == destination[1]) {
      found = true
      generateBoardMarkup(tiles)
    }
  }
}

generatePath()

// module.exports = getPossibleMoves
