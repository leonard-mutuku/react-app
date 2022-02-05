import { createContext, useReducer } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();

const AlertReducer = (state, action) => {
    switch(action.type) {
        case "ADD_ALERT":
            return {...state, alerts: [...state.alerts, action.alert]};
        case "REMOVE_ALERT":
            const updatedAlerts = state.alerts.filter((a) => a.id !== action.id);
            return {...state, alerts: updatedAlerts};
        default:
            console.log('unsupported alert action');
            return state;
    }
}

const AlertProvider = (props) => {
    const [state, dispatch] = useReducer(AlertReducer, {alerts: []});
    return(
        <AlertContext.Provider value={dispatch}>
            <div id="alert-div" className={(state.alerts.length > 0) ? "shown" : ""}>
                {state.alerts.map((alert) => {
                    return <Alert dispatch={dispatch} key={alert.id} {...alert} />
                })}
            </div>
            {props.children}
        </AlertContext.Provider>
    );
}

export { AlertContext };
export default AlertProvider;