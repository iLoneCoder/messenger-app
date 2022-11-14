import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { forgotPassword } from "../features/auth/authSlice"
import { toast } from "react-toastify"
function ForgotPassword() {

    const { loading, authenticate } = useSelector(state => state.auth)

    const [email, setEmail] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (email) {
            const userData = {email: email}
            dispatch(forgotPassword(userData))
            navigate("/messenger/login")
        } else {
            toast.error("Provide email")
        }

    }

    useEffect(() => {
        // if(!loading && !authenticate ) {
        //     navigate("/messenger/login")
        // }

        // if (!loading && authenticate) {
        //     navigate("/")
        // }

    }, [loading, authenticate, navigate])

    if (loading) {
        return
    }

    return <div className="register">
        <div className="card">
            <div className="card-header">
                <h3>Password reset</h3>

                <div className="description">

                    <p>Check your email, You'll get instructions there</p>
                    <p>if you didn't recieve email, check spam or try again</p>

                </div>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={handleEmail} />
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn" value="send" />
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default ForgotPassword