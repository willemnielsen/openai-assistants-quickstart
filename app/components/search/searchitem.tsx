import React from 'react'
import styles from './popup.module.css'
import SearchItemIcon from './searchitemicon'

function SearchItem({ customer }) {
  function calculateAge(bday: string) {
    const birthdate = new Date(bday);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }
    return age;
  }

  const age = calculateAge(customer.birthdate);
  return (
    <li className={styles.searchItem}>
      <a>
        <div className={styles.searchItemName}>
          <SearchItemIcon gender={customer.gender} age={age} />
          {customer.name}
        </div>
        <div className={styles.searchItemContact}>
          <span className={styles.emoji}>
            📞 <span>{customer.phone}</span>
          </span> 
          <span className={styles.emoji}>
            📧 <span>{customer.email}</span>
          </span>
          <span className={styles.emoji}>
            🎂 <span>{customer.birthdate}</span>
          </span>
        </div>
      </a>
    </li>
  )
}

export default SearchItem