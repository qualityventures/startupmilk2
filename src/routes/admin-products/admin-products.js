import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert, FormTitle, FormButton, Catalog, CatalogItem } from 'components/ui';
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
      loading: true,
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

    let ret = data.products.map((product) => {
      const thumbStyle = {};

      if (product.images.length) {
        thumbStyle.backgroundImage = `url('${product.images[0]}')`;
      }

      return (
        <CatalogItem
          id={product._id}
          key={product._id}
          to={`/admin/product/${product._id}`}
          files={product.files}
          backgroundImage={product.images[0] || null}
          price={product.price}
          name={product.name}
        />
      );
    });

    if (!ret.length) {
      ret = <Alert>Nothing was found</Alert>;
    }

    return (
      <Catalog>
        {ret}
      </Catalog>
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
