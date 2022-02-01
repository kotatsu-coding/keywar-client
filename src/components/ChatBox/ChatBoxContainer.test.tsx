import { fireEvent, render, screen } from '@testing-library/react'
import ChatBoxContainer from './ChatBoxContainer'

const socket = {
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn()
}

describe('ChatBoxContainer', () => {
  it('Input changes value', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    render((
      <ChatBoxContainer 
        socket={null}

        isJoined={false}
      />
    ))
    const input = screen.getByRole('input')
    fireEvent.change(input, {
      target: {
        value: 'A'
      }
    })

    expect(input).toHaveProperty('value', 'A')
  })
  it('Send chat', () => {
    render((
      <ChatBoxContainer 
        socket={socket}
        isJoined={true}
      />
    ))
    const input = screen.getByRole('input')
    fireEvent.change(input, {
      target: {
        value: 'A'
      }
    })

    expect(input).toHaveProperty('value', 'A')
    fireEvent.keyDown(input, {
      key: 'Enter'
    })

    expect(socket.emit).toBeCalledWith('chat', {
      body: 'A'
    })
  })
  // TODO: How to test socket.on handlers ?
})
