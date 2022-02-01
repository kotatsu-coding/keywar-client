import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import EntrancePagePresenter from './EntrancePagePresenter'

const EntrancePageContainer = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState<string>('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleEnter = () => {
    if (inputValue.length > 0) {
      history.push('/lobby')
    }
  }

  return (
    <div>
      <EntrancePagePresenter 
        inputValue={inputValue}
        onChange={handleChange}
        onEnter={handleEnter}
      />
    </div>
  )
}

export default EntrancePageContainer