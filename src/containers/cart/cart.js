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
    removeFromCart: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pages: this.getPages(props.products_total),
      loading: {},
    };

    this.removeProduct = this.removeProduct.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
    this.showPrevPage = this.showPrevPage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.products_total !== this.props.products_total) {
      const pages = this.getPages(nextProps.products_total);
      this.setState({ pages, page: Math.min(this.state.page, pages) });
    }
  }

  getPages(total) {
    const pages = Math.max(Math.floor(total / 2), 1);
    return ((pages * 2) < total) ? (pages + 1) : pages;
  }

  removeProduct(e) {
    const product_id = e.target.getAttribute('product_id');

    if (product_id) { 
      this.props.removeFromCart(product_id);
    }
  }

  showNextPage() {
    const next = Math.min(this.state.pages, this.state.page + 1);

    if (next !== this.state.page) {
      this.setState({ page: next });
    }
  }

  showPrevPage() {
    const prev = Math.max(1, this.state.page - 1);

    if (prev !== this.state.page) {
      this.setState({ page: prev });
    }
  }

  makePrice() {
    const { products } = this.props;
    let price = 0;

    Object.keys(products).forEach((productId) => {
      price += products[productId].price;
    });

    price = Math.round(price * 100) / 100;

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

  makePrevButton() {
    if (this.state.page === 1) {
      return null;
    }

    return (
      <div
        className="cart-popup__page-prev"
        onClick={this.showPrevPage}
      />
    );
  }

  makeNextButton() {
    if (this.state.page === this.state.pages) {
      return null;
    }

    return (
      <div
        className="cart-popup__page-next"
        onClick={this.showNextPage}
      />
    );
  }

  makeProducts() {
    const { products, products_total } = this.props;
    const { page } = this.state;
    const keys = Object.keys(products);
    const ret = [];

    for (let i = ((page - 1) * 2); i < Math.min(products_total, (page * 2)); ++i) {
      const product_id = keys[i];
      const product = products[product_id];

      ret.push(
        <div key={product_id} className="cart-popup__product-wrapper">
          <div className="cart-popup__product">
            <div className="cart-popup__product-image-wrapper">
              <div
                className="cart-popup__product-image"
                style={{
                  backgroundImage: `url('${product.image}')`,
                }}
              />
            </div>

            <div className="cart-popup__product-name">
              {product.name}
            </div>

            <div className="cart-popup__product-price">
              {product.price ? `$${product.price}` : 'Free!'}
            </div>

            <div
              className="cart-popup__product-remove"
              onClick={this.removeProduct}
              product_id={product_id}
            />
          </div>
        </div>
      );
    }

    return ret;
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
                placeholder="Email"
                type="email"
                name="email"
              />
            </FormLabel>
            <FormLabel>
              <FormInput
                placeholder="Cart Number"
                name="email"
                type="cart"
              />
            </FormLabel>
            <FormLabel>
              <div className="cart-popup__exp">
                <FormInput
                  placeholder="EXP"
                  name="exp"
                />
              </div>
              <div className="cart-popup__cvc">
                <FormInput
                  placeholder="CVC"
                  name="cvc"
                  type="number"
                />
              </div>
            </FormLabel>
            <FormLabel>
              {this.makePrice()}
            </FormLabel>
            <FormLabel>
              <div className="cart-popup__submit">
                <FormButton>Submit</FormButton>
              </div>
            </FormLabel>
          </Form>
        </div>
        <div className="cart-popup__products">
          {this.makeProducts()}
          {this.makePrevButton()}
          {this.makeNextButton()}
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
