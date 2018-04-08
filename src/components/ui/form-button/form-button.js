import React from 'react';
import PropTypes from 'prop-types';
import './form-button.scss';

class FormButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    onClick: false,
  }

  render() {
    return (
      <div className="form__button" onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default FormButton;
