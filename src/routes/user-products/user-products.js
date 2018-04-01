import React from 'react';
import PropTypes from 'prop-types';

class RouteUserProducts extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  render() {
    const category = this.props.match.params.category || 'all';

    return (
      <div>
        RouteUserProducts - {category}
      </div>
    );
  }
}

export default RouteUserProducts;
