import React, { useState, useRef } from 'react';
import styles from '../shared/popup.module.css'; // CSS module for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';


const Popup = ({isOpen, onClose}) => {
  const [isShowing, setIsShowing] = useState(false); // State for showing the popup
  const nodeRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <CSSTransition
    nodeRef={nodeRef}
    timeout={{appear: 0, enter: 1000,exit: 100 }}
    in={isOpen}
    classNames={{
      appear: styles.overlayAppear,
      enter: styles.overlayEnter,
      enterActive: styles.overlayEnterActive,
      exit: styles.overlayExit,
      exitActive: styles.overlayExitActive,
    }}
    unmountOnExit
  >
    <div
      ref={nodeRef}
      className={styles.popupOverlay}
      onClick={handleOverlayClick}
    >
      <div className={styles.popupContent}>
      <header className={styles.popupHeader}>
        <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input placeholder='Find customer'className={styles.searchInput}/>
        </div>
        <a className={styles.close}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={27} height={27}>
          <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </a>
      </header>
      </div>
    </div>
  </CSSTransition>
  );
};

export default Popup;
