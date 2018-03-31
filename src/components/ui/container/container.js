import React from 'react';
import PropTypes from 'prop-types';
import './container.scss';

class Container extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className="main">
        <div className="header-global-top"></div>
        <header className="header-global">
          <div className="container">
            <div className="container-wrapper">
              <div className="row align-items-lg-center">
                <div className="col-10 col-lg-3 col-xl-2">
                  <a className="logo" href="/">milkicons_</a>
                </div>
                <div className="col-2 col-lg-9 col-xl-8">
                  <a href="#" className="navigation-toggle"><span className="navigation-toggle-icon"></span></a>
                  <div className="navigation">
                    <nav />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="header-global-bottom"></div>
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
                      <li><a href="#">F.A.Q</a></li>
                      <li><a href="#">License</a></li>
                      <li><a href="#">Contact</a></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="footer-content">
                  <p>Price is VAT exclusive. For customers in the EU, a VAT will be added unless a valid EU VAT code is provided.</p>
                </div>
              </div>
              <div className="col-12 col-lg-6 d-none d-lg-block">
                <div className="footer-navigation">
                  <nav>
                    <ul className="menu-secondary">
                      <li><a href="#">Icons</a></li>
                      <li><a href="#">Startup Kits</a></li>
                      <li><a href="#">Illustration</a></li>
                      <li><a href="#">Motion</a></li>
                      <li><a href="#">Marketing</a></li>
                    </ul>
                  </nav>
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

export default Container;
