import styled from 'styled-components'
import { TeamDisplay, MainDisplay, ChatBox } from '../../components'
import { EGameStatus, IMe, IRoom, IGame } from '../../types'

interface IRoomPagePresenterProps {
  me: IMe | null,
  remainingTime: number,
  onKeyDown: (event: React.KeyboardEvent) => void,
  room?: IRoom,
  game?: IGame,
  startGame: () => void,
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
  remainingTime,
  onKeyDown,
  startGame,
  room,
  game,
  socket,
  isJoined,
}: IRoomPagePresenterProps) => {
  return (
    <RoomPageWrapper>
      <TopWrapper>
        <TopContent>
          Time:{ remainingTime.toFixed(2) }
        </TopContent>
        {
          game?.teams.map(team => (
            <TopContent>
              Score (Team {team.id}): {team.score}
            </TopContent>
          ))
        }
      </TopWrapper>
      <MainWrapper 
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <TeamDisplay team={room?.teams[0]} />
        <MainDisplay teams={game?.teams ?? []} />
        {
          room && room.teams.length === 2 &&
            <TeamDisplay team={room?.teams[1]} />
        }
      </MainWrapper>
      <ControllerWrapper>
        {
          me?.is_host ? (
            <div>
              <button onClick={startGame} disabled={game?.gameStatus === EGameStatus.PLAYING}>Start</button>
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