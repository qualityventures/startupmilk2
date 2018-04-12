import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './form-button.scss';

class FormButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: null,
    to: null,
    href: null,
  }

  render() {
    let Component = 'div';
    const props = {
      className: 'form__button',
      onClick: this.props.onClick,
    };

    if (this.props.to) {
      Component = Link;
      props.to = this.props.to;
    }

    if (this.props.href) {
      Component = 'a';
      props.href = this.props.href;
    }

    return (
      <Component {...props}>
        {this.props.children}
      </Component>
    );
  }
}

export default FormButton;
