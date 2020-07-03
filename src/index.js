import { createModal, generateBoard, getDirection, $, move } from './lib'
import './index.css'

export const action = () => {
  createModal()

  let { board, currentPosition, endPosition } = generateBoard()

  $('.controls').addEventListener('click', e => {
    currentPosition = move(getDirection(e), board, currentPosition, endPosition)
  }, true)
}