import React from 'react';
import PropTypes from 'prop-types';
import { removeFromCart, clearCart } from 'actions/cart';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loader, Alert, Form, FormTitle, FormInput, FormButton, FormLabel } from 'components/ui';
import { validateEmail, validatePassword } from 'helpers/validators';
import apiFetch from 'helpers/api-fetch';
import { userSignIn } from 'actions/user';
import { tokenSet } from 'actions/token';
import { STRIPE_PUBLISHED_KEY } from 'data/config.public';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PaymentsForm from './components/payments-form';
import './cart.scss';

class Cart extends React.PureComponent {
  static propTypes = {
    price_total: PropTypes.number.isRequired,
    products_amount: PropTypes.number.isRequired,
    products_list: PropTypes.object.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    userSignIn: PropTypes.func.isRequired,
    tokenSet: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    show_cart: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pages: this.getPages(props.products_amount),
      password_required: false,
      password_recovered: false,
      loading: false,
      error: false,
      stripe_token: false,
      stripe_object: null,
      success: false,
    };

    this.inputRefs = {};
    this.createStripeToken = null;

    this.removeProduct = this.removeProduct.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
    this.showPrevPage = this.showPrevPage.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRecover = this.handleRecover.bind(this);
    this.setStripeCreateToken = this.setStripeCreateToken.bind(this);
  }

  componentDidMount() {
    this.setState({
      stripe_object: window.Stripe(STRIPE_PUBLISHED_KEY),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.products_amount !== this.props.products_amount) {
      const pages = this.getPages(nextProps.products_amount);
      this.setState({ pages, page: Math.min(this.state.page, pages) });
    }

    if (!nextProps.show_cart && this.props.show_cart) {
      this.setState({
        password_required: false,
        password_recovered: false,
        error: false,
        success: false,
        stripe_token: false,
      });
    }
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setStripeCreateToken(func) {
    this.createStripeToken = func;
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  getPages(total) {
    const pages = Math.max(Math.floor(total / 2), 1);
    return ((pages * 2) < total) ? (pages + 1) : pages;
  }

  handleRecover() {
    if (this.state.loading) {
      return;
    }

    const email = this.inputRefs.email.value;
    const validation = validateEmail(email);

    if (validation !== true) {
      this.setState({ error: validation });
      this.inputRefs.email.focus();
      return;
    }

    this.setState({ loading: true, error: false });

    apiFetch('api/auth/recover', {
      method: 'POST',
      payload: { email },
    }).then((response) => {
      this.setState({ loading: false, password_recovered: true });
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
  }

  handleSubmit() {
    if (this.state.loading) {
      return;
    }

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
        e.focus();
      }
    });

    if (error) {
      this.setState({ error });
      return;
    }

    if (this.props.price_total && !this.state.stripe_token) {
      if (!this.createStripeToken) {
        this.setState({ error: 'Error loading stripe' });
        return;
      }
      
      this.setState({ loading: true });

      this.createStripeToken()
        .then((result) => {
          if (result.error) {
            this.setState({ loading: false, error: result.error.message });
            return;
          }

          if (!result.token) {
            this.setState({ loading: false, error: 'Something went wrong' });
            return;
          }

          this.setState({
            stripe_token: result.token,
            loading: false,
          }, this.handleSubmit);
        })
        .catch((err) => {
          this.setState({ loading: false, error: err });
        });
      return;
    }
    
    this.setState({ loading: true, error: false });

    apiFetch('api/orders/', {
      method: 'POST',
      payload: {
        email: values.email,
        password: values.password || null,
        stripe_token: this.state.stripe_token,
      },
    }).then((response) => {
      if (response.redirect) {
        this.props.history.push(response.redirect);
      }

      if (response.auth) {
        this.props.tokenSet(response.auth.token);
        this.props.userSignIn(response.auth.data);
      }

      if (response.success) {
        this.props.clearCart();
        this.setState({ loading: false, success: true });
      } else {
        const err_msg = response.err_msg || 'Something went wrong';

        if (err_msg === 'password_required') {
          this.setState(
            { loading: false, error: 'Password required', password_required: true },
            this.handleSubmit
          );
        } else {
          this.setState({ loading: false, error: err_msg });
        }
      }
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
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

  makePaymentsForm() {
    if (!this.props.price_total) {
      return null;
    }

    return (
      <FormLabel>
        <StripeProvider stripe={this.state.stripe_object}>
          <Elements>
            <PaymentsForm
              setStripeCreateToken={this.setStripeCreateToken}
            />
          </Elements>
        </StripeProvider>
      </FormLabel>
    );
  }

  makePassword() {
    if (!this.state.password_required) {
      return null;
    }

    const ret = [
      <FormLabel key="password">
        <FormInput
          placeholder="Password"
          type="password"
          name="password"
          setRef={this.setInputRef}
          disabled={this.state.loading}
        />
      </FormLabel>,
    ];

    if (!this.state.loading) {
      if (!this.state.password_recovered) {
        ret.push(
          <FormLabel key="recover">
            <div className="cart-popup__recover" onClick={this.handleRecover}>
              Recover password
            </div>
          </FormLabel>
        );
      } else {
        ret.push(
          <FormLabel key="recover">
            <div className="cart-popup__recovered">
              New password was sent to your email
            </div>
          </FormLabel>
        );
      }
    }

    return ret;
  }

  makeFormPlaceholder(text) {
    return (
      <div className="cart-popup__wrapper">
        <div className="cart-popup__checkout">
          <FormLabel>
            <FormTitle>Check Out With a Card</FormTitle>
          </FormLabel>
          <FormLabel>
            <div className="cart-popup__empty">
              {text}
            </div>
          </FormLabel>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.success) {
      return this.makeFormPlaceholder('Your order details have been sent to the email address you provided');
    }

    if (!this.props.products_amount) {
      return this.makeFormPlaceholder('Oops there is nothing in your cart');
    }

    if (this.props.price_total && !this.state.stripe_object) {
      return this.makeFormPlaceholder('Initializing payments...');
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
                defaultValue={this.props.email}
                disabled={!!this.props.email || this.state.loading || this.state.password_required}
                setRef={this.setInputRef}
              />
            </FormLabel>
            {this.makePassword()}
            {this.makePaymentsForm()}
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

export default withRouter(connect(
  (state, props) => {
    return {
      products_amount: state.cart.products_amount,
      products_list: state.cart.products_list,
      price_total: state.cart.price_total,
      show_cart: state.app.show_cart,
      email: state.user.data.email || '',
    };
  },
  (dispatch) => {
    return {
      removeFromCart: (productId) => { dispatch(removeFromCart(productId)); },
      userSignIn: (user) => { dispatch(userSignIn(user)); },
      tokenSet: (token) => { dispatch(tokenSet(token)); },
      clearCart: () => { dispatch(clearCart()); },
    };
  }
)(Cart));
