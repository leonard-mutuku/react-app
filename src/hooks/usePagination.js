import { useState } from 'react';

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(() => {
        const saved = localStorage.getItem("limit_rows");
        return saved ? JSON.parse(saved) : 10;
    });
    const [prevPage, setPrevPage] = useState(null);

    const handleCurrentPageFilter = (length, size) => {
        if (length === 0 && prevPage != null) {
            (((prevPage.page - 1) * limit) > prevPage.size) ? setCurrentPage(1) : setCurrentPage(prevPage.page);
        } else if (length > 2 && currentPage > 1) {
            setPrevPage({page: currentPage, size: size});
            setCurrentPage(1);
        }
    }

    const offset = (currentPage - 1) * limit;
    const pageLimit = 5;

    return {currentPage, setCurrentPage, limit, setLimit, offset, pageLimit, handleCurrentPageFilter};
}