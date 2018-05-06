import React from 'react';
import PropTypes from 'prop-types';
import { removeFromCart } from 'actions/cart';
import { connect } from 'react-redux';
import { Loader, Alert, Form, FormTitle, FormInput, FormButton, FormLabel } from 'components/ui';
import { validateEmail, validatePassword } from 'helpers/validators';
import './cart.scss';

class Cart extends React.PureComponent {
  static propTypes = {
    price_total: PropTypes.number.isRequired,
    products_amount: PropTypes.number.isRequired,
    products_list: PropTypes.object.isRequired,
    removeFromCart: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pages: this.getPages(props.products_amount),
      password_required: false,
      loading: false,
      error: false,
    };

    this.inputRefs = {};

    this.removeProduct = this.removeProduct.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
    this.showPrevPage = this.showPrevPage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.products_amount !== this.props.products_amount) {
      const pages = this.getPages(nextProps.products_amount);
      this.setState({ pages, page: Math.min(this.state.page, pages) });
    }
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  getPages(total) {
    const pages = Math.max(Math.floor(total / 2), 1);
    return ((pages * 2) < total) ? (pages + 1) : pages;
  }

  handleSubmit() {
    const values = {};
    let error = false;
    const validators = {
      email: validateEmail,
    };

    if (this.state.password_required) {
      validators.password = validatePassword;
    }

    Object.keys(validators).forEach((field) => {
      const e = this.inputRefs[field];

      if (!e) {
        error = 'Something went wrong';
        return;
      }

      values[field] = e.value;
      const result = validators[field](values[field]);

      if (result !== true) {
        error = result;
      }
    });

    if (error) {
      this.setState({ error });
      return;
    }

    this.setState({ loading: true, error: false });
    console.log(values);
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
    if (this.props.price_total) {
      return (
        <div>
          <div className="cart-popup__price">${this.props.price_total}</div>
          <div className="cart-popup__total">Total</div>
        </div>
      );
    }
    
    return (<div><div className="cart-popup__price">Free!</div></div>);
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
    const { products_list, products_amount } = this.props;
    const { page } = this.state;
    const keys = Object.keys(products_list);
    const ret = [];

    for (let i = ((page - 1) * 2); i < Math.min(products_amount, (page * 2)); ++i) {
      const product_id = keys[i];
      const product = products_list[product_id];

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

  makeSubmit() {
    if (this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <div className="cart-popup__submit">
          <FormButton onClick={this.handleSubmit}>
            Submit
          </FormButton>
        </div>
      </FormLabel>
    );
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <div className="cart-popup__loader">
          <Loader color="white" />
        </div>
      </FormLabel>
    );
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <FormLabel>
        <Alert type="danger">{this.state.error}</Alert>
      </FormLabel>
    );
  }

  makePassword() {
    if (!this.state.password_required) {
      return null;
    }

    return (
      <FormLabel>
        <FormInput
          placeholder="Password"
          type="password"
          name="password"
          setRef={this.setInputRef}
        />
      </FormLabel>
    );
  }

  render() {
    if (!this.props.products_amount) {
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
            {this.makeError()}
            <FormLabel>
              <FormInput
                placeholder="Email"
                type="email"
                name="email"
                setRef={this.setInputRef}
              />
            </FormLabel>
            {this.makePassword()}
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
            {this.makeSubmit()}
            {this.makeLoader()}
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
      products_amount: state.cart.products_amount,
      products_list: state.cart.products_list,
      price_total: state.cart.price_total,
      show_cart: state.app.show_cart,
    };
  },
  (dispatch) => {
    return {
      removeFromCart: (productId) => { dispatch(removeFromCart(productId)); },
    };
  }
)(Cart);
