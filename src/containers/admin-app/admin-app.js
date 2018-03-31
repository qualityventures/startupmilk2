import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AdminContainer from 'containers/admin-container';

class AdminApp extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <AdminContainer />
      </BrowserRouter>
    );
  }
}

export default AdminApp;
