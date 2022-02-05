import { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { CheckCircleFill, ExclamationTriangleFill, InfoCircleFill } from 'react-bootstrap-icons';

const Alert = (props) => {
    const [close, setClose] = useState(false);
    const [width, setWidth] = useState(100);
    const [intervalID, setIntervalID] = useState(null);

    const alertClose = () => {
        setClose(true);
        handlePauseTimer();
        setWidth(0);
        setTimeout(() => {
            props.dispatch({
                type: "REMOVE_ALERT",
                id: props.id
            })
        }, 500);
    };

    useEffect(() => {
        setTimeout(() => {
            handleStartTimer();
        }, 500);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleStartTimer = () => {
        if (timer) {
            const id = setInterval(() => {
                setWidth(prev => {
                    if (prev > 0) {
                        return prev - 0.5;
                    }
                    alertClose();
                    return prev;
                });
            }, 25);

            setIntervalID(id);
        }
    };

    const handlePauseTimer = () => {
        if (timer) clearInterval(intervalID);
    }

    const getIcon = (cls) => {
        switch(cls) {
            case "success":
                return <CheckCircleFill />
            case "danger":
                return <ExclamationTriangleFill />
            default:
                return <InfoCircleFill />
        }
    };

    const icon = getIcon(props.class);
    const closed = close ? 'close' : '';
    const timer = (props.class === 'success') ? true : false;

    return(
        <div className={"alert-cls "+closed} onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer}>
            <div className={"pnl alert-"+props.class}>
                <div className="flex">
                    <div className="flex-1 flex flex-center">
                        <div className="alert-icon">{icon}</div>
                        <div className="flex-1">{props.msg}</div>
                    </div>
                    <div className="alert-close flex-center"><Button color="default" className="btn-close btn-icon" onClick={alertClose}></Button></div>
                </div>
                {timer && <div className="flex justify-content-end"><div className="timer" style={{ width: `${width}%` }} /></div>}
            </div>
        </div>
    );
}

export default Alert;