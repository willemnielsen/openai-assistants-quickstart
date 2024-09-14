import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './popup.module.css'

function SearchHeader() {
  return (
    <header className={styles.popupHeader}>
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        <input placeholder='Find customer' className={styles.searchInput} autoFocus/>
        <a className={styles.close}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={27} height={27}>
          <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </a>
      </header>
  )
}

export default SearchHeader