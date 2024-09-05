import programs from './program_data.json';
/**
 * Retrieves a list of programs based on the specified criteria.
 * 
 * @param department - The department of the programs.
 * @param ages - The age range of the programs.
 * @param days - The days of the week the programs are available.
 * @param gender - The gender of the programs.
 * @returns An object containing the program details.
 */
function getPrograms(
  department: string = 'All',
  ages: number[] = [],
  age_type: string = 'Years',
  gender: string = 'Co-Ed',
  days: string[] = [],
  ) {
    // convert the grades if age_type is 'Grades'
    if (age_type === 'Grades') {
      ages = [ages[0] + 2, ages[1] + 3];
    }
  function rangeoverlap(r1: number[], r2: number[]): boolean {
    // check if the age ranges overlap
    return (r1[0] >= r2[0] && r1[0] <= r2[1]) || (r1[1] >= r2[0] && r1[1] <= r2[1]);
  }
  // search for programs based on the specified criteria
  console.log('Searching for programs...');

  // filter the programs based on the specified criteria
  const filteredPrograms = programs.filter((program) => {
    return (
      // (department === 'all' || program.Department === department) &&
      (ages.length === 0 || rangeoverlap(ages, program['Age Range'])) &&
      (days.length === 0 || days.includes(program.Day))
    );
  });
  console.log(filteredPrograms);
  return filteredPrograms;
}

export { getPrograms };
