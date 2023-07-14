import AppCSS from './App.module.css';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className={AppCSS.container}>
      <NavBar />
    </div>
  );
}

export default App;
