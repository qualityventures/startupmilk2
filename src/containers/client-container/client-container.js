import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router';
import { Container } from 'components/ui';
import { connect } from 'react-redux';
import { showCart, hideCart } from 'actions/app';
import Navigation from 'containers/navigation';
import routes from 'routes/client';

class ClientContainer extends React.PureComponent {
  static propTypes = {
    role: PropTypes.string.isRequired,
    logged_in: PropTypes.bool.isRequired,
    cartItems: PropTypes.number.isRequired,
    showCart: PropTypes.func.isRequired,
    hideCart: PropTypes.func.isRequired,
    show_cart: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.toggleCart = this.toggleCart.bind(this);
  }

  makeNavigation() {
    const { logged_in, role } = this.props;

    return (
      <Navigation 
        type="client"
        role={role}
        logged_in={logged_in}
      />
    );
  }

  toggleCart() {
    console.log('toggleCart');
    if (this.props.show_cart) {
      this.props.hideCart();
    } else {
      this.props.showCart();
    }
  }

  render() {
    return (
      <Container
        navigation={this.makeNavigation()}
        toggleCart={this.toggleCart}
        cartItems={this.props.cartItems}
        showCart={this.props.show_cart}
      >
        <Switch>
          {routes.map(route => (
            <Route {...route} />
          ))}
        </Switch>
      </Container>
    );
  }
}

export default withRouter(connect(
  (state, props) => {
    return {
      cartItems: Object.keys(state.cart).length,
      role: state.user.role,
      logged_in: state.user.logged_in,
      pathname: props.location.pathname,
      show_cart: state.app.show_cart,
    };
  },
  (dispatch) => {
    return {
      showCart: () => { dispatch(showCart()); },
      hideCart: () => { dispatch(hideCart()); },
    };
  }
)(ClientContainer));
