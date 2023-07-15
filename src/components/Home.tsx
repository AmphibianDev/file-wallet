import InputSection from './InputSection';
import OutputSection from './OutputSection';
import WarningAside from './WarningAside';

import HomeCSS from './Home.module.css';

const Home = () => {
  return (
    <div className={HomeCSS.container}>
      <WarningAside />
      <main className={HomeCSS.mainContainer}>
        <InputSection />
        <OutputSection />
      </main>
    </div>
  );
};

export default Home;
