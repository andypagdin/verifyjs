document.body.addEventListener('click', e => {
  if (e.target && e.target.nodeName === 'A') {
    e.preventDefault()
    getDirection(Number(e.target.dataset.key))
  }
})

document.body.onkeyup = e => getDirection(e.which)

const getDirection = key => {
  switch (key) {
    case 37: move('left'); break
    case 39: move('right'); break
    case 38: move('up'); break
    case 40: move('down'); break
  }
}

const move = direction => {
  console.log('moving', direction)
}