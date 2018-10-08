import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Alert, FormInput, FormTitle, FormSubtitle, FormButton, FormLabel, Loader } from 'components/ui';
import { validatePassword, validateEmail } from 'helpers/validators';
import { userSignIn } from 'actions/user';
import { tokenSet } from 'actions/token';
import './form-signup.scss';

class FormSignUp extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
    userSignIn: PropTypes.func.isRequired,
    tokenSet: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      password_recovered: false,
    };

    this.inputRefs = {};

    this.signUp = this.signUp.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  signUp() {
    const ref_email = this.inputRefs.email || null;
    const ref_password = this.inputRefs.password || null;
    const ref_confirm = this.inputRefs.confirm || null;

    if (!ref_email || !ref_password || !ref_confirm) {
      return;
    }

    const email = ref_email.value;
    const password = ref_password.value;
    const confirm = ref_confirm.value;

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

    if (password !== confirm) {
      this.setState({ error: 'Passwords does not match the confirm password.' });
      return;
    }

    this.setState({ loading: true });

    fetch('/api/auth/register', {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        confirm,
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

        this.props.tokenSet(json.token);
        this.props.userSignIn(json.data);
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

    return <Loader />;
  }

  makeButton() {
    if (this.state.loading || this.props.logged_in) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.signUp}>
          <img className="mr1" src="/assets/signin.svg" />
          Sign Up
        </FormButton>
      </FormLabel>
    );
  }
  render() {
    const disabled = this.state.loading || this.props.logged_in;

    return (
      <Form>
        <FormTitle>Sign Up</FormTitle>
        <FormSubtitle>If you’re a new customer</FormSubtitle>
        {this.makeSuccess()}
        {this.makeError()}

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="email"
            placeholder="Your email"
            disabled={disabled}
            onSubmit={this.signUp}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="password"
            type="password"
            placeholder="Password"
            disabled={disabled}
            onSubmit={this.signUp}
          />
        </FormLabel>

        <FormLabel>
          <FormInput
            setRef={this.setInputRef}
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            disabled={disabled}
            onSubmit={this.signUp}
          />
        </FormLabel>
        <div className="flex items-center mt3">
          {this.makeButton()}
          {this.makeLoader()}
        </div>
      </Form>
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
      userSignIn: (user) => { dispatch(userSignIn(user)); },
      tokenSet: (token) => { dispatch(tokenSet(token)); },
    };
  }
)(FormSignUp);
