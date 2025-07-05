/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

export const calculadoraTool = new DynamicStructuredTool({
  name: "calculadora",
  description: "Realiza cálculos matemáticos simples como suma, resta, multiplicación o división.",
  schema: z.object({
    expresion: z.string().describe("La expresión matemática a resolver, por ejemplo (23 + 4) * 3"),
  }),
  func: async ({ expresion }) => {
    try {
      const result = Function(`"use strict"; return (${expresion})`)();
      return `El resultado es: ${result}`;
    } catch {
      return "Error en la expresión matemática.";
    }
  },
});

export async function runAgent(input: string): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: "gpt-4o",
    temperature: 0,
  });

  const tools = [calculadoraTool];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Eres un asistente experto que debe usar la herramienta 'calculadora' para responder preguntas matemáticas. Siempre usa la herramienta para hacer cálculos y luego proporciona una respuesta clara con el resultado."],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: false, // Desactivamos los logs verbosos
    maxIterations: 3,
  });

  try {
    const response = await executor.invoke({ input });
    
    // Si tenemos una respuesta directa del agente
    if (response?.output && response.output.trim() !== "") {
      return response.output;
    }
    
    // Si no hay output, intentamos extraer de los pasos intermedios
    const intermediateSteps = (response as any)?.intermediateSteps;
    if (intermediateSteps && intermediateSteps.length > 0) {
      const lastStep = intermediateSteps[intermediateSteps.length - 1];
      if (lastStep?.observation) {
        return `🧮 Resultado: ${lastStep.observation}`;
      }
    }
    
    // Si aún no tenemos resultado, ejecutamos manualmente la herramienta
    // basándonos en el patrón común de la pregunta
    const mathMatch = input.match(/¿Cuánto es (.+?)\?/);
    if (mathMatch) {
      const expression = mathMatch[1];
      const result = await calculadoraTool.func({ expresion: expression });
      return ` ${expression} = ${result}`;
    }
    
    return "⚠️ No se pudo procesar la pregunta matemática.";
  } catch (error) {
    console.error("Error ejecutando el agente:", error);
    return `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`;
  }
}
