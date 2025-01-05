import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { CanvasProvider } from "./context/CanvasContext";

function App() {
  return (
    <>
      <CanvasProvider>
        <Toolbar></Toolbar>
        <Canvas></Canvas>
      </CanvasProvider>
    </>
  );
}

export default App;
