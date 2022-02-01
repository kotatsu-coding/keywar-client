import { fireEvent, render, screen } from '@testing-library/react'
import EntrancePagePresenter from './EntrancePagePresenter'

describe('EntrangePagePresenter', () => {
  const handleEnter = jest.fn()
  const handleChange = jest.fn()
  const handleEnterAsAGuest = jest.fn()
  const inputValue = 'test name'

  it('Display "Enter your name"', () => {
    const { container } = render((
      <EntrancePagePresenter 
        inputValue={inputValue} 
        onChange={handleChange} 
        onEnter={handleEnter} 
        onEnterAsAGuest={handleEnterAsAGuest}
      />
    ))

    expect(container).toHaveTextContent('Enter your name')
  })
  it('Clicking "Enter" button calls onEnter handler', () => {
    render((
      <EntrancePagePresenter 
        inputValue={inputValue} 
        onChange={handleChange} 
        onEnter={handleEnter} 
        onEnterAsAGuest={handleEnterAsAGuest}
      />
    ))

    const button = screen.getByText('Enter', { exact: true })
    fireEvent.click(button)

    expect(handleEnter).toBeCalled()
  })
  it('Clicking "Enter As A Guest" button calls onEnterAsAGuest handler', () => {
    render((
      <EntrancePagePresenter 
        inputValue={inputValue} 
        onChange={handleChange} 
        onEnter={handleEnter} 
        onEnterAsAGuest={handleEnterAsAGuest}
      />
    ))

    const button = screen.getByText('Enter as a guest')
    fireEvent.click(button)

    expect(handleEnterAsAGuest).toBeCalled()
  })
})