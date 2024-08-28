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
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a helpful assistant. Use the tools to assist the user.",
    name: "Dash-gpt",
    model: "gpt-4o",
    tools: [
      {
        type: "function",
        function: {
          name: "pull",
          description: pull_description,
          parameters: {
            type: "object",
            properties: {
              "table_name": {
                type: "string",
                description: table_name_description,
              },
              "new_table_name": {
                type: "string",
                description: new_table_name_description,
              },
              "filters": {
                type: "string",
                description: filters_description,
              }
            },
            required: ["table_name", "new_table_name", "filters"],
          },
        },
      }
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
