/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatOpenAI } from "@langchain/openai";
import { calculadoraTool } from "./tools/calculadoraTool";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function runAgent(input: string): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: "gpt-4o",
    temperature: 0,
  });

  const tools = [calculadoraTool];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Eres un asistente experto que puede resolver cálculos usando la herramienta 'calculadora'."],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"]
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const result = await executor.invoke({ input });
  console.log("🧠 Resultado final del Agent:", result);

  return result.output as string;
}
