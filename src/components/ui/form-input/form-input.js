import React from 'react';
import PropTypes from 'prop-types';
import './form-input.scss';

class FormInput extends React.PureComponent {
  static propTypes = {
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func,
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
    onSubmit: null,
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
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  onKeyDown(e) {
    const { onKeyDown, onSubmit } = this.props;

    if (onKeyDown && this.props.onKeyDown(e) === false) {
      return;
    }

    if (e.keyCode !== 13) {
      return;
    }

    onSubmit();
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
      onKeyDown: this.onKeyDown,
    };

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
