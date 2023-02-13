import { useState, useEffect } from 'react';
import { Button, Container, Table, Input, Label } from 'reactstrap';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { PlusLg, PencilSquare, TrashFill, XLg } from 'react-bootstrap-icons';
import LeftNav from './components/LeftNav';
import RightTop from './components/RightTop';
import RightBottom from './components/RightBottom';
import Pagination from './components/Pagination';
import { useFetch } from './hooks/useFetch';
import { usePagination } from './hooks/usePagination';
import { useConfirm } from './hooks/useConfirm';

export default function ClientList(props) {
    let obj = {clients: [], size: 0, pages: 0, err: null};
    const [data, setData] = useState(obj);
    let timeout = null;
    const [filter, setFilter] = useState('');
    const [checked, setChecked] = useState([]);
    const [filterVal, setFilterVal] = useState('');

    const { handleResponse, handleError } = useFetch();
    const pagination = usePagination();
    const {offset, limit, currentPage, handleCurrentPageFilter} = pagination;
    const {confirm} = useConfirm();
    
    useEffect(() => {
        document.title = "Customer Portal :: Clients";
        fetchClients();
    }, [currentPage, limit, filter]);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchClients = () => {
        const filterStr = filter ? '&filter='+filter : '';
        trackPromise(
            fetch('/clients?offset='+offset+'&limit='+limit+filterStr)
                    .then(res => handleResponse(res, true))
                    .then(data => {
                        setData({clients: data.clients, size: data.size, pages: data.pages});
                    })
                    .catch(err => {
                        handleError(err, {clients: [], size: 0, pages: 0, err: err.msg}, setData);
                    })
        );
    }

    const getSelectedNames = async () => {
        const selectedClients = [...data.clients].filter(c => checked.includes(c.id));
        const names = selectedClients.map(client => client.firstName);
        const namesStr = names.length > 1 ? names.slice(0, -1).join(', ') +' and '+ names.slice(-1) : names.join(', ');
        return namesStr;
    }

    const removeClients = async () => {
        const names = await getSelectedNames();
        const isConfirmed = await confirm({title: 'Confirm Delete?', body: 'Please confirm delete of '+names});
        if (isConfirmed) {
            deleteClients(checked);
        }
    }
    
    const removeClient = async (client) => {
        const isConfirmed = await confirm({title: 'Confirm Delete?', body: 'Please confirm delete of ' + client.firstName});
        if (isConfirmed) {
            const id = [client.id];
            deleteClients(id);
        }
    }

    const deleteClients = async (ids) => {
        const filterStr = filter ? '&filter='+filter : '';
        await fetch(`/clients/${ids}?offset=`+offset+`&limit=`+limit+filterStr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => handleResponse(res, true))
        .then((res) => {
            let updatedClients = [...data.clients].filter(c => !ids.includes(c.id));
            if (res.clients.length > 0) updatedClients = [...updatedClients, ...res.clients];
            setData({clients: updatedClients, size: res.size});
            setChecked([]);
        })
        .catch(handleError);
    }

    const handleFilter = (event) => {
        clearTimeout(timeout);
        const x = event.which || event.keyCode;
        const timer = x === 13 ? 0 : 1000;

        timeout = setTimeout(() => {
            const target = event.target;
            const value = target.value.trim();
            const length = value.length;
            if (length === 0 || length > 2) {
                setFilter(value);
                handleCurrentPageFilter(length, data.size);
            }
        }, timer);
    }

    const handleChange = (event) => {
        const value = event.target.value.trim();
        setFilterVal(value);
    }

    const handleClearFilter = () => {
        setFilter('');
        setFilterVal('');
        handleCurrentPageFilter(0, data.size)
    }

    const handleAddNew = () => {
        props.history.push("/clients/new");
    }

    const handleChecked = (e) => {
        const val = parseInt(e.target.value);
        const check = e.target.checked;
        if (check) {
            setChecked([...checked, val]);
        } else {
            setChecked(check => check.filter(c => c !== val));
        }
    }

    const handleCheckAll = (e) => {
        const check = e.target.checked;
        if (check) {
            setChecked(data.clients.map(c => c.id));
        } else {
            setChecked([]);
        }
    }

    const masterSelect = (checked.length === data.clients.length && checked.length > 0) ? true : false;

    const clientList = data.clients.map(client => {
        const id = client.id;
        const chkId = 'check-' + id;
        return <tr key={id}>
        <td><input type="checkbox" id={chkId} onChange={handleChecked} checked={checked.includes(id)} value={id} /><Label for={chkId}></Label></td>
        <td>{client.firstName}</td>
        <td>{client.lastName}</td>
        <td>{client.email}</td>
        <td>{client.phoneNumber}</td>
        <td>
            <Button color="default" className="btn-edit btn-icon" tag={Link} to={"/clients/" + client.id} title={'Edit '+client.firstName}><PencilSquare /></Button>
            <Button color="default" className="btn-delete btn-icon" onClick={() => removeClient(client)} title={'Delete '+client.firstName}><TrashFill /></Button>
        </td>
        </tr>
    });

    return (
            <div className="fill flex">
                <LeftNav />
                <div className="wrapper-right flex-1 animate">
                    <div className="flex-column">
                        <RightTop title="clients" />
                        <div id="right-middle" className="flex-1">
                            <Container>
                                <div className="pnl hdr flex filter-div">
                                    <div className="flex-1 flex">
                                        {(checked.length > 0) ? <Button color="default" className="btn-delete btn-icon actions" onClick={removeClients}><TrashFill /></Button> : null}
                                        <div style={{position: 'relative'}}>
                                            <Input type="text" onKeyUp={handleFilter} onChange={handleChange} value={filterVal} name="filter" id="filter-txt" className="animate" placeholder="Filter text ..." />
                                            {filterVal && <Button color="default" className="btn-icon show-pass" onClick={handleClearFilter}><XLg /></Button>}
                                        </div>
                                    </div>
                                    <div className="float-right ovf-vis">
                                        <Button color="success" onClick={handleAddNew}><PlusLg /> Add New</Button>
                                    </div>
                                </div>
                                <div style={{overflowX: 'auto', boxShadow: '0 3px 25px rgb(0 0 0 / 6%)'}}>
                                    <Table className="table">
                                        <thead>
                                        <tr>
                                            <td width="5%"><input type="checkbox" id="check-all" onChange={handleCheckAll} checked={masterSelect} /><Label for="check-all"></Label></td>
                                            <td width="20%">First Name</td>
                                            <td width="20%">last Name</td>
                                            <td width="25%">Email</td>
                                            <td width="20%">Phone Number</td>
                                            <td width="10%">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {clientList}
                                        </tbody>
                                    </Table>
                                </div>
                                <Pagination
                                    title="clients"
                                    size={data.size}
                                    pages={data.pages}
                                    pagination={pagination}
                                />
                            </Container>
                        </div>
                        <RightBottom />
                    </div>
                </div>
            </div>
    );
};
