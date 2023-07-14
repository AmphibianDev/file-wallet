import NavBar from './components/NavBar';
import Footer from './components/Footer';

import AppCSS from './App.module.css';

function App() {
  return (
    <div className={AppCSS.container}>
      <NavBar />
      <main>Content</main>
      <Footer />
    </div>
  );
}

export default App;
