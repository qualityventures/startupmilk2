'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TITLE_BASE, TITLE_SEPARATOR } from 'data/config';

class TitleUpdater extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.updateTitle();
    }
  }

  updateTitle() {
    const { title } = this.props;

    if (title) {
      document.title = `${title} ${TITLE_SEPARATOR} ${TITLE_BASE}`;
    } else {
      document.title = TITLE_BASE;
    }
  }

  render() {
    return null;
  }
}

export default connect(
  (state) => {
    return {
      title: state.title,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(TitleUpdater);
