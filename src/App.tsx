import React, { useState } from "react";
import Header from "./components/Header/Header";
import Graph2D from "./components/Graph2D/Graph2D";
import UniversalCalculator from "./components/UniversalCalculator/UniversalCalculator";
import Graph3D from "./components/Graph3D/Graph3D";

import "./App.css";

export enum EPAGES {
    UNIVERSAL_CALCULATOR = 'UniversalCalculator',
    GRAPH_2D = 'Graph2D',
    GRAPH_3D = 'Graph3D',
}

const App: React.FC = () => {
    const [pageName, setPageName] = useState<EPAGES>(EPAGES.GRAPH_2D);

    return (<div className='app'>
        <Header setPageName={setPageName} />
        {pageName === EPAGES.UNIVERSAL_CALCULATOR && <UniversalCalculator />}
        {pageName === EPAGES.GRAPH_2D && <Graph2D />}
        {pageName === EPAGES.GRAPH_3D && <Graph3D />}
    </div>);
}

export default App;
