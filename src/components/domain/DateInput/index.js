import { useEffect, useRef } from "react";

export default function DateInput({
    min = new Date(),
    max = new Date(),
    ...props
}) {
    const yearRef = useRef();
    const monthRef = useRef();
    const dateRef = useRef();

    // 상세한 구현 내용부터 구상 후 작성 예정
    useEffect(() => {
        const minDate = new Date(min);
        const maxDate = new Date(max);
        
        let yearOptions = "";
        for (let i = minDate.getFullYear(); i <= maxDate.getFullYear(); i++) {
            yearOptions += `<option data-year="${i}">${i}</option>`;
        }
        yearRef.current.innerHTML = yearOptions;

    }, [min, max]);
    return (
        <div>
            <select className="year" ref={yearRef} style={{...props}}/>
            <select className="month" ref={monthRef} style={{...props}}/>
            <select className="date" ref={dateRef} style={{...props}}/>
        </div>
    );
}