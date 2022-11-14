import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"
import jwt_decode from "jwt-decode"




let MY_INFO //= JSON.parse(localStorage.getItem("user"))
const str = document.cookie.split("; ").find(el => el.startsWith("authToken"))

if (str) {
    const token = str.split("=")[1]
    const info = jwt_decode(token)

    MY_INFO = {
        message: "Login is done successfully",
        token: token,
        userData: {
            _id: info.id,
            email: info.email,
            username: info.username,
            image: info.image
        }
    }

} else {
    MY_INFO = null
}

const initialState = {
    loading: false,
    authenticate: MY_INFO ? true : false,
    successMessage: "",
    error: [],
    errorMessage: "",
    myInfo: MY_INFO ? MY_INFO : null,
    passwordChanged: false
}

export const register = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk("auth/login", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        const message = error.response.data.message
        // console.log(message)
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        return await authService.logout()
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const forgotPassword = createAsyncThunk("messenger/forgot-password", async (userData, thunkAPI) => {
    try {
        return await authService.forgotPassword(userData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const changePassword = createAsyncThunk("messenger/change-password", async (userData, thunkAPI) => {
    try {
        return await authService.changePassword(userData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false
            state.authenticate = MY_INFO ? true : false
            state.successMessage = ""
            state.error = []
            state.errorMessage = ""
            state.myInfo = MY_INFO ? MY_INFO : null
        },
        resetMessage: (state) => {
            state.successMessage = ""
            state.errorMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            //Register user
            .addCase(register.pending, state => {
                state.loading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false
                state.successMessage = action.payload.message
                state.authenticate = true
                state.myInfo = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                console.log(action.payload)
                state.loading = false
                state.error = action.payload
            })
            //Login user
            .addCase(login.pending, state => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.authenticate = true
                state.successMessage = action.payload.message
                state.myInfo = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                console.log(action.payload)
                state.loading = false
                state.authenticate = false
                state.errorMessage = action.payload
            })
            //Logout user
            .addCase(logout.pending, (state) => {
                state.loading = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false
                state.authenticate = false
                state.myInfo = null

            })
            //forgot password
            .addCase(forgotPassword.pending, state => {
                state.loading = true
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false
                // state.successMessage = action.payload.message
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false
                // state.errorMessage = action.payload
            })
            //change password
            .addCase(changePassword.pending, state => {
                state.loading = true
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false
                state.passwordChanged = action.payload.success
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false
                state.errorMessage = "Something went wrong, send email again!"
            })
        }

})

export const { reset, resetMessage } = authSlice.actions
export default authSlice.reducer