import styled from 'styled-components'
import { IUser } from '../pages/RoomPage'

interface IUserDisplayProps {
  user: IUser
}

const UserWrapper = styled.div`
  border: 1px solid black;
  height: 50%;
`

const ColorDisplay = styled.div`
  background: ${props => props.color || 'black'};
  width: 50px;
  height: 50px;
  border-radius: 50%;
`


const UserDisplay = ({ user }: IUserDisplayProps) => {
  return (
    <UserWrapper>
      { user.username }
      <ColorDisplay color={user.color} />
    </UserWrapper>
  )
}

export default UserDisplay