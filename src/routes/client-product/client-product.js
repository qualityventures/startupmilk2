import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProduct } from 'actions/product';
import { Loader, Alert } from 'components/ui';
import TitleUpdater from 'containers/title-updater';
import FORMATS_LIST from 'data/files';
import CartButton from 'containers/cart-button';

function fetchClientProduct(location, store, match) {
  const state = store.getState().product;
  const url = match.params.url;

  if (state.loading || url === state.url) {
    return [];
  }

  return [store.dispatch(loadProduct(url))];
}

class RouteClientProduct extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
  }

  static defaultProps = {

  }

  componentDidMount() {
    const { location, match } = this.props;

    fetchClientProduct(location, window.REDUX_STORE, match);

    if (this.props.loaded) {
      this.initSlider();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, match } = nextProps;

    fetchClientProduct(location, window.REDUX_STORE, match);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loaded && this.props.loaded) {
      this.initSlider();
    }
  }

  getTitle() {
    const { data, error, loading } = this.props;

    if (loading) return 'Loading...';
    if (error) return 'Error';
    if (data.name) return data.name;

    return '';
  }

  initSlider() {
    /* global $ */
    // slider
    $('.gallery-list').slick({
      dots: true,
      arrows: true,
      draggable: true,
      infinite: false,
      centerMode: false,
      centerPadding: '0px',
      autoplay: false,
      autoplaySpeed: 5000,
      speed: 500,
      pauseOnHover: false,
      pauseOnDotsHover: false,
      slide: '.gallery-item',
      slidesToShow: 1,
      slidesToScroll: 1,
    });
  }

  makeGallery() {
    const { data } = this.props;
    const ret = [];

    if (data.images) {
      data.images.forEach((image) => {
        ret.push(
          <div className="gallery-item" key={image.full}>
            <div
              className="gallery-photo"
              style={{ backgroundImage: `url('${image.full}')` }}
            />
          </div>
        );
      });
    }

    return (
      <div className="product-gallery">
        <div className="gallery-wrapper">
          <div className="gallery-list">
            {ret}
          </div>
        </div>
      </div>
    );
  }

  makeFiles() {
    const ret = [];
    const { data } = this.props;

    if (data.files) {
      data.files.forEach((file_type) => {
        const style = {};

        if (FORMATS_LIST[file_type]) {
          style.backgroundColor = FORMATS_LIST[file_type].color;
        }

        ret.push(
          <li key={file_type}>
            <span className="catalog-item-panel-meta-dot" style={style} />
            {file_type}
          </li>
        );
      });
    }

    return (
      <div className="product-meta">
        <ul>
          {ret}
        </ul>
      </div>
    );
  }

  render() {
    const { error, loading, loaded, data } = this.props;
    let content = null;

    if (error) {
      content = <Alert type="danger">{error}</Alert>;
    } else if (loading || !loaded) {
      content = <Loader />;
    } else {
      content = (
        <div className="product">
          {this.makeGallery()}

          <div className="product-content">
            <div className="product-content-wrapper">
              <div className="product-description">
                <h1>{data.name}</h1>
                <div dangerouslySetInnerHTML={{ __html: data.desc }} />
              </div>
              
              <div className="product-navigation">
                <CartButton
                  productId={data.id}
                  price={data.price}
                  color="black"
                />
              </div>

              {this.makeFiles()}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <TitleUpdater title={this.getTitle()} />
        {content}
      </div>
    );
  }
}

const WrapperClientProduct = connect(
  (state, props) => {
    const product = state.product;

    return {
      data: product.data,
      error: product.error,
      loading: product.loading,
      loaded: product.loaded,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(RouteClientProduct);

export { WrapperClientProduct as RouteClientProduct, fetchClientProduct };
