import programs from './ClassesCurrentFuture_09-02_tollm_withages_times.json';
/**
 * Retrieves a list of programs based on the specified criteria.
 * 
 * @param season - The season of the programs.
 * @param department - The department of the programs.
 * @param ages - The age range of the programs.
 * @param days - The days of the week the programs are available.
 * @param times - The times of the day the programs are available.
 * @returns An object containing the program details.
 */
function getPrograms(season: string = 'all',
  department: string = 'all',
  ages: string[] = [],
  days: string[] = [],
  times: string[] = []) {
  // search for programs based on the specified criteria
  console.log('Searching for programs...');
  // console.log("Season: ", season);
  // console.log("Department: ", department);
  console.log("Ages: ", ages);
  // console.log("Days: ", days);
  // console.log("Times: ", times);
  // load the program details from a file
  console.log(programs);
  // filter the programs based on the specified criteria
  const filteredPrograms = programs.filter((program) => {
    return (
      (season === 'all' || program.Season === season) &&
      // (department === 'all' || program.Department === department) &&
      (ages.length === 0 || ages.includes(program.age)) &&
      (days.length === 0 || days.includes(program.day)) &&
      (times.length === 0 || times.includes(program.time))
    );
  });
}

export { getPrograms };
