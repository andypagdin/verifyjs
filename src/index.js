import { createModal, generateBoard, getDirection, $, move, removeModal, showResult } from './lib'
import './index.css'

export const action = (callback) => {
  createModal()

  let { board, currentPosition, endPosition } = generateBoard()

  const handleControlClick = e => {
    if (e.target && e.target.nodeName == 'A') {
      currentPosition = move(getDirection(e), board, currentPosition, endPosition)

      // If a non array (results object) is returned from move a result has been reached
      if (!Array.isArray(currentPosition)) {
        showResult(currentPosition.result, handleControlClick)
        callback(currentPosition.result, currentPosition.message)
      }
    }
  }

  const handleWrapperClick = e => {
    if (e.target.classList && e.target.classList[0] == 'vfy-wrapper') {
      removeModal()
      callback(2, 'Modal closed before verification complete')
    }
  }

  const handleCloseClick = () => {
    removeModal()
    callback(2, 'Modal closed before verification complete')
  }

  $('.vfy-controls').addEventListener('click', handleControlClick, true)
  $('.vfy-close').addEventListener('click', handleCloseClick, true)
  $('.vfy-wrapper').addEventListener('click', handleWrapperClick, true)
}