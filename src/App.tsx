import { useEffect, useState } from "react";
import { runAgent } from "./langchainTest";
import { transformText } from "./textTransformChain";

interface TransformOutput {
  original: string;
  translated: string;
  summary: string;
}

function App() {
  const [output, setOutput] = useState<TransformOutput | null>(null);
  const [agentOutput, setAgentOutput] = useState<string>("");

  useEffect(() => {
    transformText().then(setOutput);
    runAgent("¿Cuánto es (23 + 4) * 3?").then(setAgentOutput);
  }, []);

  if (!output) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>🧪 Chain de Transformación</h2>
      <p><strong>Original:</strong> {output.original}</p>
      <p><strong>Traducido:</strong> {output.translated}</p>
      <p><strong>Resumen:</strong> {output.summary}</p>

      <hr style={{ margin: '2rem 0' }} />

      <h2>🤖 Agent + Tool</h2>
      <p><strong>Resultado del agente:</strong> {agentOutput}</p>
    </div>
  );
}

export default App;
