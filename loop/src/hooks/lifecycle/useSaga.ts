// Libs
import React from "react";

// Types
import { Saga } from "redux-saga";

// Free API that I can use for testing data: https://jsonplaceholder.typicode.com/users
const useSaga = (saga: Saga) => [false, null];

export function withSaga(saga: Saga) {
  /**
   * @param Wrapped  - The component we're wrapping around
   * @param busyNode - Node rendered while the program is booting
   */
  const WrappedComponent = <P extends {}>(
    Wrapped: React.FC<P>,
    busyNode?: React.FC<any>
  ) => {
    const WithSaga: React.FC<P> = (props) => {
      const [loading, result] = useSaga(saga);

      if (loading) {
        return React.createElement(busyNode || "Loading...");
      }

      return React.createElement(Wrapped, { ...props });
    };

    return WithSaga;
  };

  return WrappedComponent;
}

export default useSaga;
