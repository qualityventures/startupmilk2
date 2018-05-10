import React from 'react';
import TitleUpdater from 'containers/title-updater';

class RouteDashboardOrders extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  render() {
    return (
      <div>
        <TitleUpdater title="My orders" />

        RouteDashboardOrders
      </div>
    );
  }
}

export default RouteDashboardOrders;
