import styled from 'styled-components'
import { ITeam } from '../types'
import WordDisplay from './WordDisplay'

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  flex: 1;
`

interface IMainDisplayProps {
  teams: ITeam[]
}

const MainDisplay = ({ teams }: IMainDisplayProps) => {
  return (
    <MainWrapper>
      { teams.length === 2 && 
        <>
          <WordDisplay word={teams[0].current_word} />
          <WordDisplay word={teams[1].current_word} />
        </>
      }
    </MainWrapper>
  )
}

export default MainDisplay