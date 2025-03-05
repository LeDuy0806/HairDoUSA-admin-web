import Routers from './routers';
import moment from 'moment-timezone';

function App() {
  moment.tz.setDefault('America/Los_Angeles');  

  return <Routers />;
}

export default App;
