import { useState } from 'react';

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(() => {
        const saved = localStorage.getItem("limit_rows");
        return saved ? JSON.parse(saved) : 10;
    });

    const offset = (currentPage - 1) * limit;
    const pageLimit = 5;

    return {currentPage, setCurrentPage, limit, setLimit, offset, pageLimit};
}