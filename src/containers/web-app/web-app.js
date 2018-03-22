import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import WebContainer from 'containers/web-container';

class WebApp extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <WebContainer />
      </BrowserRouter>
    );
  }
}

export default WebApp;
