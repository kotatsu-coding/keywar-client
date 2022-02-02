import styled from 'styled-components'
import { ITeam} from '../types'
import UserDisplay from './UserDisplay'

interface ITeamDisplayProps {
  team?: ITeam
}

const TeamDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: 100%;
  padding: 0 20px;
`

const TeamDisplay = ({ team }: ITeamDisplayProps) => {
  return (
    <TeamDisplayWrapper>
      { team && team.users.map((user, index) => <UserDisplay key={index} user={user}></UserDisplay>)}
    </TeamDisplayWrapper>
  )
}

export default TeamDisplay