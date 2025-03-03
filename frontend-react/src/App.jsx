// import { useState } from 'react'
// import './App.css'
// import AllRoute from './Components/AllRoute/index'
// function App() {
// const [count, setCount] = useState(0)

// return (
//     <>
//     <AllRoute />
//     </>
//   )
// }

// export default App
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