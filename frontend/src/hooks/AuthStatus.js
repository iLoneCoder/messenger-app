import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"

function AuthStatus() {
    const cookieRef = useRef(false)

    const [loading, setLoading] = useState(true)
    const [loggedin, setLoggedin] = useState(false);
    const { myInfo } = useSelector((state) => state.auth);


    useEffect(() => {

        if (myInfo) {
            setLoggedin(true);
            cookieRef.current = false
        } else {
            localStorage.removeItem("user")
            setLoggedin(false);
         }


        setLoading(false);
    }, [myInfo])


    return { loggedin, loading }
}

export default AuthStatus