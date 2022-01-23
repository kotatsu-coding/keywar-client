import { useEffect, useState, useMemo } from 'react'
import styles from './GameRoom.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface IGameDisplay {
  team: any,
  gameStatus: string
}

const GameDisplay = ({
  team,
  gameStatus
}: IGameDisplay) => {
  const [sequence, setSequence] = useState<string[][]>([])

  const synchronizeSequence = (serverSequence: string[][]) => {
    setSequence(prevSequence => {
      let i = 0
      let j = 0
      const newSequence = []
      while (i < prevSequence.length || j < serverSequence.length) {
        if (j >= serverSequence.length) {
          newSequence.push(prevSequence[i])
          i += 1
          continue
        }
        if (i >= prevSequence.length) {
          newSequence.push(serverSequence[j])
          j += 1
          continue
        }
        if (prevSequence[i][0] === serverSequence[j][0] && prevSequence[i][1] === serverSequence[j][1]) {
          newSequence.push(prevSequence[i])
          i += 1
          j += 1
          continue
        }
        newSequence.push(serverSequence[j])
        j += 1
      }
      return newSequence
    })
  }

  useEffect(() => {
    if (gameStatus !== 'playing') return
    const serverSequence = team.sequence
    if (serverSequence.length === 0) {
      setSequence([])
    } else {
      synchronizeSequence(serverSequence)
    }
  }, [gameStatus, team])

  const currentIdx = useMemo(() => {
    if (gameStatus !== 'playing') return 0
    let idx = 0
    const { current_word } = team
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i][0] === current_word.colors[idx] &&
        sequence[i][1] === current_word.value[idx]) {
        idx++
        continue
      }
      idx= 0
    }
    return idx
  }, [gameStatus, sequence, team])

  const getOpaqueSpans = ({
    word,
    colors,
    current_idx,
  }: {
    word: string
    colors: Array<string>
    current_idx: number
  }) => {
    return word.split('').map((character, idx) => (
      <span
        key={idx}
        style={{ color: colors[idx], opacity: idx < current_idx ? 1 : 0.5 }}
      >
        {character}
      </span>
    ))
  }

  return (
    <div className={cx('word')}>
      {team.current_word &&
        getOpaqueSpans({
          word: team.current_word.value,
          colors: team.current_word.colors,
          current_idx: currentIdx
      })}
    </div>
  )
}

export { GameDisplay }