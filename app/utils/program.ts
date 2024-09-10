import programs from './programs_09-06-24.json';
/**
 * Retrieves a list of programs based on the specified criteria.
 * 
 * @param department - The department of the programs.
 * @param ageSpec - The age range of the programs.
 * @param days - The days of the week the programs are available.
 * @param gender - The gender of the programs.
 * @param locations - The locations of the programs.
 * @param timeRange - The time range of the programs.
 * @returns An object containing the program details.
 */
function getPrograms(
  department: string = 'All',
  ageSpec: {range: number[], unit: string} = {range: [], unit: ''},
  gender: string = 'Co-Ed',
  days: string[] = [],
  locations: string[] = [],
  timeRange: {start: string, end: string} = {start: '', end: ''},
  names: string[] = []
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

  function getMins(timeString: string): number {
     // Extract hours and minutes using a regex pattern
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})([ap]m)?/);
    if (!timeMatch) {
      console.log(timeString);
      return 0;
    }
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3];
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    // Return number of minutes
    return hours * 60 + minutes;
  }

  


  function timeoverlap(t1: {start: string, end: string}, t2: {start: string, end: string}): boolean {
    const t1start = getMins(t1.start);
    const t1end = getMins(t1.end);
    const t2start = getMins(t2.start);
    const t2end = getMins(t2.end);
    // console.log(t1.start, t1.end, t2.start, t2.end);
    // console.log(t1start, t1end, t2start, t2end);
    return (t1start >= t2start && t1start <= t2end) || (t1end >= t2start && t1end <= t2end) || (t1start <= t2start && t1end >= t2end);
  }

  const filteredPrograms = programs.filter((program) => {
    return (
      (department === 'All' || program.Department === department) &&
      (ageSpec.range.length === 0 || rangeoverlap(ageSpec.range, program['Age Range'])) &&
      (days.length === 0 || days.includes(program.Day)) &&
      (gender === 'Co-Ed' || gendermatch(department, gender, program.Gender)) &&
      (locations.length === 0 || locations.includes(program.Location)) &&
      (timeRange.start === '' || timeoverlap(timeRange, {"start":program['Start Time'], "end": program['End Time']})) &&
      (names.length === 0 || names.some(n => program['Clean Name'].toLowerCase().includes(n.toLowerCase())))
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
