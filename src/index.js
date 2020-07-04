import { createModal, generateBoard, getDirection, $, move } from './lib'
import './index.css'

export const action = () => {
  createModal()

  let { board, currentPosition, endPosition } = generateBoard()

  $('.vfy-controls').addEventListener('click', e => {
    if (e.target && e.target.nodeName == 'A') {
      currentPosition = move(getDirection(e), board, currentPosition, endPosition)
    }
  }, true)

  $('.vfy-close').addEventListener('click', () => {
    $('.vfy-wrapper').remove()
  }, true)

  $('.vfy-wrapper').addEventListener('click', e => {
    if (e.target.classList && e.target.classList[0] == 'vfy-wrapper') {
      $('.vfy-wrapper').remove()
    }
  }, true)
}