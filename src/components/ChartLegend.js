import { useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

const ChartLegend = ({labels, colors, values}) => {
    const listRef = useRef(null);

    const scrollLegend = (e) => {
        if(listRef.current) {
            if ((e.pageX - listRef.current.offsetLeft) < listRef.current.clientWidth / 2) {
                listRef.current.scrollLeft -= 20;
            } else {
                listRef.current.scrollLeft += 20;
            }
        }
    }

    useEffect(() => {
        const el = listRef.current;
        el.addEventListener('mousemove', debounce(scrollLegend, 100));
        return () => el.removeEventListener('mousemove', scrollLegend);
    });

    const legendList = colors.map((color, idx) => {
        const bg = (typeof color === 'object') ? color[0] : color;
        const label = values ? labels[idx]+': '+ values[idx].toLocaleString() : labels[idx];
        return <li key={idx}><span style={{backgroundColor: bg}}></span>{label}</li>;
    });

    return(
        <div className="tnx-footer">
            <ul ref={listRef}>{legendList}</ul>
        </div>
    );
}

export default ChartLegend;