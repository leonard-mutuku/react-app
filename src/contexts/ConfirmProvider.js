import { createContext, useReducer } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

const ConfirmContext = createContext();

export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const HIDE_CONFIRM = 'HIDE_CONFIRM';

const initialState = {show: false, data: {}};

const ConfirmReducer = (state, action) => {
    switch(action.type) {
        case SHOW_CONFIRM:
            return {show: true, data: action.payload};
        case HIDE_CONFIRM:
            return initialState;
        default:
            return state;
    }
};

const ConfirmProvider = (props) => {
    const [state, dispatch] = useReducer(ConfirmReducer, initialState);

    return (
        <ConfirmContext.Provider value={{ state, dispatch }}>
            <div id="confirm-div"><ConfirmDialog /></div>
            {props.children}
        </ConfirmContext.Provider>
    );
}

export { ConfirmContext };
export default ConfirmProvider;