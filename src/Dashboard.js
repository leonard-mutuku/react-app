import { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { Container } from 'reactstrap';
import LeftNav from './components/LeftNav';
import RightTop from './components/RightTop';
import RightBottom from './components/RightBottom';
import DashboardFilter from './components/DashboardFilter';
import { BarChart, PieChart, LineChart } from './components/ChartJs';
import { useFetch } from './hooks/useFetch';
import { useDates } from './hooks/useDates';

export default function Dashboard() {
    let pieObj = {title: "sms delivery status", labels: [], data: {pie_data: [], pie_clrs: []}};
    let barObj = {title: "Credit Purchase & usage Statistics", labels: [], data: {labels: ['Credits Purchased', 'Credits used'],
    colors: [['rgb(0 188 212 / 95%)', 'rgb(0 188 212 / 40%)'], ['rgb(79 173 152 / 95%)', 'rgb(79 173 152 / 40%)']], values: []}};
    const colors = {dlr_pending: "#00bcd4", delivered_to_phone: "#51a984", failed: "#d0011b", cancelled: '#d0011b', pending: '#ec971f'};
    let summary = {bought: 0, used: 0, balance: 0};
    let lineObj = {title: "sms sent trend", labels: [], data: []};

    let obj = {pieChartData: pieObj, barChartData: barObj, creditSummary: summary, lineChartData: lineObj, isLoading: true, err: null};
    const [data, setData] = useState(obj);

    const dates = useDates();
    const { handleResponse, handleError } = useFetch();

    useEffect(() => {
        document.title = "Customer Portal :: Dashboard";
        fetchDashBoardData();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const mm = String(date.getMonth()+1).padStart(2, 0);
        const dd = String(date.getDate()).padStart(2, 0);
        const formattedDate = date.getFullYear() +'-'+ mm +'-'+ dd;
        return formattedDate;
    }
    const fetchDashBoardData = () => {
        const from = formatDate(dates.dateFrom);
        const to = formatDate(dates.dateTo);
        trackPromise(
            fetch("/dashboard/"+from+"/"+to)
                .then(res => handleResponse(res, true))
                .then((data) => {
                    const pieChartData = drawPieChart(data.bulkStatus);
                    const barChartData = drawBarChart(data.usageTrend);
                    const creditSummary = drawCreditSummary(data.creditSummary, data.usageTrend);
                    const lineChartData = drawLineChart(data.usageTrend);
                    setData({isLoading: false, pieChartData, barChartData, creditSummary, lineChartData});
                 })
                .catch(handleError)
        );
    }

    function drawPieChart(bulkStatus) {
        let pieChartData = {title: data.pieChartData.title, labels: [], data: {pie_data: [], pie_clrs: []}};
        bulkStatus.forEach((status) => {
            pieChartData.labels.push(status.status);
            const clr = colors[status.status.toLowerCase().split(' ').join('_')] || getRadColor();
            pieChartData.data.pie_clrs.push(clr);
            pieChartData.data.pie_data.push(status.count);
        });
        return pieChartData;
    }
    function drawBarChart(usageTrend) {
        let barChartData = data.barChartData;
        barChartData.labels = usageTrend.map((trend) => trend.date);
        const credit = usageTrend.map((trend) => trend.creditCount);
        const usage = usageTrend.map((trend) => trend.pendingCount + trend.sendCount);
        barChartData.data.values = [credit, usage];
        return barChartData;
    }
    function drawCreditSummary(summary, usageTrend) {
        const used = usageTrend.reduce((a, trend) => a = a + trend.pendingCount + trend.sendCount, 0);
        return {bought: summary.total, used, balance: summary.balance};
    }
    function drawLineChart(usageTrend) {
        let lineChartData = data.lineChartData;
        lineChartData.labels = usageTrend.map((trend) => trend.date);
        lineChartData.data = usageTrend.map((trend) => trend.smsSent);
        return lineChartData;
    }

    function getRadColor() {
        return ("#" + Math.random().toString(16).slice(2, 8));
    }

    function handleFilter() {
        fetchDashBoardData();
    }

    return (
            <div className="fill flex">
                <LeftNav />
                <div className="wrapper-right flex-1 animate">
                    <div className="flex-column">
                        <RightTop title="Dashboard & statistics" />
                        <div id="right-middle" className="flex-1">
                            <Container>
                                <DashboardFilter
                                    handleFilter={handleFilter}
                                    dates={dates}
                                />
                                <div className="flex flex-div">
                                    <PieChart
                                        chartData={data.pieChartData}
                                    />
                                    <BarChart
                                        chartData={data.barChartData}
                                    />
                                </div>
                                <div className="flex flex-div">
                                    <div className="pnl flex-sm text-center">
                                        <p className="chart-title">Credit Summary</p>
                                        <div className="credit-bought credit">
                                            <h4 className="txt-clip">{data.creditSummary.bought.toLocaleString()}</h4>
                                            <p>Credits Purchased</p>
                                        </div>
                                        <div className="credit-used credit">
                                            <h4 className="txt-clip">{data.creditSummary.used.toLocaleString()}</h4>
                                            <p>Credits Used</p>
                                        </div>
                                        <div className="credit-balance credit">
                                            <h4 className="txt-clip">{data.creditSummary.balance.toLocaleString()}</h4>
                                            <p>Credit Balance</p>
                                        </div>
                                    </div>
                                    <LineChart
                                        chartData={data.lineChartData}
                                    />
                                </div>
                            </Container>
                        </div>
                        <RightBottom />
                    </div>
                </div>
            </div>
        );
};
