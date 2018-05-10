import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router';
import FormSignIn from 'containers/form-signin';
import routes from 'routes/dashboard';

class RouteDashboard extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  render() {
    if (!this.props.logged_in) {
      return <FormSignIn />;
    }

    return (
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    );
  }
}

export default withRouter(connect(
  (state, props) => {
    return {
      logged_in: state.user.logged_in,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(RouteDashboard));
