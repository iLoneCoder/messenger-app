import { Navigate, Outlet } from "react-router-dom"
import AuthStatus from "../hooks/AuthStatus"

function ProtectedRoute() {
    const { loggedin, loading } = AuthStatus();
    // console.log(loggedin,loading)
    if (loading) {
        return 
    }

    return loggedin ? <Outlet /> : <Navigate to="/messenger/login" />

}

export default ProtectedRoute