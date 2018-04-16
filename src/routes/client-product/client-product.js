import React from 'react';
import PropTypes from 'prop-types';
import { setTitle } from 'actions/title';
import { connect } from 'react-redux';
import { loadProduct } from 'actions/product';
import { Loader, Alert } from 'components/ui';
import FORMATS_LIST from 'data/files';

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
    setTitle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
  }

  static defaultProps = {

  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    const { location, match } = this.props;

    fetchClientProduct(location, window.REDUX_STORE, match);
    this.updateTitle();

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

  componentWillReceiveProps(nextProps) {
    const { location, match } = nextProps;

    fetchClientProduct(location, window.REDUX_STORE, match);
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  getTitle() {
    const { data, error, loading } = this.props;

    if (loading) return 'Loading...';
    if (error) return 'Error';
    if (data.name) return data.name;

    return '';
  }

  updateTitle() {
    const title = this.getTitle();

    if (title === this.props.title) {
      return;
    }

    this.props.setTitle(title);
  }

  makeGallery() {
    const { data } = this.props;
    const ret = [];

    if (data.images) {
      data.images.forEach((image) => {
        ret.push(
          <div className="gallery-item" key={image}>
            <div
              className="gallery-photo"
              style={{ backgroundImage: `url('${image}')` }}
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
    const { error, loading, data } = this.props;

    if (error) {
      return <Alert type="danger">{error}</Alert>;
    }

    if (loading) {
      return <Loader />;
    }

    return (
      <div className="product">
        {this.makeGallery()}

        <div className="product-content">
          <div className="product-content-wrapper">
            <div className="product-description">
              <h1>{data.name}</h1>
              <p>{data.desc}</p>
            </div>
            
            <div className="product-navigation">
              <a className="button-add button-dark">
                Add to cart
                <span>{data.price ? `$${data.price}` : 'Free!'}</span>
              </a>
            </div>

            {this.makeFiles()}
          </div>
        </div>
      </div>
    );
  }
}

const WrapperClientProduct = connect(
  (state, props) => {
    const product = state.product;

    return {
      title: state.title,
      data: product.data,
      error: product.error,
      loading: product.loading,
    };
  },
  (dispatch) => {
    return {
      setTitle: (title) => { dispatch(setTitle(title)); },
    };
  }
)(RouteClientProduct);

export { WrapperClientProduct as RouteClientProduct, fetchClientProduct };
