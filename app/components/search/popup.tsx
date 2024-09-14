import React, { useState, useRef } from 'react';
import styles from './popup.module.css'; // CSS module for styling
import { CSSTransition } from 'react-transition-group';
import SearchBody from './searchbody';
import SearchHeader from './searchheader';


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
      <SearchHeader onClose={onClose} />
      <SearchBody />
      </div>
    </div>
  </CSSTransition>
  );
};

export default Popup;
