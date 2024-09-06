export let assistantId = "asst_VocnstZMy4IJyXJaQMn3dSCk"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
