import Canvas from "./components/Canvas/Canvas";
import { CanvasProvider } from "./context/CanvasContext";

function App() {
  return (
    <>
      <h1>HOLA MUNDO CON RECREO</h1>
      <CanvasProvider>
        <Canvas></Canvas>
      </CanvasProvider>
    </>
  );
}

export default App;
