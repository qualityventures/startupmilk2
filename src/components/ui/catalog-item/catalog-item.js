import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FORMATS_LIST from 'data/files';
import './catalog-item.scss';

class Catalog extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    smallButtons: PropTypes.node,
    bigButton: PropTypes.node,
    onBigButtonClick: PropTypes.func,
    backgroundImage: PropTypes.string,
    price: PropTypes.number,
    name: PropTypes.string,
    files: PropTypes.array,
    onAddToCart: PropTypes.func,
    to: PropTypes.string,
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
    onAddToCart: null,
    to: null,
  }

  constructor(props) {
    super(props);

    this.onAddToCart = this.onAddToCart.bind(this);
  }

  onAddToCart() {
    const { onAddToCart, id } = this.props;

    if (onAddToCart) {
      onAddToCart(id || null);
    }
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
        <li>
          <span className="catalog-item-panel-meta-dot" style={style} />
          {file_type}
        </li>
      );
    });

    console.log(ret);

    // <div className="catalog-item-panel-meta">
    //   <ul>
    //     <li><span className="catalog-item-panel-meta-dot" style="background-color: #fad613;" />Sketch</li>
    //     <li><span className="catalog-item-panel-meta-dot" style="background-color: #325bb9;" />PSD</li>
    //     <li><span className="catalog-item-panel-meta-dot" style="background-color: #fa8513;" />AI</li>
    //   </ul>
    // </div>

    return <div className="catalog-item-panel-meta"><ul>{ret}</ul></div>;
  }

  makeAddToCart() {
    const { onAddToCart, price } = this.props;

    if (!onAddToCart) {
      return null;
    }

    return (
      <div className="catalog-item-panel-navigation">
        <a className="button-add" onClick={this.onAddToCart}>
          Add to cart <span>{price ? `$${price}` : 'Free'}</span>
        </a>
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

export default Catalog;
