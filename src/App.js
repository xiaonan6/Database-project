import Main from './pages/Main'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


function App() {
  return (
    <Router>
      <Switch>
        <Route component={Main} exact path='/'/>
      </Switch>
    </Router>
  );
}

export default App;
