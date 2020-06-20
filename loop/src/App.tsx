import React from "react";

import { Paginator } from "generics";

function App() {
  const [index, setIndex] = React.useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
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
