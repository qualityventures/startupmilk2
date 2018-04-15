import React from 'react';
import PropTypes from 'prop-types';

class Catalog extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className="catalog">
        <div className="catalog-list">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Catalog;
