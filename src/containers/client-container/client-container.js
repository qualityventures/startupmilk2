import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router';
import { Container } from 'components/ui';
import { connect } from 'react-redux';
import Navigation from 'containers/navigation';
import routes from 'routes/client';

class ClientContainer extends React.PureComponent {
  static propTypes = {
    role: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  makeNavigation() {
    const { logged_in, role } = this.props;

    return (
      <Navigation 
        type="client"
        role={role}
        logged_in={logged_in}
      />
    );
  }

  render() {
    return (
      <Container navigation={this.makeNavigation()}>
        <Switch>
          {routes.map(route => (
            <Route {...route} />
          ))}
        </Switch>
      </Container>
    );
  }
}

export default withRouter(connect(
  (state, props) => {
    return {
      role: state.user.role,
      logged_in: state.user.logged_in,
      pathname: props.location.pathname,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(ClientContainer));
