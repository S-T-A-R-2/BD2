import { createContext, useState, useContext, useEffect } from "react"
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie'

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signUp = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.messages);
                console.log(error.response.data);
            } else {
                setErrors(['An unexpected error occurred. Please try again.']);
                console.log(error.message);
            }
        }
    };

    const signIn = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.messages);
                console.log(error.response.data);
            } else {
                setErrors(['An unexpected error occurred. Please try again.']);
                console.log(error.message);
            }
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        setIsAuthenticated(false);
    }

    // Clear errors after 5 seconds
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [errors])

    // Check if user is already logged in
    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get()
            
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
                try {
                    const res = await verifyTokenRequest();
                    if (!res.data) {
                        setIsAuthenticated(false);
                        setLoading(false);
                        return
                    }
                    setIsAuthenticated(true);
                    setUser(res.data);
                    setLoading(false);
                } catch (error) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            }
        checkLogin();
    }, [])

    return (
        <AuthContext.Provider value={{
            signUp,
            signIn,
            logout,
            loading,
            user,
            isAuthenticated,
            setIsAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    )
}