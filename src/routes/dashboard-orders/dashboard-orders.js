import React from 'react';
import TitleUpdater from 'containers/title-updater';
import apiFetch from 'helpers/api-fetch';
import { Alert, Loader, Heading } from 'components/ui';

class RouteDashboardOrders extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loaded: false,
      orders: [],
    };
  }

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders() {
    if (this.state.loading) {
      return;
    }

    this.setState({ error: false, loaded: false, loading: true });

    apiFetch('/api/orders/my')
      .then((orders) => {
        this.setState({ loaded: true, loading: false, orders });
      })
      .catch((e) => {
        this.setState({ loaded: false, loading: false, error: e });
      });
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return <Alert type="danger">{this.state.error}</Alert>;
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeOrders() {
    if (!this.state.loaded) {
      return null;
    }

    console.log(this.state.orders);
    return <div>ORDERS</div>;
  }

  render() {
    return (
      <div>
        <TitleUpdater title="My orders" />
        <Heading>My orders</Heading>
        {this.makeError()}
        {this.makeLoader()}
        {this.makeOrders()}
      </div>
    );
  }
}

export default RouteDashboardOrders;
