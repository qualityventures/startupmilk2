import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './container.scss';

class Container extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    navigation: PropTypes.node,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    navigation: null,
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
            <ul className="menu-primary">{navigation}</ul>
          </nav>
        </div>
      </div>
    );
  }

  render() {
    const path = this.props.location.pathname;
    let Component = Link;

    if (path.indexOf('/admin') === 0) {
      Component = 'a';
    }

    return (
      <div className="main">
        <div className="header-global-top" />
        <header className="header-global">
          <div className="container">
            <div className="container-wrapper">
              <div className="row align-items-lg-center">
                <div className="col-10 col-lg-3 col-xl-2">
                  <Component className="logo" to="/" href="/">milkicons_</Component>
                </div>
                {this.makeNavigation()}
              </div>
            </div>
          </div>
        </header>

        <div className="header-global-bottom" />
        <div className="spanning">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="content">{this.props.children}</div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer-global">
          <div className="container">
            <div className="row">
              <div className="col-6 col-lg-3">
                <div className="footer-sub-navigation">
                  <nav>
                    <ul className="menu-tertiary">
                      <li><Component to="/faq" href="/faq">F.A.Q</Component></li>
                      <li><Component to="/license" href="/license">License</Component></li>
                      <li><Component to="/contact" href="/contact">Contact</Component></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="footer-content">
                  <p>Price is VAT exclusive. For customers in the EU, a VAT will be added unless a valid EU VAT code is provided.</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-lg-3 offset-lg-3">
                <div className="copyright">
                  <p>&copy; Copyright  Milk Icons — 2018</p>
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

export default withRouter(Container);
