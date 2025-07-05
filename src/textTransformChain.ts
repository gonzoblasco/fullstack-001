import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function transformText() {
  const model = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: "gpt-4o",
    temperature: 0,
  });

  const translatePrompt = ChatPromptTemplate.fromMessages([
    ["system", "Traducí al inglés británico el siguiente texto"],
    ["human", "{input}"],
  ]);

  const summarizePrompt = ChatPromptTemplate.fromMessages([
    ["system", "Resumí brevemente el siguiente texto"],
    ["human", "{input}"],
  ]);

  const parser = new StringOutputParser();

  const translateChain = RunnableSequence.from([
    translatePrompt,
    model,
    parser,
  ]);

  const summarizeChain = RunnableSequence.from([
    summarizePrompt,
    model,
    parser,
  ]);

  const inputText =
    "Este es un ejemplo de texto que será traducido y resumido usando LangChain.";

  const translated = await translateChain.invoke({ input: inputText });
  const summary = await summarizeChain.invoke({ input: translated });

  return {
    original: inputText,
    translated,
    summary,
  };
}
