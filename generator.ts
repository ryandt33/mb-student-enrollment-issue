import { faker } from "@faker-js/faker";
import { Student, Parent } from "./types/mb_types";
import { post } from "./call_mb.js";

type Student_Generator = (
  yeargroup: number,
  grade: number,
  last_name: string,
  parent_ids: Array<number>,
  mb_tld: string,
  api_key: string
) => Promise<Student>;

interface Nested_Parent {
  parent: Parent;
}

export const get_student = async (
  year_group,
  sibling,
  mb_tld,
  api_key
): Promise<Student> => {
  const stu = await student_gen(
    year_group.id,
    year_group.grade_number,
    sibling ? sibling.last_name : null,
    sibling ? sibling.parent_ids : [],
    mb_tld,
    api_key
  );
  return stu;
};

export const student_gen: Student_Generator = async (
  yeargroup: number,
  grade: number,
  last_name: string = null,
  parent_ids: Array<number> = [],
  mb_tld: string = null,
  api_key: string = null
): Promise<Student> => {
  const gender = Math.floor(Math.random() * 2) === 1 ? "female" : "male";
  const fake_first_name = faker.name.firstName(gender);
  const fake_last_name = last_name ? last_name : faker.name.lastName();

  const parent_promise: Promise<Nested_Parent>[] = [...Array(2)].map(
    async (p): Promise<Nested_Parent> => {
      return { parent: await parent_gen(mb_tld, api_key, fake_last_name) };
    }
  );

  const nested_parents = await Promise.all(parent_promise);

  const parents = nested_parents.map((p) => p.parent);

  const today = new Date();
  const midnight = new Date();
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);

  const birth_year = today.getFullYear() - grade - 4;

  const DAY_TO_MILLIS = 1000 * 60 * 60 * 24;
  const random_day = new Date(
    today.getTime() - Math.floor(Math.random() * 365 * DAY_TO_MILLIS)
  );

  const res = await post(mb_tld, "students", api_key, {
    first_name: fake_first_name,
    last_name: fake_last_name,
    middle_name:
      Math.floor(Math.random() * 100) > 50 ? faker.name.firstName(gender) : "",
    nickname:
      Math.floor(Math.random() * 100) > 90 ? faker.name.firstName(gender) : "",
    other_name:
      Math.floor(Math.random() * 100) > 80 ? faker.name.firstName(gender) : "",
    gender: gender === "female" ? "f" : "m",
    birthday: `${birth_year}-${
      random_day.getMonth() + 1
    }-${random_day.getDate()}`,
    mobile_phone_number: faker.phone.number(),
    student_id: `${today.getFullYear()}${
      today.getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1
    }${today.getDay() < 10 ? "0" + today.getDay() : today.getDay()}${Math.floor(
      (today.getTime() - midnight.getTime()) / 1000
    )}`,
    email: `${fake_first_name}.${fake_last_name}@fake.email`.toLowerCase(),
    year_group_id: yeargroup,
    parent_ids: parents.map((p) => p.id),
    nationalities: parents[0].nationalities,
    phone_number: parents[0].phone_number,
  });

  return res.data.student;
};

type Parent_Generator = (
  mb_tld: string,
  api_key: string,
  last_name: string
) => Promise<Parent>;

export const parent_gen: Parent_Generator = async (
  mb_tld,
  api_key,
  last_name: string
): Promise<Parent> => {
  const today = new Date();

  const birth_year = today.getFullYear() - Math.floor(Math.random() * 30 + 30);

  const DAY_TO_MILLIS = 1000 * 60 * 60 * 24;
  const random_day = new Date(
    today.getTime() - Math.floor(Math.random() * 365 * DAY_TO_MILLIS)
  );

  const fake_first_name = faker.name.firstName();
  const res = await post(mb_tld, "parents", api_key, {
    first_name: fake_first_name,
    last_name: last_name,
    email: `${fake_first_name}.${last_name}@fake.email`.toLowerCase(),
    birthday: `${birth_year}-${
      random_day.getMonth() + 1
    }-${random_day.getDate()}`,
    phone_number: faker.phone.number(),
    nationalities: [faker.address.countryCode()],
  });
  return res.data.parent;
};
