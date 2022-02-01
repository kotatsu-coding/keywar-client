import { useHistory } from 'react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { io } from 'socket.io-client'
import { serverSocket, clientSocket, cleanUp } from '../../fixtures/socket'
import EntrancePageContainer from './EntrancePageContainer'

jest.mock('react-router')
jest.mock('socket.io-client')

const mockedUseHistory = useHistory as jest.Mock
const mockedIo = io as jest.Mock

describe('EntrancePageContainer', () => {
  const history = {
    push: jest.fn()
  }
  beforeEach(() => {
    mockedUseHistory.mockImplementation(() => history)
    mockedIo.mockImplementation(() => clientSocket)
  })
  afterEach(() => {
    cleanUp()
  })
  it('Clicking Enter button without input does not call "set_user" event', () => {
    render((
      <RecoilRoot>
        <EntrancePageContainer />
      </RecoilRoot>
    ))

    const button = screen.getByText('Enter', { exact: true })
    fireEvent.click(button)

    expect(clientSocket.emit).not.toBeCalledWith('set_user')
  })
  it('Clicking Enter button with input emits "set_user" event', async () => {
    render((
      <RecoilRoot>
        <EntrancePageContainer />
      </RecoilRoot>
    ))
    serverSocket.emit('connect')

    const input = screen.getByPlaceholderText('Enter your name')
    fireEvent.change(input, {
      target: {
        value: 'Test Username'
      }
    })
    expect(input).toHaveAttribute('value', 'Test Username')

    const button = screen.getByText('Enter', { exact: true })
    fireEvent.click(button)
    expect(clientSocket.emit).toBeCalledWith('set_user', {
      username: 'Test Username'
    })

    serverSocket.emit('set_user', {
      user: {
        username: 'Test Username'
      }
    })

    await waitFor(() => expect(history.push).toBeCalledWith('/lobby'))
  })
  it('Clicking "Enter as a guest" calls history.push', async () => {
    render((
      <RecoilRoot>
        <EntrancePageContainer />
      </RecoilRoot>
    ))
    serverSocket.emit('connect')

    const button = screen.getByText('Enter as a guest')
    fireEvent.click(button)
    expect(clientSocket.emit).toBeCalledWith('set_user')

    serverSocket.emit('set_user', {
      user: {
        username: 'Guest_1'
      }
    })
    await waitFor(() => expect(history.push).toBeCalledWith('/lobby'))
  })
})