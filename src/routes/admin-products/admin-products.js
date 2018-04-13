import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert, FormTitle, FormButton } from 'components/ui';
import { Link } from 'react-router-dom';

class RouteAdminProducts extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loaded: false,
      data: false,
      error: false,
    };
  }

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts() {
    this.setState({
      loading: false,
      loaded: false,
      error: false,
    });

    fetch('/api/products/', {
      credentials: 'include',
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((data) => {
        this.setState({ loading: false, loaded: true, data });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <Alert type="danger">{error}</Alert>;
  }

  makeProducts() {
    const { data } = this.state;

    if (data === false) {
      return null;
    }

    if (!data.length) {
      return <Alert>Nothing was found</Alert>;
    }

    const ret = data.map((product) => {
      return (
        <div className="catalog-item" key={product._id}>
          <div className="catalog-item-wrapper">
            <div className="catalog-item-overflow">
              <div className="catalog-item-thumb">
                <Link to={`/admin/product/${product._id}`} />
              </div>
              <div className="catalog-item-description">
                <div className="catalog-item-description-name">{product.name}</div>
                <div className="catalog-item-description-price"><span>{product.price ? `$${product.price}` : 'Free!'}</span></div>
              </div>
              <div className="catalog-item-panel">
                <div className="catalog-item-panel-meta">
                  <ul />
                </div>
                <div className="catalog-item-panel-navigation">
                  <Link to={`/admin/product/${product._id}`}>Edit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="catalog">
        <div className="catalog-infoblock">
          <div className="catalog-total">
            <div className="catalog-total-count">{data.length}</div>
            <div className="count-total-category">All</div>
          </div>
        </div>

        <div className="catalog-list">
          {ret}
        </div>
      </div>
    );
  }

  render() {
    // const category = 'all';
    // console.log(this.props.location.search);

    return (
      <div>
        <FormTitle>Products list</FormTitle>
        <div><FormButton to="/admin/product/create">Add new product</FormButton></div>
        <br />
        {this.makeLoader()}
        {this.makeError()}
        {this.makeProducts()}
      </div>
    );
  }
}

export default RouteAdminProducts;
