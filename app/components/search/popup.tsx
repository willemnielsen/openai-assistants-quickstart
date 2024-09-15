import React, { useState, useRef } from 'react';
import styles from './popup.module.css'; // CSS module for styling
import { CSSTransition } from 'react-transition-group';
import SearchBody from './searchbody';
import SearchHeader from './searchheader';
import { Customer } from '@/types/customer';
import { useRouter } from 'next/navigation';

const Popup = ({isOpen, onClose, onSelectCustomer}) => {
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const nodeRef = useRef(null);
  const router = useRouter();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSearchResults = (data: any[]) => {
    console.log('Received search results:', data);
    const transformedData: Customer[] = data.map(item => ({
      ...item,
      phone: item.phone_day, // Map phone_day to phone
      // Add any other necessary transformations here
    }));
    console.log('Transformed data:', transformedData);
    setSearchResults(transformedData);
    setSelectedIndex(0); // Reset selected index when new results come in
  };

  const handleCustomerSelect = (customer: Customer) => {
    console.log('Customer selected:', customer);
    onSelectCustomer(customer);
    onClose();
  };

  const handleKeyNavigation = (direction: 'up' | 'down' | 'enter') => {
    console.log('Key navigation:', direction, 'Current index:', selectedIndex);
    if (direction === 'up') {
      setSelectedIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : prev;
        console.log('New index after up:', newIndex);
        return newIndex;
      });
    } else if (direction === 'down') {
      setSelectedIndex((prev) => {
        const newIndex = prev < searchResults.length - 1 ? prev + 1 : prev;
        console.log('New index after down:', newIndex);
        return newIndex;
      });
    } else if (direction === 'enter') {
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        console.log('Selecting customer at index:', selectedIndex);
        handleCustomerSelect(searchResults[selectedIndex]);
      }
    }
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      timeout={{ appear: 0, enter: 1000, exit: 100 }}
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
      <div ref={nodeRef} className={styles.popupOverlay} onClick={handleOverlayClick}>
        <div className={styles.popupContent}>
          <SearchHeader 
            onClose={onClose} 
            onSearchResults={onSearchResults} 
            onKeyNavigation={handleKeyNavigation}
          />
          <SearchBody 
            customers={searchResults} 
            onSelectCustomer={handleCustomerSelect}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </CSSTransition>
  );
};

export default Popup;
