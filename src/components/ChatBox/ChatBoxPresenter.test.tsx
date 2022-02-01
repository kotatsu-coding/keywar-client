import { fireEvent, render, screen } from '@testing-library/react'
import ChatBoxPresenter, { IChat } from './ChatBoxPresenter' 

describe('ChatBox', () => {
  const chats: IChat[] = []
  const handleChange = jest.fn()
  const handleSend = jest.fn()
  const handleKeyDown = jest.fn()
  it('"전송" button exists', () => {
    render((
      <ChatBoxPresenter 
        chats={chats}
        bottomRef={null}
        inputValue=''
        onChange={handleChange}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    ))
    const button = screen.getByText('전송')
    fireEvent.click(button)
    expect(handleSend).toBeCalled()
  })
  it('Input change fires handleChange', () => {
    render((
      <ChatBoxPresenter 
        chats={chats}
        bottomRef={null}
        inputValue=''
        onChange={handleChange}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    ))
    const input = screen.getByRole('input')
    fireEvent.change(input, {
      target: {
        value: 'a'
      }
    })

    expect(handleChange).toBeCalled()
  })
  it('KeyDown event fires handeKeyDown', () => {
    render((
      <ChatBoxPresenter 
        chats={chats}
        bottomRef={null}
        inputValue=''
        onChange={handleChange}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    ))
    const input = screen.getByRole('input')
    fireEvent.keyDown(input, {
      key: 'A'
    })

    expect(handleKeyDown).toBeCalled()
  })
})