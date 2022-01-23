import { useState, useEffect, useCallback } from 'react'

const useTimer = (totalTime: number) => {
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [remainingTime, setRemainingTime] = useState(totalTime)

  const nextTimeout = useCallback(() => {
    setTimeout(() => {
      const passedTime = (Date.now() - startTime) / 1000
      const newRemainingTime = Math.max(0, totalTime - passedTime)
      setRemainingTime(newRemainingTime)
      if (newRemainingTime > 0) {
        nextTimeout()
      } else {
        setIsStarted(false)
      }
    }, 100)
  }, [startTime,  totalTime])

  useEffect(() => {
    if (isStarted && startTime) {
      nextTimeout()
    }
  }, [nextTimeout, isStarted, startTime])

  const startTimer = () => {
    setIsStarted(true)
    setStartTime(Date.now())
  }

  return {
    startTimer,
    remainingTime    
  }
}

export { useTimer }