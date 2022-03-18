import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import EntrancePagePresenter from './EntrancePagePresenter'

const EntrancePageContainer = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState<string>('')
  const { me, enter } = useMe()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
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
  }, [me, history])

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