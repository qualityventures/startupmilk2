import React from 'react';
import {
  FormTitle,
  FormButton,
  Content,
} from 'components/ui';
import './admin-export.scss';

class RouteAdminExport extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.handleDownloadCSVEmails = this.handleDownloadCSVEmails.bind(this);

    this.getUserEmails = this.getUserEmails.bind(this);
  }
  state = {
    emails: [],
    emailCount: 0,
    page: 0,
  }

  componentDidMount() {
    this.getUserEmails();
    this.getUserEmailCount();
  }
  getUserEmailCount() {
    fetch('/api/user/users-count').then((response) => {
      response.json().then((json) => {
        this.setState({ emailCount: json });
      });
    }).catch((e) => {
      this.setState({ emailCount: [] });
    });
  }
  getUserEmails(page) {
    fetch(`/api/user/users?page=${page || 0}`)
      .then((response) => {
        response.json().then((json) => {
          this.setState({ emails: json });
        });
      })
      .catch((e) => {
        this.setState({ emails: [] });
      });
  }

  handleDownloadCSVEmails() {
    window.open('/api/export/csv-emails', '_blank');
  }

  renderPagination() {
    const { emailCount, page } = this.state;
    const children = [];
    for (let i = 0; i <= emailCount / 20; i++) {
      children.push(
        <div
          className={`${page === i ? 'active' : ''} `}           
          onClick={() => {
            this.setState({
              page: i,
            });
            this.getUserEmails(i); 
          }}
        >
          {i + 1}
        </div>
      );
    }
    return <div className="pagination flex justify-center mt2">{children}</div>;
  }
  
  render() {
    const { emails } = this.state;
    console.log(emails);
    return (
      <Content className="admin-exports">
        <div className="top-bar flex items-center">
          <FormTitle>Export CSV</FormTitle>
          <FormButton className="ml-auto" onClick={this.handleDownloadCSVEmails}>
            Export
          </FormButton>
        </div>
        <div className="mt2">
          {emails.map((e) => {
            return (
              <div className="customer flex items-center">
                <div className="email col-3">{e.email}</div>
                <div className="flex labels col-9">
                  { e.have_paid
                    ? <div className="user-label paid">Paid User</div>
                    : <div className="user-label free">Free User</div>}
                  { e.subscribe ?
                    <div className="user-label sub">Newsletter Subscriber</div> : null}
                </div>
              </div>
            );
          })}
        </div>
        { this.renderPagination()}
      </Content>
    );
  }
}

export default RouteAdminExport;
