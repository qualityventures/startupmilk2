import React from 'react';
import PropTypes from 'prop-types';
import { Form, Alert, FormInput, FormTitle, FormButton, FormLabel, Loader } from 'components/ui';
import { validateProductUrl, validateProductName, validateProductPrice, validateProductDesc } from 'helpers/validators';

class RouteAdminProductEdit extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      success: false,
      loading: false,
      loaded: false,
      data: {},
      error: false,
    };

    this.inputRefs = {};

    this.updateProduct = this.updateProduct.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentDidMount() {
    this.loadProductInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadProductInfo();
    }
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  loadProductInfo() {
    const id = this.props.match.params.id;

    this.setState({
      loading: false,
      loaded: false,
      error: false,
      success: false,
    });

    if (!id) {
      this.setState({ error: 'Invalid product id' });
      return;
    }

    fetch(`/api/products/${id}`, {
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

  updateProduct() {
    const id = this.props.match.params.id;
    const data = {};
    let success = true;
    const fields = {
      desc: validateProductDesc,
      price: validateProductPrice,
      name: validateProductName,
      url: validateProductUrl,
    };

    this.setState({ loading: false, error: false, success: false });

    Object.keys(fields).forEach((field) => {
      const ref = this.inputRefs[field];

      if (!ref) {
        this.setState({ error: 'Something went wrong' });
        success = false;
        return;
      }

      const value = ref.value;
      const validation = fields[field](value);

      if (validation !== true) {
        ref.focus();
        this.setState({ error: validation });
        success = false;
        return;
      }

      data[field] = value;
    });

    if (!success) {
      return;
    }

    this.setState({ loading: true });

    fetch(`/api/products/${id}`, {
      credentials: 'include',
      mode: 'cors',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((product) => {
        const newData = { ...this.state.data };

        newData.url = product.url;
        newData.name = product.name;
        newData.price = product.price;
        newData.desc = product.desc;

        this.setState({ loading: false, success: true, data: newData });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  makeSuccess() {
    if (!this.state.success) {
      return null;
    }

    return <Alert>Product have successfully been updated</Alert>;
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <Alert type="danger">{error}</Alert>;
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeButton() {
    if (this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.updateProduct}>Update</FormButton>
      </FormLabel>
    );
  }

  render() {
    const { loading, loaded, error, data } = this.state;

    if (!loaded) {
      if (error) {
        return (
          <Form>
            <FormTitle>Edit product</FormTitle>
            <Alert type="danger">{error}</Alert>
          </Form>
        );
      }

      return (
        <Form>
          <FormTitle>Edit product</FormTitle>
          <Loader />
        </Form>
      );
    }

    return (
      <Form>
        <FormTitle>Edit: {data.name}</FormTitle>
        {this.makeSuccess()}
        {this.makeError()}

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.updateProduct}
            name="url"
            placeholder="Product url"
            defaultValue={data.url}
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.updateProduct}
            name="name"
            placeholder="Product name"
            defaultValue={data.name}
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.updateProduct}
            name="price"
            placeholder="Product price"
            defaultValue={data.price}
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="desc"
            placeholder="Product desc"
            defaultValue={data.desc}
            disabled={loading}
            multiline
          />
        </FormLabel>

        {this.makeLoader()}
        {this.makeButton()}
      </Form>
    );
  }
}

export default RouteAdminProductEdit;
