import { useEffect, useState } from "react";
import { transformText } from "./langchainTest";

interface TransformOutput {
  original: string;
  translated: string;
  summary: string;
}

function App() {
  const [output, setOutput] = useState<TransformOutput | null>(null)

  useEffect(() => {
    transformText().then(setOutput)
  }, [])

  if (!output) return <p>Cargando...</p>

  return (
    <div style={{ padding: 40 }}>
      <h2>🧪 Chain de Transformación</h2>
      <p><strong>Original:</strong> {output.original}</p>
      <p><strong>Traducido:</strong> {output.translated}</p>
      <p><strong>Resumen:</strong> {output.summary}</p>
    </div>
  )
}

export default App;