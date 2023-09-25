import { useState, useRef, useMemo } from 'react';

import Modal from './Modal';
import InputField from './InputField';
import CryptoIcon from './CryptoIcon';

import useCryptoStore from './Crypto.store';

import CryptoListCSS from './CryptoListModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

const CryptoListModal = ({ open, onClose }: Props) => {
  const { cryptoName, setCrypto } = useCryptoStore();

  const [searchText, setSearchText] = useState('');
  const ulRef = useRef<HTMLUListElement>(null);

  const handleSearchTextChange = (str: string) => {
    ulRef.current?.scrollTo(0, 0);
    setSearchText(str);
  };

  const handleClose = () => {
    handleSearchTextChange('');
    onClose();
  };

  const items = useMemo(() => {
    const filteredItems = window.networksNames.filter(item =>
      item.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    );

    // Move the selected item to the top of the list
    const selectedItemIndex = filteredItems.indexOf(cryptoName);
    if (selectedItemIndex !== -1) {
      filteredItems.splice(selectedItemIndex, 1);
      filteredItems.unshift(cryptoName);
    }

    return filteredItems;
  }, [searchText, cryptoName]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-label="Cryptocurrency Selection Panel"
    >
      <div className={CryptoListCSS.container} role="search">
        <InputField
          type="search"
          placeholder="Search..."
          value={searchText}
          onChange={event => handleSearchTextChange(event.target.value)}
        />
        <ul
          ref={ulRef}
          className={CryptoListCSS.list}
          role="listbox"
          tabIndex={-1}
        >
          {items.map(item => (
            <ListItem
              key={item}
              label={item}
              selected={cryptoName === item}
              onClick={() => {
                setCrypto(item);
                handleClose();
              }}
            />
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default CryptoListModal;

type ListItemProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

const ListItem = ({ label, selected, onClick }: ListItemProps) => {
  const [cryptoTicker, cryptoFullName] = label.split(' - ');

  return (
    <li
      onClick={onClick}
      className={CryptoListCSS.item}
      aria-selected={selected}
      role="option"
      tabIndex={0} // Make it focusable
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); // Avoid scrolling on space key
          onClick();
        }
      }}
    >
      <CryptoIcon
        iconName={cryptoTicker ?? ''}
        resolution="128"
        color="color"
        className={CryptoListCSS.icon}
        aria-hidden="true" // Hide from screen readers as it is decorative
      />
      <div className={CryptoListCSS.itemText}>
        <h3>{cryptoFullName}</h3>
        <span>{cryptoTicker}</span>
      </div>
    </li>
  );
};
