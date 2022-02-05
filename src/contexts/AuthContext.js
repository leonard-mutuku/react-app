import { useState, useEffect, createContext } from 'react';
import { trackPromise } from 'react-promise-tracker';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const userObj = {loggedIn: false, username: null, lastLogin: null};
    const [currentUser, setCurrentUser] = useState(userObj);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const resp = await fetch('/user');
        if (resp.ok) {
            const userData = await resp.json();
            setCurrentUser(userData);
        }
        setLoading(false);
    }

    const login = (user, cb) => {
        trackPromise(
            fetch('/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(res => {
                if (res.loggedIn) setCurrentUser(res);
                cb(res);
            })
            .catch(err => {
                console.log(err);
                cb({code: 253, msg: 'Error encountered while Logging you In'});
            })
        );
    }

    const logout = (cb) => {
        trackPromise(
            fetch('/user/logout')
            .then(res => res.json())
            .then(res => {
                setLogout();
                cb(res);
            })
            .catch(err => {
                console.log(err);
                cb({code: 253, msg: 'Error encountered while Logging you Out'});
            })
        );
    }

    const setLogout = () => setCurrentUser(userObj);

    const value = {currentUser, login, logout, setLogout};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}