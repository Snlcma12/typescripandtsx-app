import React, { useState } from 'react';
import Graph2D from "./components/Graph2D/Graph2D";
import Header from "./components/Header/Header";


export enum EPages {
  Graph2D,
}

const App: React.FC = () => {
  const [pageName, setPageName] = useState(EPages.Graph2D); 

  

  return (
    <div>
      <Header setPageName={setPageName} />
      {pageName === EPages.Graph2D && <Graph2D />}
    </div>
  );
};

export default App;