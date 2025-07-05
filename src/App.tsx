import { useEffect, useState } from "react";
import { runAgent } from "./langchainTest";

function App() {
  const [agentOutput, setAgentOutput] = useState<string>("")

  useEffect(() => {
    runAgent("¿Cuánto es (23 + 4) * 3?").then(setAgentOutput)
  }, [])

  if (!agentOutput) return <p>Pensando...</p>

  return (
    <div style={{ padding: 40 }}>
      <h2>🤖 Agent + Tool personalizada</h2>
      <p><strong>Respuesta del agente:</strong> {agentOutput}</p>
    </div>
  );
}

export default App;
