import React from 'react';
import PropTypes from 'prop-types';
import styles from './loader.scss';

class Loader extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['big', 'small']),
  }

  static defaultProps = {
    size: 'big',
  }

  render() {
    return (
      <div className={`loader loader--${this.props.size}`}>
        <div className="dot dot--1" />
        <div className="dot dot--2" />
        <div className="dot dot--3" />
      </div>
    );
  }
}

export default Loader;
