import React from 'react';
import PropTypes from 'prop-types';
import './form.scss';

class Form extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className="form__wrapper">
        {this.props.children}
      </div>
    );
  }
}

export default Form;
