  import { ChatOpenAI } from "@langchain/openai"
  import { HumanMessage } from "@langchain/core/messages"

  export async function simpleChat() {
    const chat = new ChatOpenAI({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
      modelName: "gpt-4o"
    })

    const res = await chat.call([
      new HumanMessage("¿Cuál es la capital de Francia?")
    ])

    return res.text
  }