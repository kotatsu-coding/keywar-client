import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useHistory } from 'react-router'
import { AudioProvider } from './hooks/useAudio'
import { MeProvider, useMe } from './hooks/useMe'
import { LobbyPage, EntrancePage, RoomPage } from './pages'
import { SocketManagerProvider } from './hooks/useSocket'

const PrivateRoute = ({ ...props }) => {
  const { me } = useMe()
  const history = useHistory()

  if (!me) {
    history.push('/')
    return null
  }

  return (
    <Route {...props} />
  )
}

function App() {
  return (
    <SocketManagerProvider>
      <Router>
        <MeProvider>
        <AudioProvider>
          <Switch>
            <Route exact path='/' component={EntrancePage} />
            <PrivateRoute path='/lobby' component={LobbyPage} />
            <PrivateRoute path='/room/:roomId' component={RoomPage} />
          </Switch>
        </AudioProvider>
        </MeProvider>
      </Router>
    </SocketManagerProvider>
  )
}

export default App
