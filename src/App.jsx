import Canvas from "./components/Canvas/Canvas";
import { CanvasProvider } from "./context/CanvasContext";

function App() {
  return (
    <>
      <CanvasProvider>
        <Canvas></Canvas>
      </CanvasProvider>
    </>
  );
}

export default App;
