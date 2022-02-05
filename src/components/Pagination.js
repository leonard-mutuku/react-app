import { Button } from 'reactstrap';
import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons';

const Pagination = (props) => {
    const {size, title, pagination} = props;
    const {currentPage, setCurrentPage, limit, setLimit, offset, pageLimit} = pagination;

    const start = offset + 1;
    const end = Math.min((offset + limit), size);
    const totalPages = size ? Math.ceil(size / limit) : 0;

    const startArr = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    const endArr = Math.min(pageLimit, (totalPages - startArr));
    const pagesArr = new Array(endArr).fill().map((_, idx) => startArr + idx + 1);

    const firstArr = pagesArr[0];
    const lastArr = pagesArr[endArr - 1];
    const prev = (firstArr === currentPage && firstArr === 1) ? false : true;
    const nxt = (lastArr === currentPage && lastArr === totalPages) ? false : true;

    const changeLimit = (evt) => {
        const val = Number(evt.target.value);
        setLimit(val);
        if (((currentPage - 1) * val) > size) setCurrentPage(1);
        localStorage.setItem("limit_rows", val);
    }

    const changePage = (page) => {
        if (typeof page === 'number') {
            setCurrentPage(page);
        } else {
            const val = (page === 'nxt') ? +1 : -1;
            setCurrentPage((page) => page + val);
        }
    };

    const limits = [10, 15, 20];
    const LimitList = limits.map(list => {
        return (
            <option key={'opt-'+list} value={list}>{list}</option>
        );
    });

    const paginationList = pagesArr.map(page => {
        return(
            <span key={'pg-'+page} className={currentPage === page ? 'active' : ''}>
                <Button onClick={() => changePage(page)} color="default" className="btn-icon animate">{page}</Button>
            </span>
        );
    });

    const msg = pagesArr.length > 0 ? 'Showing '+start+' to '+end+' of '+size+' '+title : 'No '+title+' to display!';

    return (
        <div id="pagination" className="flex">
            <div className="flex-1 pagination-txt">
                <div className="txt-clip">
                    <select value={limit} onChange={changeLimit}>{LimitList}</select>
                    <span>{msg}</span>
                </div>
            </div>
            <div className="pagination">
                {firstArr && <span><Button disabled={!prev} onClick={() => changePage('prev')} title="previous" color="default" className="btn-icon animate"><CaretLeftFill /></Button></span>}
                {paginationList}
                {lastArr && <span><Button disabled={!nxt} onClick={() => changePage('nxt')} title="next" color="default" className="btn-icon animate"><CaretRightFill /></Button></span>}
            </div>
        </div>
    );
}

export default Pagination;