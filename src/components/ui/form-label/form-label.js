import React from 'react';
import PropTypes from 'prop-types';
import './form-label.scss';

class FormLabel extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: null,
  }

  render() {
    return (
      <div className="form__label" onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default FormLabel;
