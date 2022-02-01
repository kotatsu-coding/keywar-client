import React from 'react'
import styled from 'styled-components'
import { IUser } from '../../types'

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

interface IChatBoxPresenterProps {
  chats: IChat[],
  bottomRef: React.Ref<HTMLDivElement>,
  inputValue: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSend: () => void,
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface IChat {
  user: IUser,
  body: string
}

const ChatBox = ({ 
  chats, 
  bottomRef, 
  inputValue, 
  onChange, 
  onSend,
  onKeyDown
}: IChatBoxPresenterProps) => {
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
        <Input role='input' value={inputValue} onChange={onChange} onKeyDown={onKeyDown} />
        <button onClick={onSend}>전송</button>
      </InputWrapper>
    </ChatBoxWrapper>
  )
}

export default ChatBox