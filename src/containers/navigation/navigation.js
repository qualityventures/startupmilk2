import React from 'react';
import PropTypes from 'prop-types';
import { NavigationLink } from 'components/ui';
import { withRouter } from 'react-router';

const CATEGORIES_LIST = [
  ['icons', 'Icons'],
  ['startup-kits', 'Startup kits'],
  ['illustrations', 'Illustrations'],
  ['motion', 'Motion'],
  ['marketing', 'Marketing'],
];

class Navigation extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    access_level: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'client',
  }

  makeAdminNavigation() {
    console.log('makeAdminNavigation');
    return [];
  }

  makeClientNavigation() {
    const { pathname } = this.props.location;
    const list = [
      <NavigationLink
        key={'all'}
        to="/"
        selected={pathname === '/'}
        content="All"
      />,
    ];

    CATEGORIES_LIST.forEach((category) => {
      const [key, title] = category;

      list.push(
        <NavigationLink
          key={key}
          to={`/products/${key}`}
          selected={pathname === `/products/${key}`}
          content={title}
        />
      );
    });

    return list;
  }

  render() {
    const { access_level, logged_in, type } = this.props;

    if (type !== 'admin') {
      return this.makeClientNavigation();
    }

    if (access_level !== 'admin') {
      return null;
    }

    return this.makeAdminNavigation();
  }
}

export default withRouter(Navigation);
