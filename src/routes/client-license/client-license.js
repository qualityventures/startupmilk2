import React from 'react';
import PropTypes from 'prop-types';
import { setTitle } from 'actions/title';
import { connect } from 'react-redux';

class RouteClientLicense extends React.PureComponent {
  static propTypes = {
    setTitle: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
  }

  updateTitle() {
    this.props.setTitle('License');
  }

  render() {
    return (
      <div>
        RouteClientLicense
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {

    };
  },
  (dispatch) => {
    return {
      setTitle: (title) => { dispatch(setTitle(title)); },
    };
  }
)(RouteClientLicense);
