import React from 'react';
import TitleUpdater from 'containers/title-updater';
import { Content } from 'components/ui';

class RouteClientContact extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  render() {
    return (
      <Content>
        <TitleUpdater title="Contacts" />

        RouteClientContact
      </Content>
    );
  }
}

export default RouteClientContact;
