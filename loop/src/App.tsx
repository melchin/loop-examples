import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Paginator } from "generics";

function App() {
  const [index, setIndex] = React.useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Paginator
          setPageIndex={setIndex}
          perPage={10}
          pageIndex={index}
          totalRecords={200}
        />
      </header>
    </div>
  );
}

export default App;
