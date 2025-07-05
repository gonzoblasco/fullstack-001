import { useEffect, useState } from "react";
import { simpleChat } from "./langchainTest";

function App() {
  const [respuesta, setRespuesta] = useState('')

  useEffect(() => {
    simpleChat().then(setRespuesta)
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1>Prueba LangChain.js</h1>
      <p><strong>Respuesta del LLM:</strong></p>
      <p>{respuesta}</p>
    </div>
  )
}

export default App;