import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ChatBoxContainer from './ChatBoxContainer'
import { clientSocket, serverSocket, cleanUp, IMockedClientSocket } from '../../fixtures/socket'


describe('ChatBoxContainer', () => {
  afterEach(() => {
    cleanUp()
  })
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
        socket={clientSocket}
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

    expect(clientSocket.emit).toBeCalledWith('chat', {
      body: 'A'
    })
  })
  it('Emitting "chats" event changes array', async () => {
    const { container } = render((
      <ChatBoxContainer 
        socket={clientSocket}
        isJoined={true}
      />
    ))

    serverSocket.emit('chats', {
      'chats': [{
        user: {
          username: 'Test user'
        },
        body: 'Test Chat'
      }
    ]})

    await waitFor(() => expect(container).toHaveTextContent('Test Chat'))
  })
})
