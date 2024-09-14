import React from 'react'

function SearchItemIcon({ gender, age }: { gender: string; age: number; }) {
  let emoji = '';
  if (gender === 'm') {
    emoji = age < 18 ? '🏃‍♂️' : '👨‍🦳'; // Running boy for young man, dad for old man
  } else if (gender === 'f') {
    emoji = age < 18 ? '🏃‍♀️' : '👩‍🦳'; // Running girl for young girl, mom for old woman
  } else {
    emoji = '👤'; // Anonymous profile picture icon for other genders
  }

  return (
    <span style={{ marginBottom: '5px' }}>
      {emoji}
    </span>
  )
}

export default SearchItemIcon