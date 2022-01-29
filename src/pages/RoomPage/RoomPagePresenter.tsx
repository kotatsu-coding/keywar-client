import { ITeam, IUser } from '../../types'
import { TeamDisplay, MainDisplay, ChatBox } from '../../components'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'

interface IRoomPagePresenterProps {
  myTeam?: ITeam,
  opponent?: ITeam,
  remainingTime: number,
  onKeyDown: (event: React.KeyboardEvent) => void,
  users: IUser[],
  startGame: () => void,
  gameStatus: TGameStatus,
  socket: any,
  isJoined: boolean,
  audioSuccessRef: React.Ref<HTMLAudioElement>,
  audioFailRef: React.Ref<HTMLAudioElement>
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
  border: 1px solid black;
`

const ControllerWrapper = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
`

const BottomWrapper = styled.div`
  height: 300px;
`

export type TGameStatus = 'idle' | 'playing' | 'finished'


const RoomPagePresenter = ({
  myTeam,
  opponent,
  remainingTime,
  onKeyDown,
  users,
  startGame,
  gameStatus,
  socket,
  isJoined,
  audioSuccessRef,
  audioFailRef
}: IRoomPagePresenterProps) => {
  const me = useRecoilValue(meState)
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
              <button onClick={startGame} disabled={gameStatus === 'playing'}>Start</button>
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
      <audio src="/sound_success.mp3" ref={audioSuccessRef}></audio>
      <audio src='/sound_fail.mp3' ref={audioFailRef}></audio>
    </RoomPageWrapper>
  )
}

export default RoomPagePresenter