// Libs
import React from "react";

// Components
import { IntlProvider } from "react-intl";
import { Breeds } from "modules/dogs";

function App() {
  return (
    <IntlProvider locale={"en"}>
      <Breeds />
    </IntlProvider>
  );
}

export default App;
