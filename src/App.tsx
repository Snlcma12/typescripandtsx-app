import React, { useState } from "react";
import Header from "./components/Header/Header";
import Essay from "./components/Essay/Essay";
import TargetShooter from "./components/TargetShooter/TargetShooter";
import StudentSimulator from "./components/StudentSimulator/StudentSimulator";
import Graph2D from "./components/Graph2D/Graph2D";
import UniversalCalculator from "./components/UniversalCalculator/UniversalCalculator";
import Graph3D from "./components/Graph3D/Graph3D";

import "./App.css";

export enum EPAGES {
    ESSAY = 'Essay',
    TARGET_SHOOTER = 'TargetShooter',
    STUDENT_SIMULATOR = 'StudentSimulator',
    UNIVERSAL_CALCULATOR = 'UniversalCalculator',
    GRAPH_2D = 'Graph2D',
    GRAPH_3D = 'Graph3D',
}

const App: React.FC = () => {
    const [pageName, setPageName] = useState<EPAGES>(EPAGES.GRAPH_3D);

    return (<div className='app'>
        <Header setPageName={setPageName} />
        {pageName === EPAGES.ESSAY && <Essay />}
        {pageName === EPAGES.TARGET_SHOOTER && <TargetShooter />}
        {pageName === EPAGES.STUDENT_SIMULATOR && <StudentSimulator />}
        {pageName === EPAGES.UNIVERSAL_CALCULATOR && <UniversalCalculator />}
        {pageName === EPAGES.GRAPH_2D && <Graph2D />}
        {pageName === EPAGES.GRAPH_3D && <Graph3D />}
    </div>);
}

export default App;
