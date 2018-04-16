import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert, FormTitle, Form, FormButton, Catalog, CatalogItem, Paginator } from 'components/ui';
import areEqual from 'helpers/are-equal';
import { makeArgs, getArgs } from 'helpers/args';
import './admin-products.scss';

const DEFAULT_SEARCH = {
  page: 1,
  category: 'all',
  status: 'all',
  search: '',
  sort: '-created',
};

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
      data: {},
      error: false,
      search: false,
    };
  }

  componentDidMount() {
    this.loadProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.loadProducts();
    }
  }

  loadProducts() {
    const args = getArgs(this.props.location.search);
    const search = {
      page: parseInt(args.page || 1, 10) || DEFAULT_SEARCH.page,
      category: args.category || DEFAULT_SEARCH.category,
      status: args.status || DEFAULT_SEARCH.status,
      search: args.search || DEFAULT_SEARCH.search,
      sort: args.sort || DEFAULT_SEARCH.sort,
    };

    if (areEqual(search, this.state.search)) {
      return;
    }

    window.scrollTo(0, 0);

    this.setState({
      loading: true,
      loaded: false,
      error: false,
      search: { ...search },
      data: {},
    });

    fetch(`/api/products/?${makeArgs(search)}`, {
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
    const { data, search } = this.state;

    if (!data.products || !search) {
      return null;
    }

    let ret = data.products.map((product) => {
      return (
        <CatalogItem
          id={product.id}
          key={product.id}
          to={`/admin/product/${product.id}`}
          files={product.files}
          backgroundImage={product.image}
          price={product.price}
          name={product.name}
        />
      );
    });

    if (!ret.length) {
      ret = <Alert>Nothing was found</Alert>;
    }

    return (
      <Catalog
        total={data.total}
        sortValue={search.sort}
        sortLink={`/admin/products/?${makeArgs({ ...search, page: 1, sort: { value: '%sort%', escape: false } })}`}
      >
        {ret}
      </Catalog>
    );
  }

  makePaginator() {
    const { data, loading, search } = this.state;

    if (loading || !search) {
      return null;
    }

    const { page, pages } = data;

    return (
      <Paginator
        page={page || 1}
        pages={pages || 1}
        to={`/admin/products/?${makeArgs({ ...search, page: { value: '%page%', escape: false } })}`}
      />
    );
  }

  render() {
    // const category = 'all';
    // console.log(this.props.location.search);

    return (
      <div>
        <FormTitle>
          Products list
          <div className="admin-products__create">
            <FormButton to="/admin/product/create">Add new product</FormButton>
          </div>
        </FormTitle>
        
        <Form>
          SEARCH AND CATEGORIES
        </Form>

        <br />
        {this.makeError()}
        {this.makeProducts()}
        {this.makeLoader()}
        {this.makePaginator()}
      </div>
    );
  }
}

export default RouteAdminProducts;
