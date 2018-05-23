import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FORMATS_LIST from 'data/files';
import CartButton from 'containers/cart-button';
import './catalog-item.scss';

class CatalogItem extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    smallButtons: PropTypes.node,
    bigButton: PropTypes.node,
    onBigButtonClick: PropTypes.func,
    backgroundImage: PropTypes.string,
    hoverAnimation: PropTypes.string,
    price: PropTypes.number,
    name: PropTypes.string,
    files: PropTypes.array,
    to: PropTypes.string,
    showAddToCart: PropTypes.bool,
  }

  static defaultProps = {
    id: null,
    smallButtons: null,
    bigButton: null,
    onBigButtonClick: null,
    backgroundImage: null,
    hoverAnimation: null,
    price: null,
    name: null,
    files: null,
    to: null,
    showAddToCart: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      animation: false,
    };

    this.setThumbRef = this.setThumbRef.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.terminateAnimation = this.terminateAnimation.bind(this);

    this.stop_timeout = false;
    this.ref_thumb = false;
  }

  componentWillUnmount() {
    this.ref_thumb = false;

    if (this.stop_timeout) {
      clearTimeout(this.stop_timeout);
      this.stop_timeout = false;
    }
  }

  setThumbRef(c) {
    this.ref_thumb = c;
  }

  getThumbBackground() {
    const { backgroundImage, hoverAnimation } = this.props;
    const style = {};

    if (hoverAnimation && this.state.animation) {
      style.backgroundImage = `url('${hoverAnimation}')`;
    } else if (backgroundImage) {
      style.backgroundImage = `url('${backgroundImage}')`;
    }

    return style;
  }

  startAnimation() {
    if (this.stop_timeout) {
      clearTimeout(this.stop_timeout);
      this.stop_timeout = false;
    }

    if (!this.props.hoverAnimation || this.state.animation) {
      return;
    }

    this.setState({ animation: true });
  }

  stopAnimation() {
    if (this.stop_timeout) {
      clearTimeout(this.stop_timeout);
    }

    this.stop_timeout = setTimeout(this.terminateAnimation, 200);
  }

  terminateAnimation() {
    if (!this.state.animation) {
      return;
    }

    this.setState({ animation: false });
  }

  makeThumbContent() {
    const { to, bigButton, onBigButtonClick, smallButtons } = this.props;
    const ret = [];

    if (bigButton) {
      ret.push(
        <div key="big" className="catalog-item__big-button" onClick={onBigButtonClick}>
          {bigButton}
        </div>
      );
    }

    if (smallButtons) {
      ret.push(
        <div key="small" className="catalog-item__small-buttons">
          {smallButtons}
        </div>
      );
    }

    if (to) {
      ret.push(<Link key="link" to={to} />);
    }

    return ret;
  }

  makeDescription() {
    const { name, price } = this.props;
    const ret = [];

    if (name) {
      ret.push(
        <div key="name" className="catalog-item-description-name">
          {name}
        </div>
      );
    }

    if (price !== null) {
      ret.push(
        <div key="price" className="catalog-item-description-price">
          <span>{price ? `$${price}` : 'Free!'}</span>
        </div>
      );
    }

    if (!ret.length) {
      return null;
    }

    return <div className="catalog-item-description">{ret}</div>;
  }

  makeMeta() {
    const files = this.makeFiles();
    const cart = this.makeAddToCart();

    if (!files && !cart) {
      return null;
    }

    return (
      <div className="catalog-item-panel">
        {files}
        {cart}
      </div>
    );
  }

  makeFiles() {
    const { files } = this.props;

    if (!files || !files.length) {
      return null;
    }

    const ret = files.map((file_type) => {
      const style = {};

      if (FORMATS_LIST[file_type]) {
        style.backgroundColor = FORMATS_LIST[file_type].color;
      }

      return (
        <li key={file_type}>
          <span className="catalog-item-panel-meta-dot" style={style} />
          {file_type}
        </li>
      );
    });

    return <div className="catalog-item-panel-meta"><ul>{ret}</ul></div>;
  }

  makeAddToCart() {
    const { id, showAddToCart, price } = this.props;

    if (!id || !showAddToCart) {
      return null;
    }

    return (
      <div className="catalog-item-panel-navigation">
        <CartButton
          productId={id}
          price={price}
          color="white"
        />
      </div>
    );
  }

  makeAnimationPreload() {
    const { hoverAnimation } = this.props;

    if (!hoverAnimation) {
      return null;
    }

    return (
      <img
        src={hoverAnimation}
        className="catalog-item__animation-loader"
      />
    );
  }

  render() {
    return (
      <div className="catalog-item" onMouseOver={this.startAnimation} onMouseOut={this.stopAnimation}>
        <div className="catalog-item-wrapper">
          <div className="catalog-item-overflow">
            <div
              className="catalog-item-thumb"
              style={this.getThumbBackground()}
              ref={this.setThumbRef}
            >
              {this.makeThumbContent()}
            </div>

            {this.makeDescription()}
            {this.makeMeta()}
            {this.makeAnimationPreload()}
          </div>
        </div>
      </div>
    );
  }
}

export default CatalogItem;
