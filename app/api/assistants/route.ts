import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  const pull_description = `
  Pulls data from one SQL table into another new table, applying any filters needed. Use
  this when the task requires filtering data, like if the user says 'get me 
  all the friend requests for monday 4v4.
`;
  const table_name_description = `
  The table to pull from so if the user needs friend requests this would be
  'friend_requests'. Or if they ask, 'how many accounts were
  created after July this year?', this would be 'customers'.
  `;
  const new_table_name_description = `
  The name of the new table to store the queried data. Be descriptive, if they ask
  for friend requests from monday 4v4 you would call it something like, 
  friend_requests_mon_4v4_FA24. 
  `;

  const filters_description = `
  The description of filters to apply. So if the user asks, 'how many accounts were
  created after July this year?' this would be, 'created after 
  July 2024'. Notice how you make the instruction as precise
  as possible (adding 2024). Or if they say 'I need to send an email to last year's 4v4 kids.'
  this would be 'customers who were in 4v4 in Spring 2024'
  `;

  const instructions = `
  You are a helpful assistant. Use the tools to assist the
  user. Here are some examples: 
  Input: Show me all the basketball programs for my 8 year old son
  Output: Here are all the basketball programs for your 8 year old son.
  I'm assuming he is in 2nd or 3rd grade:
  **Hoop Academy**
  Start Date: September 7, 2024
  1. Saturday, 12:30pm - 2:00pm for ages 8-10.

  **Basketball Classes**
  *LEVEL-UP*
  Start Date: September 6, 2024
  1. Friday, 4:55pm - 5:55pm for grades 1st - 3rd.
  2. Monday, 4:55pm - 5:55pm for grades K - 2nd.
  3. Thursday, 3:50pm - 4:50pm for grades K - 2nd.
  4. Wednesday, 3:50pm - 4:50pm for grades K - 2nd.

  Input: Show me all the Saturday basketball programs for my 11 year old daughter.
  (Note: The only girls program for basketball is Hustle Basketball Classes.) 
  Output: Here are all the basketball programs for your 11 year old daughter.
  I'm assuming she is in 5th or 6th grade:
  **Hustle Basketball Classes**
  Start Date: September 7, 2024
  1. Saturday 4:30pm-5:45pm (5th-6th)
  Input: What about on Sundays?
  Output: I'm sorry, we don't have any basketball programs for girls on Sundays.

  Input: Show me all the after-school multi-sport programs for my 5 year old son
  (Note that after school is in weekday afternoons.)
  Output: Here are all the multi-sport programs for your 5 year old son.
  I'm assuming he is in Kindergarten:
  **Multi-Sport Programs**
  Start Date: September 7, 2024
  1. Tuesday 3:50pm-4:50pm
  2. Thursday 3:50pm-4:50pm
  `

  const examplesMulti = `
  Input: Show me all the basketball programs for my 8 year old son
  Output: Here are all the basketball programs for your 8 year old son.
  I'm assuming he is in 2nd or 3rd grade:
  **Hoop Academy**
  Start Date: September 7, 2024
  1. Saturday, 12:30pm - 2:00pm for ages 8-10.

  **Basketball Classes**
  *LEVEL-UP*
  Start Date: September 6, 2024
  1. Friday, 4:55pm - 5:55pm for grades 1st - 3rd.
  2. Monday, 4:55pm - 5:55pm for grades K - 2nd.
  3. Thursday, 3:50pm - 4:50pm for grades K - 2nd.
  4. Wednesday, 3:50pm - 4:50pm for grades K - 2nd.

  Input: Show me all the Saturday basketball programs for my 11 year old daughter.
  (Note: The only girls program for basketball is Hustle Basketball Classes.) 
  Output: Here are all the basketball programs for your 11 year old daughter.
  I'm assuming she is in 5th or 6th grade:
  **Hustle Basketball Classes**
  Start Date: September 7, 2024
  1. Saturday 4:30pm-5:45pm (5th-6th)
  Input: What about on Sundays?
  Output: I'm sorry, we don't have any basketball programs for girls on Sundays.

  Input: Show me all the after-school multi-sport programs for my 5 year old son
  (Note that after school is in weekday afternoons.)
  Output: Here are all the multi-sport programs for your 5 year old son.
  I'm assuming he is in Kindergarten:
  **Multi-Sport Programs**
  Start Date: September 7, 2024
  1. Tuesday 3:50pm-4:50pm
  2. Thursday 3:50pm-4:50pm
  `;

  const examples = `
  Here are some examples: 
  Input: Show me all the basketball programs for my 8 year old son
  Output: Here are all the basketball programs for 8 year old boys
  that we offer. I'm assuming he is in 2nd or 3rd grade: 
  1. Hoop Academy:
  - Saturdays from 12:30pm to 2:00pm for ages 8-10.
  2. LEVEL-UP:
  - Friday from 4:55pm - 5:55pm, for grades 1st - 3rd.
  - Monday from 4:55pm - 5:55pm, for grades K - 2nd.
  - Thursday from 3:50pm - 4:50pm, for grades K - 2nd.
  - Wednesday from 3:50pm - 4:50pm, for grades K - 2nd.
  (NOTE: Hustle was not shown because it is a girls-only program)

  Input: Show me all Cheer programs for my 11 year old daughter
  Output: Here are all the cheer programs for 11 year olds
  that we offer. I'm assuming she is in 5th or 6th grade:
  1. Cheer Champs:
  - Tuesday from 5:40 pm to 6:35 pm for grades 5th/6th
  - Wednesday from 5:40 pm to 6:35 pm for grades 5th/6th
  - Friday from 5:40 pm to 6:35 pm for grades 5th/6th

  Input: Show me all multi-sport programs for my 5 year old son
  Output: Here are all the multi-sport programs for 5 year
  olds that we offer. I'm assuming he is in Kindergarten:
  1. Multi-Sport Programs:
  - Tuesday from 3:50 pm to 4:50 pm
  - Thursday from 3:50 pm to 4:50 pm
  - Saturday from 10:30 am to 11:30 am
  `;

  const instructionsMultiFile = `
  You are helping give information about youth sports programs. 
  Use the file search tool to show information
  to the user. Each file contains information about a different program.
  For basketball, the programs are split into several files:

  Co-Ed Basketball Classes, Co-Ed Elite Basketball Training Academy, 
  Boys Hoop Academy,Girls Hustle Basketball Classes, Girls Hustle Hoop Academy.

  If the user asks for basketball programs for their 8 year old son,
  you would search the Co-Ed Basketball Classes, 
  Co-Ed Elite Basketball Training Academy, and Boys Hoop Academy files. 
  Then only show programs that are for an 8 year old.

  If the user asks for basketball programs for their 11 year old daughter,
  you would search the Co-Ed Basketball Classes, 
  Co-Ed Elite Basketball Training Academy, 
  Girls Hustle Basketball Classes, and Girls Hustle Hoop Academy files.
  Here are some examples:
  `;

const instructionsFunc = `
You are helping give information about youth sports programs.
Use the getPrograms tool to show information to the user.
Here are some examples:
`;

const examplesFunc = `
Input: Show me all the basketball programs for my 8 year old son
Toolcall: getPrograms(Department: "Basketball", Ages: [8, "Years"])
Output: Here are all the basketball programs for an 8 year old boy
I'm assuming he is in 2nd or 3rd grade:
1. Hoop Academy
- Saturdays from 12:30pm to 2:00pm for ages 8-10
2. LEVEL-UP
- Friday from 4:55pm - 5:55pm, for grades 1st - 3rd
- Monday from 4:55pm - 5:55pm, for grades K - 2nd
- Thursday from 3:50pm - 4:50pm, for grades K - 2nd
- Wednesday from 3:50pm - 4:50pm, for grades K - 2nd
`;

const getProgramsDescription = `
Retrieves a list of programs based on the specified criteria.
So for example, if the user asks for basketball programs for their 11 year old daughter,
you would call this function with the parameters:
- Department: "Basketball"
- Ages: [11, "Years"]
- Gender: Female
`;



  const assistant = await openai.beta.assistants.create({
    instructions: instructionsMultiFile + examplesMulti,
    name: "Dash-gpt",
    model: "gpt-4o",
    tools: [
      { type: "code_interpreter" },
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Determine weather in my location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["c", "f"],
              },
            },
            required: ["location"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getPrograms",
          description: getProgramsDescription,
          parameters: {
            type: "object",
            properties: {
              "Ages": {
                type: "object",
                properties: {
                  "quantities": {
                    type: "array",
                    items: {
                      type: "number",
                      description: "Each age to include, e.g 8",
                    },
                    description: "The age spec, e.g. Ages 8-10 -> [8, 9, 10]"
                  },
                  "unit": {
                    type: "string",
                    description: "The unit of the age, only options are 'Years', 'Grades' or 'Months'",
                  },
                },
                description: 
                "Optional argument to specify age range of programs, any if unspecified. So for an 8 year old, you would use {'quantities': [8], 'unit': 'Years'}",
              },
              "Department": {
                type: "string",
                description: 
                "Optional argument to specify department of programs, any if unspecified. Only options are 'Basketball', 'Cheer and Dance', 'Multi-Sport' or 'Flag Football",
              },
              "Gender": {
                type: "string",
                description: 
                "Optional argument to specify gender of programs, any if unspecified, so for 10 year old daughter you would use 'Female'",
              },
              "Day": {
                type: "array",
                items: {
                  type: "string"
                },
                description: 
                "Optional argument to specify days of programs, any if unspecified, so for Monday and Wednesday, you would use ['Monday', 'Wednesday']",
              }
            },
            required: [],
          },
        },
      }
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
