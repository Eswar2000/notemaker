import logo from './logo.svg';
import './App.css';
import Login from './screen/login';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form action="../../temp" method="POST">
          <button>Submit</button>
        </form>
      </header> */}
      <Login />
    </div>
  );
}

export default App;
