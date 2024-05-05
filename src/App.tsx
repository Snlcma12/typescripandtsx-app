import React, { useState } from "react";
import Header from "./components/Header/Header";
import Graph2D from "./components/Graph2D/Graph2D";
import UniversalCalculator from "./components/UniversalCalculator/UniversalCalculator";

import "./App.css";

export enum EPAGES {
    ESSAY = 'Essay',
    TARGET_SHOOTER = 'TargetShooter',
    STUDENT_SIMULATOR = 'StudentSimulator',
    UNIVERSAL_CALCULATOR = 'UniversalCalculator',
    GRAPH_2D = 'Graph2D',
}

const App: React.FC = () => {
    const [pageName, setPageName] = useState<EPAGES>(EPAGES.GRAPH_2D);

    return (<div className='app'>
        <Header setPageName={setPageName} />
        {pageName === EPAGES.UNIVERSAL_CALCULATOR && <UniversalCalculator />}
        {pageName === EPAGES.GRAPH_2D && <Graph2D />}
    </div>);
}

export default App;
