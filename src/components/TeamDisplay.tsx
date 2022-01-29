import styled from 'styled-components'
import { IUser } from '../types'
import UserDisplay from './UserDisplay'

interface ITeamDisplayProps {
  users: IUser[]
}

const TeamDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 300px;
  height: 100%;
`

const TeamDisplay = ({ users }: ITeamDisplayProps) => {
  return (
    <TeamDisplayWrapper>
      { users.map((user, index) => <UserDisplay key={index} user={user}></UserDisplay>)}
    </TeamDisplayWrapper>
  )
}

export default TeamDisplay