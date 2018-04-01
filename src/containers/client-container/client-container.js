import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router';
import { Container } from 'components/ui';
import { connect } from 'react-redux';
import Navigation from 'containers/navigation';
import routes from 'routes';

class ClientContainer extends React.PureComponent {
  static propTypes = {
    access_level: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  makeNavigation() {
    const { logged_in, access_level } = this.props;

    return (
      <Navigation 
        type="client"
        access_level={access_level}
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
      access_level: state.user.access_level,
      logged_in: state.user.logged_in,
      pathname: props.location.pathname,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(ClientContainer));
