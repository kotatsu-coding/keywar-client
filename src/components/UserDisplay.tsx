import styled from 'styled-components'
import { IUser } from '../pages/RoomPage'

interface IUserDisplayProps {
  user: IUser
}

const UserWrapper = styled.div`
  border: 1px solid black;
  height: 50%;
`

const UserDisplay = ({ user }: IUserDisplayProps) => {
  return (
    <UserWrapper>
      { user.username }
    </UserWrapper>
  )
}

export default UserDisplay