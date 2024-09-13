import { useState } from 'react';
import styles from '../shared/searchbar.module.css'; // Import CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ placeholder = "Search...", onClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleShow = () => {
    setShowPopup(true);
    console.log("clicked!")
  }
  const handleClose = () => setShowPopup(false);

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
      <>
        <button className={styles.searchBar} onClick={onClick}>
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        <p className={styles.searchInput}>Find customer, program, or event</p>
        </button>
      </>
      // </div>
  );
};

export default SearchBar;
