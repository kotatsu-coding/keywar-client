import styled from 'styled-components'
import { IWord } from '../types'

interface IWordDisplayProps {
  word: IWord
}

const WordDisplayWrapper = styled.div`
  height: 100px;
  font-size: 50px;
`
const WordDisplay = ({ word }: IWordDisplayProps) => {
  const generateColoredWord = () => word.value.split('').map((character, idx) => (
    <span
      key={idx}
      style={{ color: word.colors[idx], opacity: idx < word.current_idx ? 1 : 0.5 }}
    >
      {character}
    </span>
  ))

  return (
    <WordDisplayWrapper>
      { generateColoredWord() }
    </WordDisplayWrapper>
  )

}

export default WordDisplay