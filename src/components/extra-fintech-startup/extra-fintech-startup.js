import React from 'react';
import PropTypes from 'prop-types';
import './extra-fintech-startup.scss';

class ExtraFintechStartup extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  render() {
    console.log(this.props.data);

    return (
      <div>
        ExtraFintechStartup
      </div>
    );
  }
}

export default ExtraFintechStartup;
