import React from 'react';
import PropTypes from 'prop-types';
import { FormButton } from 'components/ui';

class RouteAdminProducts extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  render() {
    const category = 'all';

    // console.log(this.props.location.search);

    return (
      <div>
        <div><FormButton to="/admin/product/create">Add new product</FormButton></div>
        RouteAdminProducts - {category}
      </div>
    );
  }
}

export default RouteAdminProducts;
