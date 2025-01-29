import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { CanvasProvider } from "./context/CanvasContext";
import { ModalProvider } from "./context/ModalContext";

function App() {
  return (
    <>
      <ModalProvider>
        <CanvasProvider>
          <Toolbar></Toolbar>
          <Canvas></Canvas>
        </CanvasProvider>
      </ModalProvider>
    </>
  );
}

export default App;
