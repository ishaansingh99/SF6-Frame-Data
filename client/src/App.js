import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    console.log(data)
  })
};

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <button onClick={apiCall}>Make API Call</button>

      </header>
    </div>
  );
}

export default App;
