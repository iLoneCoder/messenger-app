import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, login, resetMessage } from "../features/auth/authSlice"

function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const secondTryRef = useRef(false)

    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const { successMessage, errorMessage, authenticate, loading } = useSelector(state => state.auth)

    useEffect(() => {
        if (secondTryRef.current & !loading) {
            if (authenticate) {
                navigate("/")
                console.log(secondTryRef.current)
            }
            if (successMessage) {
                toast.success(successMessage)
                dispatch(resetMessage())
            }

            if (errorMessage) {
                toast.error(errorMessage)
                dispatch(reset())
            }

        }

        return () => {
            secondTryRef.current = true
        }
    }, [authenticate, errorMessage, successMessage, loading, dispatch, navigate])


    const handleChange = e => {
        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (state.email && state.password) {
            dispatch(login(state))
        } else {
            toast.error("Email and password are mandatory")
        }
    }

    return <div className="register">
        <div className="card">
            <div className="card-header">
                <h3>Login</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="email..." value={state.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="password..." value={state.password} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn" value="LOGIN" />
                    </div>

                    <div className="form-group">
                        <span><Link to="/messenger/register">Create new account</Link></span>
                    </div>

                    <div className="forgot-password">
                        <span><Link to="/messenger/forgot-password">Forgot password?</Link></span>    
                     </div>
                </form>
            </div>
        </div>
    </div>
}

export default Login