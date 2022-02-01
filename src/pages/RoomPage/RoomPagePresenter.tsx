import styled from 'styled-components'
import { TeamDisplay, MainDisplay, ChatBox } from '../../components'
import { EGameStatus, IMe, ITeam, IUser } from '../../types'

interface IRoomPagePresenterProps {
  me: IMe | null,
  myTeam?: ITeam,
  opponent?: ITeam,
  remainingTime: number,
  onKeyDown: (event: React.KeyboardEvent) => void,
  users: IUser[],
  startGame: () => void,
  gameStatus: EGameStatus,
  socket: any,
  isJoined: boolean,
}

const RoomPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px 30px;
`

const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`

const MainWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60%;
`

const ControllerWrapper = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
`

const BottomWrapper = styled.div`
  height: 300px;
`

const RoomPagePresenter = ({
  me,
  myTeam,
  opponent,
  remainingTime,
  onKeyDown,
  users,
  startGame,
  gameStatus,
  socket,
  isJoined,
}: IRoomPagePresenterProps) => {
  return (
    <RoomPageWrapper>
      <TopWrapper>
        { myTeam && opponent  &&
          <>
            <TopContent>
              Time:{ remainingTime.toFixed(2) }
            </TopContent>
            <TopContent>
              Score (My Team): {myTeam.score}
            </TopContent>
            <TopContent>
              Score (Opponent): {opponent.score}
            </TopContent>
          </>
      }
      </TopWrapper>
      <MainWrapper 
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <TeamDisplay users={users.slice(0, 2)} />
        <MainDisplay teams={(myTeam && opponent) ? [myTeam, opponent] : []} />
        <TeamDisplay users={users.slice(2)} />
      </MainWrapper>
      <ControllerWrapper>
        {
          me?.is_host ? (
            <div>
              <button onClick={startGame} disabled={gameStatus === EGameStatus.PLAYING}>Start</button>
            </div>
          )
          : (
            <div></div>
          )
        }
      </ControllerWrapper>
      <BottomWrapper>
        <ChatBox socket={socket} isJoined={isJoined} />
      </BottomWrapper>
    </RoomPageWrapper>
  )
}

export default RoomPagePresenter