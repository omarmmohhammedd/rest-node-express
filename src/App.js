import { BrowserRouter,Route,Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Navbar/>
      <Routes>
        <Route/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
