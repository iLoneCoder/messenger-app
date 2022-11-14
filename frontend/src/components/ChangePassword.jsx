import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { changePassword, resetMessage } from "../features/auth/authSlice"
import { toast } from "react-toastify"

function ChangePassword() {

    const { authenticate, errorMessage, passwordChanged } = useSelector(state => state.auth)

    const [passwords, setPasswords] = useState({
        password: "",
        confPassword: ""
    })

    const { token } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setPasswords(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userData = {
            token,
            password: passwords.password,
            confPassword: passwords.confPassword
        }

        dispatch(changePassword(userData))
    }

    useEffect(() => {
        // if (authenticate) {
        //     navigate("/")
        // }

        if (errorMessage !== "") {
            toast.error(errorMessage)
        }

        if (passwordChanged) {
            toast.success("Password was updated")
            navigate("/messenger/login")
            dispatch(resetMessage())
        }

    }, [authenticate, errorMessage, passwordChanged, navigate, dispatch])

    return <div className="register">
        <div className="card">
            <div className="card-header">
                <h3>Enter new password</h3>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New password</label>
                        <input type="password" className="form-control" id="password" value={passwords.password} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confPassword">Confirm new password</label>
                        <input type="password" className="form-control" id="confPassword" value={passwords.confPassword} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn" value="Change" />
                    </div>

                    <div className="form-group">
                        <span><Link to="/messenger/login">Log in</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default ChangePassword