import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../features/auth/authSlice"
import { logout as logoutMessenger } from "../features/messenger/messengerSlice"

function EditDropDown({socket, myId}) {

    const [mode, setMode] = useState("white")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const changeMode = (e) => {
        setMode(e.target.value)
    }

    const handleLogout = () => {
        // async function logoutFromApp() {
        dispatch(logout())
        dispatch(logoutMessenger())
        socket.emit("delete-active-user", myId)
        navigate("/messenger/login")
        // }

        // logoutFromApp()


    }

    return <div className="dropdown-content">
        <div className="form-group">
            <div>
                <p>Theme</p>
            </div>
            <div>
                <ul className="radio-switch">
                    <li className="radio-switch-item">
                        <input type="radio" className="radio-switch-input" id="radio1" name="radioSwitch" value="white" onChange={changeMode} checked={mode === "white"} />
                        <label htmlFor="radio1" className="radio-switch-label" >W</label>
                        <div className="radio-switch-maker" ></div>
                    </li>

                    <li className="radio-switch-item">
                        <input type="radio" className="radio-switch-input" id="radio2" name="radioSwitch" value="dark" onChange={changeMode} checked={mode === "dark"} />
                        <label htmlFor="radio2" className="radio-switch-label">D</label>
                        <div className="radio-switch-maker"></div>
                    </li>
                </ul>
            </div>


        </div>
        <div className="form-group">
            <p>Logout</p>
            <div className="sign-out" onClick={handleLogout}>
                <FaSignOutAlt />
            </div>
        </div>

    </div>

}

export default EditDropDown