import React, { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './popup.module.css'
import { KeyboardEvent } from 'react'

function SearchHeader({ onClose, onSearchResults, onKeyNavigation }: { 
  onClose: () => void, 
  onSearchResults: (data: any) => void,
  onKeyNavigation: (direction: 'up' | 'down' | 'enter') => void 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(async (query: string) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`/api/search?query=${encodedQuery}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      const data = await response.json();
      // Handle the search results here
      // Send search results back to the parent component
      if (typeof onSearchResults === 'function') {
        onSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed in SearchHeader:', e.key);
    if (e.key === 'ArrowUp') {
      console.log('Navigating up');
      onKeyNavigation('up');
    } else if (e.key === 'ArrowDown') {
      console.log('Navigating down');
      onKeyNavigation('down');
    } else if (e.key === 'Enter') {
      console.log('Enter pressed');
      onKeyNavigation('enter');
    }
  };

  return (
    <header className={styles.popupHeader}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input
        placeholder='Find customer'
        className={styles.searchInput}
        autoFocus
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.close} onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={27} height={27}>
          <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  )
}

export default SearchHeader