import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, FormInput, FormTitle, FormButton, FormLabel } from 'components/ui';
import { validatePassword, validateEmail } from 'helpers/validators';

class FormSignIn extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
    };

    this.inputRefs = {};

    this.signIn = this.signIn.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  signIn() {
    const ref_email = this.inputRefs.email || null;
    const ref_password = this.inputRefs.password || null;

    if (!ref_email || !ref_password) {
      return;
    }

    const email = ref_email.value;
    const password = ref_password.value;

    this.setState({ loading: false, error: false });

    const email_validation = validateEmail(email);
    const password_validation = validatePassword(password);

    if (email_validation !== true) {
      ref_email.focus();
      this.setState({ error: email_validation });
      return;
    }

    if (password_validation !== true) {
      ref_password.focus();
      this.setState({ error: password_validation });
      return;
    }

    this.setState({ loading: true });

    fetch('/api/auth/login', {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
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
    if (!this.props.logged_in) {
      return null;
    }

    return <Alert>You have successfully logged in</Alert>;
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

    return <Alert>Loader</Alert>;
  }

  makeButton() {
    if (this.state.loading || this.props.logged_in) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.signIn}>Sign In</FormButton>
      </FormLabel>
    );
  }

  render() {
    const disabled = this.state.loading || this.props.logged_in;

    return (
      <div>
        <FormTitle>Sign In</FormTitle>
        {this.makeSuccess()}
        {this.makeError()}

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="email"
            placeholder="Email"
            disabled={disabled}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="password"
            type="password"
            placeholder="Password"
            disabled={disabled}
          />
        </FormLabel>

        {this.makeLoader()}
        {this.makeButton()}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      logged_in: state.user.logged_in,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(FormSignIn);
