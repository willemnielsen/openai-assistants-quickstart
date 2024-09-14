import React from 'react'

function SearchItemIcon({ gender, age }: { gender: string; age: number; }) {
  let emoji = '';

  if (gender === 'male') {
    emoji = age < 18 ? '🏃‍♂️' : '👨‍🦳'; // Running boy for young man, dad for old man
  } else if (gender === 'female') {
    emoji = age < 18 ? '🏃‍♀️' : '👩‍🦳'; // Running girl for young girl, mom for old woman
  }
  return (
    <span style={{ marginBottom: '5px' }}>
      {emoji}
    </span>
  )
}

export default SearchItemIcon