import * as Verify from '../src/index'
import { $ } from '../src/lib'

describe('Verify action', () => {
  beforeEach(() => {
    Verify.action()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('removes elements from DOM on close icon click', () => {
    $('.vfy-close').click()
    expect(document.body.innerHTML).toEqual('')
  })

  it('removes elements from DOM on wrapper mask click', () => {
    $('.vfy-wrapper').click()
    expect(document.body.innerHTML).toEqual('')
  })

  it('does not remove elements from the DOM on puzzle interaction', () => {
    $('#vfy-container').click()
    $('.vfy-up').click()
    $('.vfy-down').click()
    $('.vfy-left').click()
    $('.vfy-right').click()
    expect(document.body.innerHTML).not.toEqual('')
  })
})