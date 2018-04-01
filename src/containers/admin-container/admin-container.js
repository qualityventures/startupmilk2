import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Container } from 'components/ui';
import { connect } from 'react-redux';
import Navigation from 'containers/navigation';

class AdminContainer extends React.PureComponent {
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
        type="admin"
        access_level={access_level}
        logged_in={logged_in}
      />
    );
  }

  makeContent() {
    const { access_level, logged_in } = this.props;

    if (!logged_in) {
      return 'Sing in form';
    }

    if (access_level !== 'admin') {
      return 'Access denied';
    }

    return 'Admin Content';
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
      access_level: state.user.access_level,
      logged_in: state.user.logged_in,
      pathname: props.location.pathname,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(AdminContainer));
