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

const authService = {
    register,
    login,
    logout
}

export default authService