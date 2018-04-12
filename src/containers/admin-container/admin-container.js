import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router';
import { Container, Alert } from 'components/ui';
import { connect } from 'react-redux';
import Navigation from 'containers/navigation';
import FormSignIn from 'containers/form-signin';
import routes from 'routes/admin';

class AdminContainer extends React.PureComponent {
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
        type="admin"
        role={role}
        logged_in={logged_in}
      />
    );
  }

  makeContent() {
    const { role, logged_in } = this.props;

    if (!logged_in) {
      return <FormSignIn />;
    }

    if (role !== 'admin') {
      return <Alert type="danger">Access denied</Alert>;
    }

    return (
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    );
  }

  render() {

    return (
      <Container navigation={this.makeNavigation()}>
        {this.makeContent()}
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
)(AdminContainer));
