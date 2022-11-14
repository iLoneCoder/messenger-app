import { Outlet, Navigate } from "react-router-dom"
import AuthStatus from "../hooks/AuthStatus"

function PublicRoute() {

    const { loggedin, loading } = AuthStatus()

    if (loading) {
        return
    }

    return !loggedin ? <Outlet /> : <Navigate to="/" />
}

export default PublicRoute