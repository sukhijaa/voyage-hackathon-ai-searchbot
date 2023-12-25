import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});


export const APIcall = async (user_input) => {
  try {
    console.log(`Firing ChatGPT request for user_input ${user_input}`)
    const GPTOutput = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: user_input }],
    });

    const output_text = GPTOutput.choices[0].message.content;
    console.log(
      `Output from OpenAI for userInput '${user_input}' = ${output_text}`
    );
    return output_text;
  } catch (err) {
    console.error(`Error while calling OpenAI - ${err.message}`);
    if (err.status === 429 || err.response?.status === 429) {
        return "##retry##"
    }
  }
};
