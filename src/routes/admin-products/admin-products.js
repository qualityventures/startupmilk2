import React from 'react';
import PropTypes from 'prop-types';

class RouteAdminProducts extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  render() {
    const category = this.props.match.params.category || 'all';

    return (
      <div>
        RouteAdminProducts - {category}
      </div>
    );
  }
}

export default RouteAdminProducts;
