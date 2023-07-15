import NavBar from './components/NavBar';
import Footer from './components/Footer';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';

import AppCSS from './App.module.css';

function App() {
  return (
    <div className={AppCSS.container}>
      <NavBar />
      <main>
        <InputSection />
        <OutputSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
