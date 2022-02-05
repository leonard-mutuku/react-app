import { useContext } from 'react';
import { ConfirmContext, HIDE_CONFIRM, SHOW_CONFIRM } from '../contexts/ConfirmProvider';

let resolveCallback;
export const useConfirm = () => {
    const { state, dispatch} = useContext(ConfirmContext);

    const onConfirm = () => {
        closeConfirm();
        resolveCallback(true);
    }

    const onCancel = () => {
        closeConfirm();
        resolveCallback(false);
    }

    const confirm = (data) => {
        dispatch({
            type: SHOW_CONFIRM,
            payload: data
        });
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    }


    const closeConfirm = () => {
        dispatch({
            type: HIDE_CONFIRM
        });
    }

    return { state, onConfirm, onCancel, confirm };
}