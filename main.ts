import { get, post } from "./call_mb.js";
import { get_student } from "./generator.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

const mb_tld = "com";
const api_key = process.env.API_KEY;

export const fetch_yeargroups = async () => {
  const yeargroup_response = await get(mb_tld, "year-groups", api_key);
  return yeargroup_response.data;
};

const main_loop = async (count) => {
  const { year_groups } = await fetch_yeargroups();

  // This will pull the first G10 grade from the yeargroups, could be set to any number
  const program_grades = [10]; // can be set to more grades

  const grade_promises = program_grades.map(async (grade: number) => {
    const yg = year_groups.find((y) => y.grade_number === grade + 1);
    const student_array_promises = [...Array(Math.ceil(count))].map(
      async () => {
        return get_student(yg, null, mb_tld, api_key);
      }
    );

    const student_array = await Promise.all(student_array_promises);

    return { count: student_array.length, yg, student_array };
  });
  const grades = await Promise.all(grade_promises);
  console.log(grades);

  fs.writeFileSync("output.json", JSON.stringify(grades));
};

main_loop(3);
