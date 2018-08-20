import React from 'react';
import {
  FormTitle,
  FormButton,
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
      <div>
        <FormTitle>
          Export
        </FormTitle>
        <FormButton onClick={this.handleDownloadCSVEmails}>Download CSV emails</FormButton>
      </div>
    );
  }
}

export default RouteAdminExport;
