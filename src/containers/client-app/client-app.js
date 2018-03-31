import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ClientContainer from 'containers/client-container';

class ClientApp extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <ClientContainer />
      </BrowserRouter>
    );
  }
}

export default ClientApp;
