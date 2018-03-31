import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { Container } from 'components/ui';
import { connect } from 'react-redux';

class AdminContainer extends React.Component {
  static propTypes = {
    access_level: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  render() {
    console.log(this.props.access_level, this.props.logged_in);

    return (
      <Container>
        Admin Content
      </Container>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      access_level: state.user.access_level,
      logged_in: state.user.logged_in,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(AdminContainer);
