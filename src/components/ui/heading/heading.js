import React from 'react';
import PropTypes from 'prop-types';
import './heading.scss';

class Heading extends React.PureComponent {
  static propTypes = {
    textAlign: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
    textAlign: 'left',
  }

  render() {
    const { textAlign, children } = this.props;

    return (
      <div className="ui__heading" style={{ textAlign }}>
        {children}
      </div>
    );
  }
}

export default Heading;
