import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { meState } from '../../atoms/me'
import EntrancePagePresenter from './EntrancePagePresenter'

const EntrancePageContainer = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState<string>('')
  const [me, setMe] = useRecoilState(meState)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const enter = (username?: string) => {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).then(response => {
      const { user } = response
      sessionStorage.setItem('keywar-token', user.token)
      //setMe(user)
    })
  }

  const handleEnter = () => {
    if (inputValue.length > 0) {
      enter(inputValue)
    }
  }

  const handleEnterAsAGuest = () => {
    enter()
  }

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