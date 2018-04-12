import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, FormInput, FormTitle, FormButton, FormLabel, Loader } from 'components/ui';
import { validateProductUrl, validateProductName } from 'helpers/validators';
import { userSignIn } from 'actions/user';
import { tokenSet } from 'actions/token';

class RouteAdminProductCreate extends React.PureComponent {
  static propTypes = {

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
    const ref_url = this.inputRefs.url || null;
    const ref_name = this.inputRefs.name || null;

    console.log('createProduct');

    if (!ref_url || !ref_name) {
      return;
    }

    const url = ref_url.value;
    const name = ref_name.value;

    this.setState({ loading: false, error: false });

    const url_validation = validateProductUrl(url);
    const name_validation = validateProductName(name);

    if (url_validation !== true) {
      ref_url.focus();
      this.setState({ error: url_validation });
      return;
    }

    if (name_validation !== true) {
      ref_name.focus();
      this.setState({ error: name_validation });
      return;
    }

    this.setState({ loading: true });

    fetch('/api/products/create', {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        name,
      }),
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
        this.setState({ loading: false });

        console.log(json);
      })
      .catch((error) => {
        if (error && error.toString) {
          error = error.toString();
        }

        this.setState({ error: error || 'Bad response from server', loading: false });
      });
  }

  makeSuccess() {
    if (!this.state.loading) {
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
      <div>
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

        {this.makeLoader()}
        {this.makeButton()}
      </div>
    );
  }
}

export default RouteAdminProductCreate;
