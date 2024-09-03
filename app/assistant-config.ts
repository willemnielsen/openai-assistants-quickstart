export let assistantId = "asst_3xybBM90hEUq0KPpQGADnXUe"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
