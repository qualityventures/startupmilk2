import React from 'react';
import PropTypes from 'prop-types';
import { Form, Alert, FormInput, FormTitle, FormButton, FormLabel, Loader } from 'components/ui';
import { validateProductUrl, validateProductName, validateProductPrice, validateProductDesc } from 'helpers/validators';
import { withRouter } from 'react-router-dom';

class RouteAdminProductCreate extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      success: false,
      loading: false,
      error: false,
    };

    this.inputRefs = {};

    this.createProduct = this.createProduct.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  createProduct() {
    const fields = {
      desc: validateProductDesc,
      price: validateProductPrice,
      name: validateProductName,
      url: validateProductUrl,
    };
    const data = {};
    let success = true;

    this.setState({ loading: false, error: false });

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

    fetch('/api/products/', {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) {
          return Promise.reject(json.error);
        }

        if (response.status !== 200) {
          return Promise.reject('invalid server response');
        }

        return json;
      })
      .then((json) => {
        this.setState({ loading: false, success: true });
        this.props.history.push(`/admin/product/${json._id}`);
      })
      .catch((error) => {
        if (error && error.toString) {
          error = error.toString();
        }

        this.setState({ error: error || 'Bad response from server', loading: false });
      });
  }

  makeSuccess() {
    if (!this.state.success) {
      return null;
    }

    return <Alert>Product have successfully been created</Alert>;
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
        <FormButton onClick={this.createProduct}>Create</FormButton>
      </FormLabel>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      <Form>
        <FormTitle>New product</FormTitle>
        {this.makeSuccess()}
        {this.makeError()}

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.createProduct}
            name="url"
            placeholder="Product url"
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.createProduct}
            name="name"
            placeholder="Product name"
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            onSubmit={this.createProduct}
            name="price"
            placeholder="Product price"
            disabled={loading}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="desc"
            placeholder="Product desc"
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

export default withRouter(RouteAdminProductCreate);
