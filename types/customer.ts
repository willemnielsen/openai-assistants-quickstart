export interface Customer {
  id: number;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  family: Family[];
}

export interface Family {
  id: number;
  full_name: string;
  relationship: "parent" | "child" | "sibling" | "other";
}
