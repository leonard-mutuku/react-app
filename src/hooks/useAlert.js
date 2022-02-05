import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertProvider';

export const useAlert = () => {
    const dispatch = useContext(AlertContext);

    function alert(props) {
        const id = new Date().valueOf();
        dispatch({
            type: "ADD_ALERT",
            alert: {
                id: id,
                ...props
            }
        });
    }

    return alert;
}