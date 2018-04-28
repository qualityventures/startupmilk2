import React from 'react';
import PropTypes from 'prop-types';
import { removeFromCart } from 'actions/cart';
import { connect } from 'react-redux';
import { Form, FormTitle, FormInput, FormButton, FormLabel } from 'components/ui';
import './cart.scss';

class Cart extends React.PureComponent {
  static propTypes = {
    products_total: PropTypes.number.isRequired,
    products: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  makePrice() {
    const { products } = this.props;
    let price = 0;

    Object.keys(products).forEach((productId) => {
      price += products[productId].price;
    });

    return (
      <div>
        <div className="cart-popup__price">
          ${price}
        </div>
        <div className="cart-popup__total">
          Total
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.products_total) {
      return (
        <div className="cart-popup__wrapper">
          <div className="cart-popup__empty">
            The cart is empty
          </div>
        </div>
      );
    }

    return (
      <div className="cart-popup__wrapper">
        <div className="cart-popup__checkout">
          <Form>
            <FormLabel>
              <FormTitle>Check Out With a Card</FormTitle>
            </FormLabel>
            <FormLabel>
              <FormInput
                defaultValue="Email"
                name="email"
              />
            </FormLabel>
            <FormLabel>
              <FormInput
                defaultValue="Cart Number"
                name="email"
              />
            </FormLabel>
            <FormLabel>
              <FormInput
                defaultValue="EXP"
                name="email"
              />
            </FormLabel>
            <FormLabel>
              <FormInput
                defaultValue="CVC"
                name="email"
              />
            </FormLabel>
            <FormLabel>
              {this.makePrice()}
            </FormLabel>
            <FormLabel>
              <FormButton>Submit</FormButton>
            </FormLabel>
          </Form>
        </div>
        <div className="cart-popup__products">
          Products
        </div>
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      products_total: Object.keys(state.cart).length,
      products: state.cart,
      show_cart: state.app.show_cart,
    };
  },
  (dispatch) => {
    return {
      removeFromCart: (productId) => { dispatch(removeFromCart(productId)); },
    };
  }
)(Cart);
