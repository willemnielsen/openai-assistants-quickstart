export let assistantId = "asst_9oLI84ijBHnKUWspYBUBc0iV"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
