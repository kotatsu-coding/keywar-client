import styled from 'styled-components'
import { IUser } from '../types'

interface IUserDisplayProps {
  user: IUser
}

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #eee;
  border-radius: 10px;
  box-shadow: 1px 1px 3px 3px #ddd;
  height: 45%;
  padding: 0 10px;
`

const ColorDisplay = styled.div`
  background: ${props => props.color || 'black'};
  width: 100%;
  height: 20px;
  border-radius: 2px;
`

const UsernameDisplay = styled.div`
  height: 50%;
`


const UserDisplay = ({ user }: IUserDisplayProps) => {
  return (
    <UserWrapper>
      <UsernameDisplay>
        { user.username }
      </UsernameDisplay>
      <ColorDisplay color={user.color} />
    </UserWrapper>
  )
}

export default UserDisplay