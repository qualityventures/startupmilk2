import React from 'react';
import PropTypes from 'prop-types';
import styles from './container.scss';

class Container extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className={styles.wrapper}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
