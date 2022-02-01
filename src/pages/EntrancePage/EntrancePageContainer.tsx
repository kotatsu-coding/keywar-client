import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { meState } from '../../atoms/me'
import { useSocket } from '../../hooks'
import EntrancePagePresenter from './EntrancePagePresenter'

const EntrancePageContainer = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState<string>('')
  const { socket, isConnected } = useSocket()
  const [me, setMe] = useRecoilState(meState)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleEnter = () => {
    if (inputValue.length > 0 && isConnected) {
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
    if (isConnected) {
      socket.on('set_user', handleSetUser)
    }
  }, [isConnected])

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