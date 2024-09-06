import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
const getProgramsDescription = `
Retrieves a list of classes from our current season, based on the specified criteria. 
So if the user asks, "My kid is 8 and he likes multi-sport", you would call this tool with
getPrograms(department: "Multi-Sport", ageSpec: {range: [8], unit: "Years"}, "gender": "Boys")
The tool will return a list of classes that match the criteria, which you can then summarize for the user.
`;

const getProgramsExamples = `
  Input: "bball monday-wednesday 6 year old at fb headquarters or all souls"
  Output: {"department":"Basketball","ageSpec":{"range":[6],"unit":"Years"},"days":["Monday","Tuesday","Wednesday"], "locations":["FB HQ Main Court", "All Souls"]}
  Input: "4th grade girls cheer"
  Output: {"department":"Cheer & Dance","ageSpec":{"range":[4],"unit":"Grades"},"gender":"Girls"}
  Input: "What programs do you have for my son, he's 7 years old going into 1st grade."
  Output: {"department":"All","ageSpec":{"range":[7],"unit":"Years"}, "gender":"Boys"}
  Input: "My child is really into flag football. Do you have any programs for her?"
  Output: {"department":"Flag Football", "gender": "Girls"}
  Input: "Show me all the Fastbreak programs this fall"
  Output: {"department":"All"}
`;

const programInstruction = `
You are helping provide information about youth sports programs.
Use the tool to get program information and then summarize the results for the user.
Here are some examples of what arguments to provide to the tool:
${getProgramsExamples}
Here are full examples of how to use the tool and respond to the user:
Input: What are the basketball programs for my son who's in 4th grade? We can only do weekdays.
Toolcall: {"department":"Basketball","ageSpec":{"range":[4],"unit":"Grades", "days":["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}}
(table of program info will be outputted)
Output: (Summarize the info in the table, DO NOT NUMBER RESULTS.) 
Here are all our weekday basketball programs for a 4th grader at various days, times, and locations:

**Hoop Academy** - For ages 11-13:
  - Saturday, 2:00pm-3:30pm
**Elite Basketball Training Academy (ETA & PLAY)** - For ages 11-13:
  - Sunday, 9:30am-11:00am
**Elite Basketball Training Academy (ETA)** - For ages 11-13:
  - Tuesday, 7:00pm-8:00pm
  - Wednesday, 7:00pm-8:00pm
**Elite Basketball Training Academy (ETA)** - For ages 13-17:
  - Tuesday, 8:00pm-9:00pm
  - Wednesday, 8:00pm-9:00pm
**Hustle Basketball Classes** - For 6th-8th graders:
  - Monday, 7:00pm-8:00pm
  - Thursday, 7:00pm-8:00pm
  - Tuesday, 7:00pm-8:00pm
**Hustle Hoop Academy** - For 7th/8th graders:
  - Saturday, 1:30pm-2:45pm

Let me know if you need more information on any of these programs.

Here is another full example:
Input: "What multi-sport programs do you have for my 6-year-old?"
Toolcall: {"department":"Multi-Sport","ageSpec":{"range":[6, 7],"unit":"Years"}}
Output: (Summarize the info in the table, DO NOT NUMBER RESULTS.)
Here are the multi-sport programs available for 6-7 year olds:

**Multi-Sport Fun** - For ages 6-7:
  - Monday, 4:00pm-5:00pm
  - Wednesday, 4:00pm-5:00pm
  - Friday, 4:00pm-5:00pm
**Multi-Sport Mania** - For ages 6-7:
  - Tuesday, 4:00pm-5:00pm
  - Thursday, 4:00pm-5:00pm
**Multi-Sport Madness** - For ages 6-7:
  - Saturday, 10:00am-11:00am

Do any of these programs interest you?.
`;

const locDescription = `Optional argument to specify locations of programs, any if unspecified, the options are
FB HQ Main Court, FB Studios, All Souls, Central Park East (97th / 5th), 
Central Park East (84th / 5th), Allen Stevenson, Dwight Athletic Center, 
Trevor Day School, Sacred Heart Athletic Center, PS 183, Windward
`;

  const assistant = await openai.beta.assistants.create({
    instructions: programInstruction,
    name: "Dash-gpt",
    model: "gpt-4o-mini",
    tools: [
      {
        type: "function",
        function: {
          name: "getPrograms",
          description: getProgramsDescription,
          parameters: {
            type: "object",
            properties: {
              "department": {
                type: "string",
                description: 
                "Optional argument to specify department of programs, any if unspecified. Only options are 'All','Basketball', 'Cheer & Dance', 'Multi-Sport' or 'Flag Football",
              },
              "ageSpec": {
                type: "object",
                properties: {
                  "range": {
                    type: "array",
                    items: {
                      type: "number"
                    }
                  },
                  "unit": {
                    type: "string"
                  }
                },
                description: "Optional argument for age range of programs, 4th graders would be {range: [4], unit: 'Grades'}, 7th graders would be {range: [7], unit: 'Grades'}. 10 to 12 year olds would be {range: [10, 11, 12], unit: 'Years'}. USE THE UNIT SPECIFIED BY THE USER. DO NOT CHANGE THE UNIT.",
              },
              "gender": {
                type: "string",
                description: 
                "Optional argument to specify gender of programs, any if unspecified, so for 10 year old daughter you would use 'Girls', for 8 year old boy you would use 'Boys'",
              },
              "days": {
                type: "array",
                items: {
                  type: "string"
                },
                description: 
                "Optional argument to specify days of programs, any if unspecified, so for Monday and Wednesday, you would use ['Monday', 'Wednesday']",
              },
              "locations": {
                type: "array",
                items: {
                  type: "string"
                },
                description: locDescription,
              },
            },
            required: [],
            },
        },
      }
    ],
    temperature: 0, // Set the temperature to a lower value for less random output
  });
  return Response.json({ assistantId: assistant.id });
}
