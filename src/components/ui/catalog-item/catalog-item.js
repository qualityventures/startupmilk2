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
    price: null,
    name: null,
    files: null,
    to: null,
    showAddToCart: false,
  }

  getThumbBackground() {
    const { backgroundImage } = this.props;
    const style = {};

    if (backgroundImage) {
      style.backgroundImage = `url('${backgroundImage}')`;
    }

    return style;
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

  render() {
    return (
      <div className="catalog-item">
        <div className="catalog-item-wrapper">
          <div className="catalog-item-overflow">
            <div className="catalog-item-thumb" style={this.getThumbBackground()}>
              {this.makeThumbContent()}
            </div>

            {this.makeDescription()}
            {this.makeMeta()}
          </div>
        </div>
      </div>
    );
  }
}

export default CatalogItem;
