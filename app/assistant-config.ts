export let assistantId = "asst_BFGHsNth1MMb9wL4BPCKFAt6"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
