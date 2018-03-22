import React from 'react';
import { Route, Switch } from 'react-router';
import { Container } from 'components/ui';
import routes from 'routes';

class WebContainer extends React.Component {
  render() {
    return (
      <Container>
        <Switch>
          {routes.map(route => (
            <Route {...route} />
          ))}
        </Switch>
      </Container>
    );
  }
}

export default WebContainer;
