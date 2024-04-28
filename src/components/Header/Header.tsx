import React from 'react';


enum EPages {
  Graph2D,
}

type THeader = {
  setPageName: (name: EPages) => void;
};

const Header: React.FC<THeader> = ({ setPageName }) => {
  const handlePageChange = (page: EPages) => {
    setPageName(page);
  };

  return (
    <div className="header">
      <h1>Моя приложение</h1>
      <nav>
        <ul>
          <li>
            <button onClick={() => handlePageChange(EPages.Graph2D)}>Graph2D</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
