import programs from './programs_09-06-24.json';
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
  ageSpec: {range: number[], unit: string} = {range: [], unit: ''},
  gender: string = 'Co-Ed',
  days: string[] = [],
  locations: string[] = []
  ) {
  // convert the grades if age_type is 'Grades'
  if (ageSpec.range.length === 1) {
    ageSpec.range = [ageSpec.range[0], ageSpec.range[0]];
  }
  if (ageSpec.unit === 'Grades') {
    ageSpec.range = [ageSpec.range[0] + 5, ageSpec.range[1] + 6];
  }
  function rangeoverlap(r1: number[], r2: number[]): boolean {
    // check if the age ranges overlap
    return (r1[0] >= r2[0] && r1[0] <= r2[1]) || (r1[1] >= r2[0] && r1[1] <= r2[1]);
  }
  function gendermatch(dep: string, g1: string, g2: string): boolean {
    // for girls cheer just return true
    if (dep === 'Cheer & Dance' && g1 === 'Girls') {
      return true;
    }
    // check if the gender criteria matches
    return g1 === g2 || (g1 === 'Boys' && g2 === 'Co-Ed');
  }

  // search for programs based on the specified criteria
  // filter the programs based on the specified criteria
  const filteredPrograms = programs.filter((program) => {
    return (
      (department === 'All' || program.Department === department) &&
      (ageSpec.range.length === 0 || rangeoverlap(ageSpec.range, program['Age Range'])) &&
      (days.length === 0 || days.includes(program.Day)) &&
      (gender === 'Co-Ed' || gendermatch(department, gender, program.Gender)) &&
      (locations.length === 0 || locations.includes(program.Location))
    );
  })

  const toTable = filteredPrograms.map((program) => {
    const out = {
      "ID": program.ID,
      "Department": program.Department,
      "Name": program['Clean Name'],
      "Day": program.Day,
      "Start Time": program['Start Time'],
      "End Time": program['End Time'],
      'Gender': program.Gender,
      "Location": program.Location,
      "Age (Years)": program['Clean Age']
    };
    return out;
  });
  return toTable;
}

export { getPrograms };
