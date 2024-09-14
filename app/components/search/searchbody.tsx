import React from 'react'
import styles from './popup.module.css'
import SearchItem from './searchitem'
import { Customer } from '@/types/customer';

interface SearchBodyProps {
  customers: Customer[];
}

function SearchBody({ customers }: SearchBodyProps) {
  const sampleCustomers = [
    {
      name: 'Daenerys Targaryen',
      gender: 'female',
      email: 'dtargaryen@example.com',
      phone: '9876543210',
      birthdate: '05/25/1986',
      family_ids: [4, 5, 6]
    },
    {
      name: 'Tyrion Lannister',
      gender: 'male',
      email: 'tlannister@example.com',
      phone: '5678901234',
      birthdate: '12/02/1978',
      family_ids: [7, 8, 9]
    },
    {
      name: 'Arya Stark',
      gender: 'female',
      email: 'astark@example.com',
      phone: '4567890123',
      birthdate: '11/25/2010',
      family_ids: [10, 11, 12]
    },
  ];

  const customerItems = customers.map((customer, index) => (
    <SearchItem key={index} customer={customer} />
  ));

  return (
    <article className={styles.searchContent}>
      {customerItems}
    </article>
  );
}

export default SearchBody