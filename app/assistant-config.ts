export let assistantId = "asst_1gTd2bJzpXEbz14CtXZZupNp"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
