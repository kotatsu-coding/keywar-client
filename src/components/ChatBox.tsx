import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IUser } from '../types'

const ChatBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 100%;
  background: #eee;
  padding: 5px 10px;
  box-sizing: border-box;

  textarea {
    resize: none;
  }
`

const Input = styled.input`
  width: 100%;
  flex: 1;
  border: none;
  box-shadow: none;
  outline: none;
  border-radius: 3px;
`

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
`
const ChatDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  background: #fafafa;
  border-radius: 3px;
  overflow-y: scroll;
  overflow-x: hidden;
`

const ChatLine = styled.div`
  display: flex;
  border: 1px solid #eee;
  width: 100%;
  height: 20px;
`

const UsernameDisplay = styled.div`
  width: 150px;
`
const BodyDisplay = styled.div`
  flex: 1;
`

interface IChatBox {
  socket: any,
  isJoined: boolean,
}

interface IChat {
  user: IUser,
  body: string
}

const ChatBox = ({ socket, isJoined }: IChatBox) => {
  const [inputValue, setInputValue] = useState('')
  const [chats, setChats] = useState<IChat[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (isJoined) {
      socket.emit('chat', {
        'body': inputValue
      })
      setInputValue('')
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleChats= (data: any) => {
    setChats(data.chats)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend()
    }
  }

  useEffect(() => {
    if (isJoined) {
      socket.on('chats', handleChats)

      socket.emit('get_chats')
    }
    return () => {
      if (socket) {
        socket.off('chats', handleChats)
      }
    }
  }, [isJoined])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  return (
    <ChatBoxWrapper>
      <ChatDisplayWrapper>
        { chats.map((chat, index) => (
            <ChatLine key={index}>
              <UsernameDisplay>{chat.user.username }</UsernameDisplay>
              <BodyDisplay>{ chat.body }</BodyDisplay>
            </ChatLine>
          ))
        }
        <div ref={bottomRef} />
      </ChatDisplayWrapper>
      <InputWrapper>
        <Input value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} />
        <button onClick={handleSend}>전송</button>
      </InputWrapper>
    </ChatBoxWrapper>
  )
}

export default ChatBox