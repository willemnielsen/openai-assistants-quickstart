import { useState } from 'react';
import styles from '../shared/searchbar.module.css'; // Import CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Do something with the searchQuery (e.g., send it to a search API)
    console.log('Searching for:', searchQuery);
  };

  return (
      // <div className={styles.searchbox}>
      <div className={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
        >
        </input>
      </div>
      // </div>
  );
};

export default SearchBar;
