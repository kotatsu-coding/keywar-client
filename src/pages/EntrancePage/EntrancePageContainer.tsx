import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { meState } from '../../atoms/me'
import { useSocket } from '../../hooks'
import EntrancePagePresenter from './EntrancePagePresenter'

const EntrancePageContainer = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState<string>('')
  const { socket } = useSocket('entrance')
  const [me, setMe] = useRecoilState(meState)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleEnter = () => {
    if (inputValue.length > 0 && socket?.connected) {
      socket.emit('set_user', {
        username: inputValue
      })
    }
  }

  const handleEnterAsAGuest = () => {
    socket.emit('set_user')  
  }

  const handleSetUser = (data: any) => {
    setMe(data.user)
  }

  useEffect(() => {
    if (socket?.connected) {
      socket.on('set_user', handleSetUser)
    }
  }, [socket?.connected])

  useEffect(() => {
    if (me) {
      history.push('/lobby')
    }
  }, [me])

  return (
    <div>
      <EntrancePagePresenter 
        inputValue={inputValue}
        onChange={handleChange}
        onEnter={handleEnter}
        onEnterAsAGuest={handleEnterAsAGuest}
      />
    </div>
  )
}

export default EntrancePageContainer