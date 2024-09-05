export let assistantId = "asst_tnln5mSTj98aE1DaMp8DMldm"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
