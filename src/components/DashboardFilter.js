import { useState, useEffect } from 'react';
import { Label, Button } from 'reactstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import DatePicker from "react-datepicker";

const DashboardFilter = ({handleFilter, dates}) => {
    const {dateFrom, setDateFrom, dateTo, setDateTo, minDate, maxDate, getDate} = dates;
    const [activeSpan, setActiveSpan] = useState();

    const handleDate = (e) => {
        const days = e.target.getAttribute('data-attribute');
        setDateFrom(getDate(days));
        setDateTo(maxDate);
    }

    function handleDateChange(date, type) {
        if (type === 'from') {
            setDateFrom(date);
        } else {
            setDateTo(date);
        }
    }

    useEffect(() => {
        const diff = dateFrom - dateTo;
        const oneDay = 1000 * 60 * 60 * 24;
        const days = Math.round(diff / oneDay);
        setActiveSpan(days);
    }, [dateFrom, dateTo]);

    return (
        <div className="pnl flex flex-div filter-div">
            <div className="flex-sm text-center ovf-vis">
                <div className="last-days">
                    <span className={activeSpan === -6 ? "active" :""} onClick={handleDate} data-attribute="-6">1 Week<i></i></span>
                    <span className={activeSpan === -13 ? "active" :""} onClick={handleDate} data-attribute="-13">2 Weeks<i></i></span>
                    <span className={activeSpan === -29 ? "active" :""} onClick={handleDate} data-attribute="-29">1 Month<i></i></span>
                </div>
            </div>
            <div className="flex-lg flex text-center ovf-vis">
                <div className="date-range flex-1">
                    <div className="range-date">
                        <Label for="date-from">Date From:</Label>
                        <DatePicker selected={dateFrom} minDate={minDate} maxDate={dateTo} onChange={(date) => handleDateChange(date, 'from')} dateFormat="yyyy-MM-dd" />
                    </div>
                    <div>
                        <Button color="default" className="btn-icon"><ArrowRight /></Button>
                    </div>
                    <div className="range-date">
                        <Label for="date-to">Date To:</Label>
                        <DatePicker selected={dateTo} minDate={dateFrom} maxDate={maxDate} onChange={(date) => handleDateChange(date, 'to')} dateFormat="yyyy-MM-dd" />
                    </div>
                </div>
                <div className="ovf-vis">
                    <Button color="success" type="button" onClick={handleFilter}>FILTER</Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilter;