import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

export const calculadoraTool = new DynamicStructuredTool({
  name: "calculadora",
  description: "Realiza cálculos matemáticos simples como suma, resta, multiplicación o división.",
  schema: z.object({
    expresion: z.string().describe("La expresión matemática a resolver, por ejemplo (23 + 4) * 3")
  }),
  func: async ({ expresion }) => {
    console.log("🧮 Ejecutando Tool con expresión:", expresion);
    try {
      const result = Function(`"use strict"; return (${expresion})`)();
      return `El resultado es: ${result}`;
    } catch {
      return "Error en la expresión matemática.";
    }
  }
});