import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { userSignOut } from 'actions/user';
import { tokenClean } from 'actions/token';
import { truncate } from 'voca';
import './container.scss';

class Container extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    navigation: PropTypes.node,
    cart: PropTypes.node,
    toggleCart: PropTypes.func,
    cartItems: PropTypes.number,
    showCart: PropTypes.bool,
    location: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    userSignOut: PropTypes.func.isRequired,
    tokenClean: PropTypes.func.isRequired,
  }

  static defaultProps = {
    navigation: null,
    cart: null,
    toggleCart: null,
    cartItems: null,
    showCart: false,
  }

  state = {
    profileOpen: false,
  }

  makeCart() {
    const { cartItems, toggleCart, showCart, cart } = this.props;

    if (!toggleCart || !cart) {
      return null;
    }

    let className = 'cart_button';

    if (showCart) {
      className += ' cart_button--visible';
    }

    if (!showCart && !cartItems) {
      className += ' cart_button--empty';
    }

    return [
      <a key="cart_button" onClick={toggleCart} className={className}>
        CART
        <span>{cartItems || '-'}</span>
      </a>,
      <div
        key="shadow"
        className={`cart_shadow cart_shadow--${showCart ? 'visible' : 'hidden'}`}
      />,
      <div key="cart_container" className={`cart_container cart_container--${showCart ? 'visible' : 'hidden'}`}>
        {cart}
      </div>,
    ];
  }

  makeNavigation() {
    const { navigation } = this.props;

    if (!navigation) {
      return null;
    }

    return (
      <div className="col-2 col-lg-9 col-xl-8">
        <a className="navigation-toggle"><span className="navigation-toggle-icon" /></a>
        <div className="navigation">
          <nav>
            <ul className="menu-primary">
              {navigation}
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  render() {
    const { user } = this.props;
    const path = this.props.location.pathname;
    let Component = Link;
    let logo_link = '/';

    if (path.indexOf('/admin') === 0) {
      Component = 'a';
      logo_link = '/admin/';
    }
    return (
      <div className="main">
        <div className="header-global-top" />
        <header className="header-global">
          <div className="container">
            <div className="container-wrapper">
              <div className="row align-items-lg-center">
                <div className="col-10 col-lg-3 col-xl-2">
                  <Link className="logo" to={logo_link}>matte.design</Link>
                </div>
                {this.makeNavigation()}
                <div
                  className="profile-button"
                  onClick={
                    () => {
                      this.setState({
                        profileOpen: !this.state.profileOpen,
                      });
                    }
                  }
                >
                  <img
                    src={'/static/images/profile.png'}
                  />
                  { this.state.profileOpen &&
                    <div className="profile-root">
                      {user.logged_in ?
                        <div>
                          <div className="flex p1 pl2 items-center profile-container">
                            <img
                              className="profile"
                              src={'/static/images/profile_black.png'}
                            />
                            <div className="ml2">{truncate(user.data.email, 14)}</div>
                          </div>
                          <Link to={'/dashboard'} href={'/dashboard'}> 
                            <div className="p2">
                              My Purchases
                            </div>
                          </Link>
                          <div
                            className="p2"
                            onClick={() => {
                              this.props.userSignOut();
                              this.props.tokenClean();
                            }}
                          >
                            Sign Out
                          </div>
                        </div>
                        : <div>
                          <div className="flex p1 pl2 items-center profile-container">
                            <img
                              className="profile"
                              src={'/static/images/profile_white.png'}
                            />
                            <div className="ml2">Guest</div>
                          </div>
                          <Link to={'/login'} href={'/login'}> 
                            <div className="p2">
                              Sign In / Sign Up
                            </div>
                          </Link>
                        </div>
                      }
                    </div>
                  }
                </div>
                
                {this.makeCart()}
              </div>
            </div>
          </div>
        </header>

        <div className="header-global-bottom" />
        <div className="spanning">
          {this.props.children}
        </div>

        <footer className="footer-global">
          <div className="container">
            <div className="row">
              <div className="col-6 col-lg-3">
                <div className="footer-sub-navigation">
                  <nav>
                    <ul className="menu-tertiary">
                      <li><Component to="/license" href="/license">License</Component></li>
                      <li><Component to="/contact" href="/contact">Contact</Component></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="footer-content" />
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-lg-3 offset-lg-3">
                <div className="copyright">
                  <p>&copy; Copyright matte.design — 2018</p>
                </div>
              </div>
              <div className="col-6 col-lg-6">
                <div className="scroll-top-block">
                  <a className="scroll-top scroll-link" href="#top">Go to Top</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default withRouter(connect(
  null, (dispatch) => {
    return {
      userSignOut: () => { dispatch(userSignOut()); },
      tokenClean: () => { dispatch(tokenClean()); },
    };
  }
)(Container));
