import { useHistory, useLocation } from 'react-router-dom';
import { useAlert } from './useAlert';
import { useAuth } from './useAuth';

export const useFetch = () => {
    const history = useHistory();
    const location = useLocation();
    const alert = useAlert();
    const { setLogout } = useAuth();

    const handleResponse = (response, json) => {
        if (!response.ok) {
            return Promise.reject({code: response.status, msg: response.statusText});
        }

        if (json) {
            try {
                return response.json()
            } catch (err) {
                return Promise.reject({code: 255, msg: err})
            }
        } else {
            return response;
        }
    }

    const handleError = (error, data, setData) => {
        console.log(error);
        const code = error.code;
        if ([401, 403].includes(code)) {
            setLogout();
            history.push({pathname: "/login", state: {from: location.pathname}});
        } else {
            const msg = (code === 255) ? 'Error encountered while formatting data!' : 'Error encountered while fetching data!';
            alert({class: 'danger', msg: msg});
            if (data && setData) setData(data);
        }
    }

    return { handleResponse, handleError };
}