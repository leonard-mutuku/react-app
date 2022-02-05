import { Button } from 'reactstrap';
import { useConfirm } from '../hooks/useConfirm';

const ConfirmDialog = () => {
    const { state, onConfirm, onCancel } = useConfirm();

    const component = state.show ? (
            <div className="confirm-overlay flex-center" onClick={onCancel}>
                <div className="confirm-dialog pnl" onClick={e => {e.stopPropagation()}}>
                    <div className="form-hdr text-center flex">
                        <div className="flex-1"><span className="linear-cl">{state.data.title || "confirmation Required"}</span></div>
                        <Button color="default" className="btn-close btn-icon" onClick={onCancel}></Button>
                    </div>
                    <div className="confirm-dialog-body">
                        {state.data.body}
                    </div>
                    <div className="confirm-dialog-footer text-end ovf-vis flex">
                        <Button color="danger" onClick={onCancel} className="btn-icon">No</Button>
                        <div className="flex-1"><Button color="success" onClick={onConfirm} className="btn-icon">Yes</Button></div>
                    </div>
                </div>
            </div>
        ) : null;

    return (component);
}

export default ConfirmDialog;