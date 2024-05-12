import React from 'react';
import { EPAGES } from '../../App';

import './Header.css';

type THeader = {
    setPageName: (name: EPAGES) => void;
}

const Header: React.FC<THeader> = (props: THeader) => {
    const { setPageName } = props;

    return (<>
        <h1>Итоговая работа</h1>
        <button onClick={() => setPageName(EPAGES.UNIVERSAL_CALCULATOR)} className='HeaderBtn'>Калькулятор</button>
        <button onClick={() => setPageName(EPAGES.GRAPH_2D)} className='HeaderBtn'>Графика 2д</button>
        <button onClick={() => setPageName(EPAGES.GRAPH_3D)} className='HeaderBtn'>Графика 3Д</button>
    </>);
}

export default Header;