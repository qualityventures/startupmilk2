import React from 'react';
import {
  FormTitle,
  FormButton,
  Content,
} from 'components/ui';

class RouteAdminExport extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.handleDownloadCSVEmails = this.handleDownloadCSVEmails.bind(this);
  }

  handleDownloadCSVEmails() {
    window.open('/api/export/csv-emails', '_blank');
  }
  
  render() {
    return (
      <Content>
        <FormTitle>Export</FormTitle>
        <FormButton onClick={this.handleDownloadCSVEmails}>Download CSV emails</FormButton>
      </Content>
    );
  }
}

export default RouteAdminExport;
