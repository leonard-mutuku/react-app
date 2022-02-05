import { useState } from 'react';

export const useDates = () => {
    const [dateFrom, setDateFrom] = useState(getDate(-6));
    const [dateTo, setDateTo] = useState(getDate());

    const minDate = getDate(-90);
    const maxDate = getDate();

    function getDate(days) {
        var date = new Date();
        return days ? date.setDate(date.getDate() + parseInt(days)) : date;
    }

    return {dateFrom, dateTo, setDateFrom, setDateTo, minDate, maxDate, getDate};
};