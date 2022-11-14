import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Login from "./components/Login"
import Register from "./components/Register"
import Messenger from "./components/Messenger"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./components/ForgotPassword"
import ChangePassword from "./components/ChangePassword"
import PublicRoute from "./components/PublicRoute"
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/messenger/login" element={<Login />} />
        <Route path="/messenger/register" element={<Register />} />
        <Route path="/messenger/forgot-password" element={<PublicRoute />}>
          <Route path="/messenger/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/messenger/change-password/:token" element={<PublicRoute />}>
          <Route path="/messenger/change-password/:token" element={<ChangePassword />} />
        </Route>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Messenger />} />
        </Route>
        <Route path="/*" element={<div>Page Not found</div>}/>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
