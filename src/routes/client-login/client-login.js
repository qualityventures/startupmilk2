import React from 'react';
import PropTypes from 'prop-types';
import TitleUpdater from 'containers/title-updater';
import { connect } from 'react-redux';
import { Alert } from 'components/ui';
import { withRouter } from 'react-router';
import FormSignIn from 'containers/form-signin';

class RouteClientLogin extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logged_in && !this.props.logged_in) {
      this.props.history.push('/dashboard');
    }
  }

  makeContent() {
    if (!this.props.logged_in) {
      return <FormSignIn />;
    }

    return <Alert>You have successfully logged in</Alert>;
  }

  render() {
    return (
      <div>
        <TitleUpdater title="Sign In" />

        {this.makeContent()}
      </div>
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
)(RouteClientLogin));
