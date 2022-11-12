import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Login from "./components/Login"
import Register from "./components/Register"
import Messenger from "./components/Messenger"
import ProtectedRoute from "./components/ProtectedRoute"
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/messenger/login" element={<Login />} />
        <Route path="/messenger/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Messenger />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
