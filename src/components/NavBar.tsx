import { RiQuestionnaireFill } from 'react-icons/ri';
import { MdLightMode } from 'react-icons/md';
import NavBarCSS from './NavBar.module.css';

const NavBar = () => {
  return (
    <nav className={NavBarCSS.container}>
      <a href="/" className={NavBarCSS.title}>
        File Wallet
      </a>
      <ul className={NavBarCSS.list}>
        <li>
          <a href="\" className={NavBarCSS.btn}>
            <RiQuestionnaireFill />
          </a>
        </li>
        <li>
          <button className={NavBarCSS.btn}>
            <MdLightMode />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
