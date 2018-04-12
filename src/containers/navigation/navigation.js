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
    role: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'client',
  }

  makeAdminNavigation() {
    const { pathname } = this.props.location;
    const list = [
      <NavigationLink
        key={'products'}
        to="/admin/products"
        selected={pathname === '/admin/' || pathname === '/admin/products'}
        content="Products"
      />,
    ];

    list.push(
      <NavigationLink
        key="landing"
        href="/"
        selected={false}
        content="Back to milkicons_"
      />
    );

    return list;
  }

  makeClientNavigation() {
    const { pathname } = this.props.location;
    const { role } = this.props;
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

    if (role === 'admin') {
      list.push(
        <NavigationLink
          key="admin"
          href="/admin/"
          selected={false}
          content="Admin CP"
        />
      );
    }

    return list;
  }

  render() {
    const { role, logged_in, type } = this.props;

    if (type !== 'admin') {
      return this.makeClientNavigation();
    }

    if (role !== 'admin') {
      return null;
    }

    return this.makeAdminNavigation();
  }
}

export default withRouter(Navigation);
