import { useState, useEffect } from 'react';
import { Button, Container, Table, Input } from 'reactstrap';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { PlusLg, PencilSquare, TrashFill } from 'react-bootstrap-icons';
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

    const { handleResponse, handleError } = useFetch();
    const pagination = usePagination();
    const {offset, limit, currentPage} = pagination;
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
    
    const remove = async (client) => {
        const isConfirmed = await confirm({title: 'Confirm Delete?', body: 'Please confirm delete of ' + client.firstName});
        if (isConfirmed) {
            const id = client.id
            const filterStr = filter ? '&filter='+filter : '';
            await fetch(`/clients/${id}?offset=`+offset+`&limit=`+limit+filterStr, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => handleResponse(res, true))
            .then((res) => {
                let updatedClients = [...data.clients].filter(c => c.id !== id);
                if (res.clients.length > 0) updatedClients = [...updatedClients, ...res.clients];
                setData({clients: updatedClients, size: res.size});
            })
            .catch(handleError);
        }
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
            }
        }, timer);
    }

    const clientList = data.clients.map(client => {
        return <tr key={client.id}>
        <td>{client.firstName}</td>
        <td>{client.lastName}</td>
        <td>{client.email}</td>
        <td>{client.phoneNumber}</td>
        <td>
            <Button color="default" className="btn-edit btn-icon" tag={Link} to={"/clients/" + client.id} title={'Edit '+client.firstName}><PencilSquare /></Button>
            <Button color="default" className="btn-delete btn-icon" onClick={() => remove(client)} title={'Delete '+client.firstName}><TrashFill /></Button>
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
                                    <div className="flex-1">
                                        <Input type="text" onKeyUp={handleFilter} name="filter" id="filter-txt" className="animate" placeholder="Filter text ..." />
                                    </div>
                                    <div className="float-right ovf-vis">
                                        <Button color="success" tag={Link} to={"/clients/new"}><PlusLg /> Add New</Button>
                                    </div>
                                </div>
                                <div style={{overflowX: 'auto'}}>
                                    <Table className="table">
                                        <thead>
                                        <tr>
                                            <td width="20%">First Name</td>
                                            <td width="20%">last Name</td>
                                            <td width="30%">Email</td>
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
