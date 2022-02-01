import { useHistory } from 'react-router'
import { fireEvent, render, screen } from '@testing-library/react'
import EntrancePageContainer from './EntrancePageContainer'
jest.mock('react-router')

describe('EntrancePageContainer', () => {
  const history = {
    push: jest.fn()
  }
  beforeEach(() => {
    useHistory.mockImplementation(() => history)
  })
  it('Clicking Enter button without input does not calls history.push', () => {
    render((
      <EntrancePageContainer />
    ))

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(history.push).not.toBeCalled()
  })
  it('Clicking Enter button with input calls history.push', () => {
    render((
      <EntrancePageContainer />
    ))

    const input = screen.getByPlaceholderText('Enter your name')
    fireEvent.change(input, {
      target: {
        value: 'A'
      }
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(history.push).toBeCalled()
  })
})