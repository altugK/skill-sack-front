import HomePage from "../pages/HomePage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import TopBar from "../components/TopBar";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TopBar />
      <HomePage />
      <ToastContainer />
    </DndProvider>
  );
}

export default App;
