import React from 'react';
import PropTypes from 'prop-types';
import { NavigationLink } from 'components/ui';
import { withRouter } from 'react-router';
import CATEGORIES_LIST from 'data/categories';

class Navigation extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired,
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
        content="Back to matte.design"
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

    Object.keys(CATEGORIES_LIST).forEach((key) => {
      const title = CATEGORIES_LIST[key];

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
    const { role, type } = this.props;

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
