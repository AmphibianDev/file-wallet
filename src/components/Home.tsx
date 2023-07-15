import InputSection from './InputSection';
import OutputSection from './OutputSection';

import HomeCSS from './Home.module.css';

const Home = () => {
  return (
    <div>
      <aside>warning content</aside>
      <main className={HomeCSS.mainContainer}>
        <InputSection />
        <OutputSection />
      </main>
    </div>
  );
};

export default Home;
