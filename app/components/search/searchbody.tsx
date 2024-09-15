import React, { useState, useEffect } from 'react';
import styles from './popup.module.css';
import SearchItem from './searchitem';
import { Customer } from '@/types/customer';

interface SearchBodyProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  selectedIndex: number;
}

const SearchBody: React.FC<SearchBodyProps> = ({ customers, onSelectCustomer, selectedIndex }) => {
  console.log('SearchBody render - selectedIndex:', selectedIndex, 'customers:', customers);
  return (
    <div className={styles.searchBody}>
      <ul className={styles.searchList}>
        {customers.map((customer, index) => (
          <SearchItem 
            key={customer.id} 
            customer={customer} 
            onSelect={() => onSelectCustomer(customer)}
            isSelected={index === selectedIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export default SearchBody;