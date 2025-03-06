import moment from 'moment-timezone';
import Routers from './routers';

function App() {
  moment.tz.setDefault('America/Los_Angeles');

  return <Routers />;
}

export default App;
