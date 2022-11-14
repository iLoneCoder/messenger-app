import axios from "axios"

const register = async formData => {
    const config = {
        headers: {
            "Content-Type": "Application/json"
        }
    }

    const response = await axios.post("/api/messenger/user-register", formData, config)
    if (response.data) {
        const authInfo = {
            userData: response.data.userData,
            token: response.data.token
        }
        localStorage.setItem("user", JSON.stringify(authInfo))
    }


    return response.data
}

const login = async (formData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post("/api/messenger/user-login", formData, config)

    if (response.data) {
        // const authInfo = {
        //     userData: response.data.userData,
        //     token: response.data.token
        // }

        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

const logout = async () => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post("/api/messenger/user-logout", config)
    localStorage.removeItem("user")
    return response.data
}


const forgotPassword = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post("/api/messenger/forgot-password", userData, config)

    return response.data
}

const changePassword = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const { token } = userData
    delete userData.token
    const response = await axios.post(`/api/messenger/change-password/${token}`, userData, config)

    return response.data
}

const authService = {
    register,
    login,
    logout,
    forgotPassword,
    changePassword
}

export default authService