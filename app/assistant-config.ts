export let assistantId = "asst_pdF5YPTOAKwEibNjvKzL5nby"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
