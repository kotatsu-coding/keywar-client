import React, { useEffect, useRef, useState } from 'react'
import ChatBoxPresenter from './ChatBoxPresenter'
import { IUser } from '../../types'

interface IChatBoxContainterProps {
  socket: any,
  isJoined: boolean,
}

interface IChat {
  user: IUser,
  body: string
}

const ChatBoxContainer = ({ 
  socket, 
  isJoined 
}: IChatBoxContainterProps) => {
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

  const handleChats = (data: any) => {
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
    if (bottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats])

  return (
    <ChatBoxPresenter 
      chats={chats}
      bottomRef={bottomRef}
      inputValue={inputValue}
      onChange={handleChange}
      onSend={handleSend}
      onKeyDown={handleKeyDown}
    />
  )
}

export default ChatBoxContainer