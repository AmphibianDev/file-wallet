import { Link } from 'react-router-dom';

import { RiQuestionnaireFill } from 'react-icons/ri';
import { MdLightMode } from 'react-icons/md';
import NavBarCSS from './NavBar.module.css';

import useThemeStore from './Theme.store';

const NavBar = () => {
  const { toggleTheme } = useThemeStore();

  return (
    <header>
      <nav className={NavBarCSS.container}>
        <Link to="/" className={NavBarCSS.title}>
          File Wallet
        </Link>
        <ul className={NavBarCSS.list}>
          <li>
            <Link
              to="/faq"
              className={NavBarCSS.btn}
              aria-label="Frequent Ask Questions"
            >
              <RiQuestionnaireFill />
            </Link>
          </li>
          <li>
            <button
              className={NavBarCSS.btn}
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              <MdLightMode />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
