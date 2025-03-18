import { BrowserRouter } from "react-router-dom";
import './App.css';
import AllRoute from './Components/AllRoute/index';

function App() {
  return (
    <BrowserRouter>
      <AllRoute />
    </BrowserRouter>
  );
}

export default App;