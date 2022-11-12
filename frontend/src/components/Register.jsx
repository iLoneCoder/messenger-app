import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register, resetMessage } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { io } from "socket.io-client"

function Register() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        confPassword: "",
        image: ""
    })

    const { successMessage, error, authenticate, loading } = useSelector(state => state.auth)

    const [image, setImage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const socketRef = useRef()

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:8000")
        }
    })

    useEffect(() => {

        if (authenticate && !loading) {
            navigate("/")
        }

        if (successMessage) {
            toast.success(successMessage)
            dispatch(resetMessage())
            socketRef.current.emit("new-user-registered")
        }

        if (error) {
            error.map(el => toast.error(el))
        }


    }, [successMessage, error, authenticate, loading, dispatch, navigate])

    const handleInput = e => {
        setUserData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        })
        )
    }

    const handleImage = e => {
        if (e.target.files.length !== 0) {
            setUserData(prevState => ({
                ...prevState,
                image: e.target.files[0]
            }))

            const fileReader = new FileReader()
            fileReader.onload = () => setImage(fileReader.result)

            fileReader.readAsDataURL(e.target.files[0])
        }
    }

    const handleRegister = e => {
        e.preventDefault()

        const { username, email, password, confPassword, image } = userData

        const formData = new FormData();
        formData.append("username", username)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("confPassword", confPassword)
        formData.append("image", image)

        dispatch(register(formData))
    }

    return <div className="register">
        <div className="card">
            <div className="card-header">
                <h3>Register</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="username..." value={userData.username} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="email..." value={userData.email} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="password..." value={userData.password} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confPassword">Confirm password</label>
                        <input type="password" className="form-control" id="confPassword" placeholder="password..." value={userData.confPassword} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <div className="file-image">
                            <div className="image">
                                {image ? <img src={image} alt="img" /> : ""}
                            </div>

                            <div className="file">
                                <label htmlFor="image">Upload</label>
                                <input type="file" className="form-control" id="image" onChange={handleImage} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn" value="Register" />
                    </div>

                    <div className="form-group">
                        <span><Link to="/messenger/login">Login to your account</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default Register