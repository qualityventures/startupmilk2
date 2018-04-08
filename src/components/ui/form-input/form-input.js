import React from 'react';
import PropTypes from 'prop-types';
import './form-input.scss';

class FormInput extends React.PureComponent {
  static propTypes = {
    onKeyDown: PropTypes.func,
    setRef: PropTypes.func,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    type: PropTypes.string,
  }

  static defaultProps = {
    onKeyDown: null,
    setRef: null,
    disabled: null,
    type: 'text',
    name: null,
    placeholder: null,
    id: null,
  }

  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(e) {
    const { name, setRef } = this.props;

    if (setRef) {
      setRef(e, name || null);
    }
  }

  render() {
    const props = {
      className: 'form__input',
      type: this.props.type,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
    };

    if (this.props.onKeyDown) {
      props.onKeyDown = this.props.onKeyDown;
    }

    if (this.props.setRef) {
      props.ref = this.setRef;
    }

    if (this.props.name) {
      props.name = this.props.name;
    }

    if (this.props.id) {
      props.id = this.props.id;
    }

    return (
      <input {...props} />
    );
  }
}

export default FormInput;
