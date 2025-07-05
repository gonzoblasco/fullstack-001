  import { ChatOpenAI } from "@langchain/openai"
  import { HumanMessage } from "@langchain/core/messages"

  const chat = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: "gpt-4o",
    temperature: 0.3,
  })

  export async function transformText() {
    const input = `LangChain.js es una librería de JavaScript que permite construir aplicaciones de lenguaje mediante componentes reutilizables.`
    
    // Paso 1: Trraducir al inglés
    const translation = await chat.call([
      new HumanMessage(`Traducí al inglés este texto:\n\n${input}`)
    ])

    // Paso 2: Resumir el texto traducido
    const summary = await chat.call([
      new HumanMessage(`Resumí este texto en una sola oración:\n\n${translation.text}`)
    ])

    return {
      original: input,
      translated: translation.text,
      summary: summary.text
    }
  }