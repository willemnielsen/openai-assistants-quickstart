import React from 'react'
import styles from './popup.module.css'
import SearchItemIcon from './searchitemicon'
import { Customer } from '@/types/customer';

interface SearchItemProps {
  customer: Customer;
  onSelect: () => void;
  isSelected: boolean;
}

function SearchItem({ customer, onSelect, isSelected }: SearchItemProps) {
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

  const formattedPhone = customer.phone
    ? customer.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    : 'N/A';
  const age = calculateAge(customer.birthdate);
  const formattedBirthdate = customer.birthdate
    ? customer.birthdate.split('T')[0]
    : 'N/A';
  
  console.log('SearchItem render - isSelected:', isSelected, 'customer:', customer.full_name);
  
  return (
    <li 
      className={`${styles.searchItem} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <SearchItemIcon gender={customer.gender} age={age} />
      <div className={styles.searchItemInfo}>
        <div className={styles.searchItemName}>{customer.full_name}</div>
        <div className={styles.searchItemContact}>
          <div>{formattedPhone}</div>
          <div>{customer.email}</div>
          <div>{formattedBirthdate}</div>
        </div>
      </div>
      <div className={styles.arrowDiv}>
        <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4l8 8-8 8" fill="none" strokeWidth="2"/>
        </svg>
      </div>
    </li>
  )
}

export default SearchItem