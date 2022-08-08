export interface Parent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Sibling {
  parent_ids: Array<number>;
  last_name: String;
}

type gender = "m" | "f";

export interface Student {
  first_name: string;
  last_name: string;
  middle_name?: string;
  nickname?: string;
  other_name?: string;
  gender?: gender;
  birthday?: string;
  phone_number?: string;
  mobile_phone_number?: string;
  student_id?: string;
  street_address?: string;
  city?: string;
  country?: string;
  password?: string;
  email: string;
  year_group_id: number;
  parent_ids: Array<number>;
  nationalities?: Array<string>;
  languages?: Array<string>;
}

export interface Parent {
  first_name: string;
  last_name: string;
  middle_name?: string;
  nickname?: string;
  other_name?: string;
  gender?: gender;
  birthday?: string;
  phone_number?: string;
  mobile_phone_number?: string;
  student_id?: string;
  street_address?: string;
  city?: string;
  country?: string;
  password?: string;
  email: string;
  nationalities?: Array<string>;
  languages?: Array<string>;
}

export interface API_Year_Group {
  id: number;
  name: string;
  program: string;
  grade: string;
  grade_number: number;
  student_ids: Array<number>;
}
