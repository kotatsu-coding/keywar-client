import { fireEvent, render, screen } from '@testing-library/react'
import EntrancePagePresenter from './EntrancePagePresenter'

describe('EntrangePagePresenter', () => {
  const handleEnter = jest.fn()
  const handleChange = jest.fn()
  const inputValue = 'test name'

  it('Display "Enter your name"', () => {
    const { container } = render((
      <EntrancePagePresenter inputValue={inputValue} onChange={handleChange} onEnter={handleEnter}/>
    ))

    expect(container).toHaveTextContent('Enter your name')
  })
  it('Clicking "Enter" button calls onEnter handler', () => {
    render((
      <EntrancePagePresenter inputValue={inputValue} onChange={handleChange} onEnter={handleEnter}/>
    ))

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleEnter).toBeCalled()
  })
})