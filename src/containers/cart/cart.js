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
import { hideCart } from 'actions/app';
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
    hideCart: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      show_payments_step: false,
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

    this.showPaymentsStep = this.showPaymentsStep.bind(this);
    this.hidePaymentsStep = this.hidePaymentsStep.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRecover = this.handleRecover.bind(this);
    this.setStripeCreateToken = this.setStripeCreateToken.bind(this);
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe_object: window.Stripe(STRIPE_PUBLISHED_KEY) });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.price_total && this.props.price_total) {
      this.setState({ show_payments_step: false });
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

  showPaymentsStep() {
    this.setState({ show_payments_step: true });
  }

  hidePaymentsStep() {
    this.setState({ show_payments_step: false });
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

  // makePrice() {
  //   if (this.props.price_total) {
  //     return (
  //       <div>
  //         <div className="cart-popup__price">${this.props.price_total}</div>
  //         <div className="cart-popup__total">Total</div>
  //       </div>
  //     );
  //   }
    
  //   return (<div><div className="cart-popup__price">Free!</div></div>);
  // }

  // makeProducts() {
  //   const { products_list } = this.props;

  //   return Object.keys(products_list).map((product_id) => {
  //     const product = products_list[product_id];

  //     return (
  //       <div key={product_id} className="cart-popup__product-wrapper">
  //         <div className="cart-popup__product">
  //           <div className="cart-popup__product-image-wrapper">
  //             <div
  //               className="cart-popup__product-image"
  //               style={{
  //                 backgroundImage: `url('${product.image}')`,
  //               }}
  //             />
  //           </div>

  //           <div className="cart-popup__product-name">
  //             {product.name}
  //           </div>

  //           <div className="cart-popup__product-price">
  //             {product.price ? `$${product.price}` : 'Free!'}
  //           </div>

  //           <div
  //             className="cart-popup__product-remove"
  //             onClick={this.removeProduct}
  //             product_id={product_id}
  //           />
  //         </div>
  //       </div>
  //     );
  //   });
  // }

  // makeSubmit() {
  //   if (this.state.loading) {
  //     return null;
  //   }

  //   return (
  //     <FormLabel>
  //       <div className="cart-popup__submit">
  //         <FormButton onClick={this.handleSubmit}>
  //           Submit
  //         </FormButton>
  //       </div>
  //     </FormLabel>
  //   );
  // }

  // makeLoader() {
  //   if (!this.state.loading) {
  //     return null;
  //   }

  //   return (
  //     <FormLabel>
  //       <div className="cart-popup__loader">
  //         <Loader color="white" />
  //       </div>
  //     </FormLabel>
  //   );
  // }

  // makeError() {
  //   if (!this.state.error) {
  //     return null;
  //   }

  //   return (
  //     <FormLabel>
  //       <Alert type="danger">{this.state.error}</Alert>
  //     </FormLabel>
  //   );
  // }

  // makePaymentsForm() {
  //   if (!this.props.price_total) {
  //     return null;
  //   }

  //   return (
  //     <FormLabel>
  //       <StripeProvider stripe={this.state.stripe_object}>
  //         <Elements>
  //           <PaymentsForm
  //             setStripeCreateToken={this.setStripeCreateToken}
  //           />
  //         </Elements>
  //       </StripeProvider>
  //     </FormLabel>
  //   );
  // }

  // makePassword() {
  //   if (!this.state.password_required) {
  //     return null;
  //   }

  //   const ret = [
  //     <FormLabel key="password">
  //       <FormInput
  //         placeholder="Password"
  //         type="password"
  //         name="password"
  //         setRef={this.setInputRef}
  //         disabled={this.state.loading}
  //       />
  //     </FormLabel>,
  //   ];

  //   if (!this.state.loading) {
  //     if (!this.state.password_recovered) {
  //       ret.push(
  //         <FormLabel key="recover">
  //           <div className="cart-popup__recover" onClick={this.handleRecover}>
  //             Recover password
  //           </div>
  //         </FormLabel>
  //       );
  //     } else {
  //       ret.push(
  //         <FormLabel key="recover">
  //           <div className="cart-popup__recovered">
  //             New password was sent to your email
  //           </div>
  //         </FormLabel>
  //       );
  //     }
  //   }

  //   return ret;
  // }

  makeCartTitle() {
    let className = 'cart-popup__title';
    let back = null;
    let close = null;

    if (this.state.show_payments_step) {
      back = <div className="cart-popup__back" onClick={this.hidePaymentsStep} />;
    }
    if (!this.state.show_payments_step) {
      close = <div className="cart-popup__close" onClick={this.props.hideCart} />;
    }

    if (this.state.show_payments_step) {
      className += ' cart-popup__title--with-padding';
    }

    return (
      <div className={className}>
        {back}
        {this.state.show_payments_step ? 'Checkout' : 'Cart'}
        {close}
      </div>
    );
  }

  makePlaceholder(content) {
    return (
      <div className="cart-popup__placeholder-wrapper">
        <div className="cart-popup__placeholder">
          {content}
        </div>
      </div>
    );
  }

  makeProductsList() {
    if (this.state.show_payments_step) {
      return null;
    }

    const { products_list } = this.props;
    const ret = [];

    Object.keys(products_list).forEach((product_id) => {
      const product = products_list[product_id];

      ret.push(
        <div key={product_id} className="cart-popup__product">
          <div
            className="cart-popup__product-image"
            style={{
              backgroundImage: `url('${product.image}')`,
            }}
          />

          <div
            className="cart-popup__product-remove"
            onClick={this.removeProduct}
            product_id={product_id}
          />

          <div className="cart-popup__product-shadow" />

          <div
            className="cart-popup__product-big-button"
            onClick={this.removeProduct}
            product_id={product_id}
          >
            Remove
          </div>

          <div className="cart-popup__product-title">
            {product.name}
          </div>

          <div className="cart-popup__product-price">
            {product.price ? `$${product.price}` : 'Free!'}
          </div>
        </div>
      );
    });

    return (
      <div key="products" className="cart-popup__products">
        {ret}
      </div>
    );
  }

  makeCheckout() {
    const { products_amount, price_total } = this.props;

    let price = null;
    let button = null;
    let loader = null;

    if (price_total) {
      price = (
        <div className="cart-popup__price-total">
          <div className="cart-popup__price-total-amount">${price_total}</div>
          <div className="cart-popup__price-total-text">Total</div>
        </div>
      );
    } else {
      price = (
        <div className="cart-popup__price-free">
          Free
        </div>
      );
    }

    if (this.state.loading) {
      loader = <Loader />;
    } else if (this.state.show_payments_step || !price_total) {
      button = (
        <div className="cart-popup__button cart-popup__button--get" onClick={this.handleSubmit}>
          {price_total ? 'Confirm & Pay' : 'Get freebies'}
        </div>
      );
    } else {
      button = (
        <div className="cart-popup__button cart-popup__button--proceed" onClick={this.showPaymentsStep}>
          Proceed to checkout
        </div>
      );
    }

    return (
      <div key="checkout" className="cart-popup__checkout">
        {price}
        {loader}
        {button}
      </div>
    );
  }

  render() {
    let content = null;

    if (this.state.success) {
      content = this.makePlaceholder('Your order details have been sent to the email address you provided');
    } else if (!this.props.products_amount) {
      content = this.makePlaceholder('Your cart looks empty. Try to add something from our amazing products');
    } else if (this.props.price_total && !this.state.stripe_object) {
      content = this.makePlaceholder('Initializing payments...');
    } else {
      content = [
        this.makeProductsList(),
        <div key="spring" className="cart-popup__spring" />,
        <div key="bottom_separator" className="cart-popup__separator" />,
        this.makeCheckout(),
      ];
    }

    return (
      <div className="cart-popup">
        {this.makeCartTitle()}
        {content}
      </div>
    );

    // return (
    //   <div className="cart-popup__wrapper">
    //     <div className="cart-popup__checkout">
    //       <Form>
    //         <FormLabel>
    //           <FormTitle>Check Out With a Cart</FormTitle>
    //         </FormLabel>
    //         {this.makeError()}
    //         <FormLabel>
    //           <FormInput
    //             placeholder="Email"
    //             type="email"
    //             name="email"
    //             defaultValue={this.props.email}
    //             disabled={!!this.props.email || this.state.loading || this.state.password_required}
    //             setRef={this.setInputRef}
    //           />
    //         </FormLabel>
    //         {this.makePassword()}
    //         {this.makePaymentsForm()}
    //         <FormLabel>
    //           {this.makePrice()}
    //         </FormLabel>
    //         {this.makeSubmit()}
    //         {this.makeLoader()}
    //       </Form>
    //     </div>
    //     <div className="cart-popup__products">
    //       {this.makeProducts()}
    //       {this.makePrevButton()}
    //       {this.makeNextButton()}
    //     </div>
    //   </div>
    // );
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
      hideCart: () => { dispatch(hideCart()); },
    };
  }
)(Cart));
