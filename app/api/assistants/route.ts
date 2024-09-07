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
  Input: "What programs do you have for my son, he's in kindergarten"
  Output: {"department":"All","ageSpec":{"range":[0],"unit":"Grades"}, "gender":"Boys"}
  Input: "My child is really into flag football. Do you have any programs for her? We can only do later than 5pm"
  Output: {"department":"Flag Football", "gender": "Girls", "timeRange": {"start": "17:00", "end": "23:59"}}
  Input: "any programs saturday afternoons?"
  Output: {"days":["Saturday"], "timeRange": {"start": "12:00", "end": "18:00"}}
  Input: "My daughter is really into dance. Do you have any afterschool programs for her?"
  Output: {"department": "Cheer & Dance", "gender":"Girls", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "timeRange": {"start": "15:00", "end": "18:00"}}
  Input: "afterschool bball for elementary school kids"
  Output: {"department":"Basketball","ageSpec":{"range":[0, 1, 2, 3, 4, 5],"unit":"Grades"},"days":["Monday","Tuesday","Wednesday","Thursday","Friday"]}
  Input: "Game-on and level-up programs on the weekdays"
  Output: {"name":["LEVEL-UP", "GAME-ON"], "days":["Monday","Tuesday","Wednesday","Thursday","Friday"]}
  Input: "Hustle programs after 5pm"
  Output: {"name":["Hustle"], "timeRange": {"start": "17:00", "end": "23:59"}}
`;

const programInstruction = `
You are helping provide information about youth sports programs.
Use the tool to get program information and then summarize the results for the user.
Here are some examples of what arguments to provide to the tool:
${getProgramsExamples}
Here are full examples of how to use the tool and respond to the user:
Input: What are the afterschool basketball programs for my son who's in 4th grade?
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
Input: "What multi-sport programs do you have for my 6-year-old? We can only do before 5:30."
Toolcall: {"department":"Multi-Sport","ageSpec":{"range":[6, 7],"unit":"Years"}, "timeRange": {"start": "00:00", "end": "17:30"}}
Output: (Summarize the info in the table, DO NOT NUMBER RESULTS.)
Here are the multi-sport programs available for 6-7 year olds before 5:30pm:

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

const nameDescription = `
The name of the program. The options are:
Baseball Trial, Soccer Trial, Tennis Trial, 3 Cheers 4 You, BabyBallers, BBall 101, 
CHEER & POM FUSION, CHEER CHAMPS, Cheer, HIP HOP, J&E Music+Move, JR CHEER CHAMPS, GAME-ON, LEVEL-UP, POM DANCE,
 TUMBLE FOR CHEER, FFB-GIRLS, FFB-QB Class, FFB, Hoop Academy, Jr Hoop Academy, ETA & PLAY, ETA, Hustle, 
 HUSTLE Hoop Academy. HUSTLE IS NOT A DEPARTMENT, IT IS A NAME OF A PROGRAM.
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
              "timeRange": {
                type: "object",
                properties: {
                  "start": {
                    type: "string"
                  },
                  "end": {
                    type: "string"
                  }
                },
                description: "Optional argument to specify time range of programs, any if unspecified, so for 4pm to 6pm, you would use {start: '4:00pm', end: '6:00pm'}.",
              },
              "names": {
                type: "array",
                items: {
                  type: "string"
                },
                description: nameDescription
              }
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
