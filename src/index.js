import { createModal, generateBoard, getDirection, $, move, removeModal, showResult } from './lib'
import './index.css'

// 0 Verify failed
// 1 Verify success
// 2 Verify modal closed before any verification

export const action = (callback) => {
  createModal()

  let { board, currentPosition, endPosition } = generateBoard()

  $('.vfy-controls').addEventListener('click', e => {
    if (e.target && e.target.nodeName == 'A') {
      currentPosition = move(getDirection(e), board, currentPosition, endPosition)

      // If a non array (results object) is returned from move a result has been reached
      if (!Array.isArray(currentPosition)) {
        showResult(currentPosition.result)
        callback(currentPosition.result, currentPosition.message)
      }
    }
  }, true)

  $('.vfy-close').addEventListener('click', () => {
    removeModal()
    callback(2, 'Modal closed before verification complete')
  }, true)

  $('.vfy-wrapper').addEventListener('click', e => {
    if (e.target.classList && e.target.classList[0] == 'vfy-wrapper') {
      removeModal()
      callback(2, 'Modal closed before verification complete')
    }
  }, true)
}