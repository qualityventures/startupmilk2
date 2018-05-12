import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel } from 'components/ui';
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from 'react-stripe-elements';

const STRIPE_STYLE = {
  base: {
    fontSize: '14px',
    fontFamily: 'SuisseBPIntl',
  },
};

class PaymentsForm extends React.PureComponent {
  static propTypes = {
    setStripeCreateToken: PropTypes.func.isRequired,
    stripe: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  componentDidMount() {
    this.props.setStripeCreateToken(this.props.stripe.createToken);
  }

  componentWillUnmount() {
    this.props.setStripeCreateToken(null);
  }

  render() {
    return (
      <div>
        <FormLabel>
          <div className="cart-popup__stripe_input">
            <CardNumberElement style={STRIPE_STYLE} />
          </div>
        </FormLabel>
        <FormLabel>
          <div className="cart-popup__exp">
            <div className="cart-popup__stripe_input">
              <CardExpiryElement style={STRIPE_STYLE} />
            </div>
          </div>
          <div className="cart-popup__cvc">
            <div className="cart-popup__stripe_input">
              <CardCVCElement style={STRIPE_STYLE} />
            </div>
          </div>
        </FormLabel>
      </div>
    );
  }
}

export default injectStripe(PaymentsForm);
