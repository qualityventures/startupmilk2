import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert, Catalog, CatalogItem } from 'components/ui';
import './files-manager.scss';

class FilesManager extends React.PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    files: PropTypes.array,
  }

  static defaultProps = {
    files: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      files: props.files,
    };

    this.ref_input = false;

    this.setRefInput = this.setRefInput.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.files !== this.props.files) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ files: this.props.files });
    }
  }

  componentWillUnmount() {
    this.ref_input = false;
  }

  onUpload(e) {
    e.preventDefault();

    const files = e.target.files || false;

    if (this.state.loading) return;
    if (!files || !files.length) return;

    this.addUpload(files[0]);
  }

  setRefInput(c) {
    this.ref_input = c;
  }

  addUpload(file) {
    const formData = new FormData();

    formData.append('upload', file);
    formData.append('productId', this.props.productId);

    this.setState({ loading: true, error: false });

    fetch(`/api/products/${this.props.productId}/files/`, {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((files) => {
        this.setState({ loading: false, files: [...files] });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  toggleUpload() {
    if (this.state.loading) {
      return;
    }

    if (this.ref_input) {
      this.ref_input.click();
    }
  }

  deleteFile(e) {
    if (this.state.loading) {
      return;
    }

    const image = e.target.getAttribute('image');

    this.setState({ loading: true, error: false });

    fetch(`/api/products/${this.props.productId}/files/delete`, {
      credentials: 'include',
      mode: 'cors',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((files) => {
        this.setState({ loading: false, files: [...files] });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  makeFiles() {
    console.log(this.state.files);
    
    return null;
    // return this.state.files.map((image, index) => {
    //   const button = (
    //     <span key="delete" image={image} onClick={this.deleteFile} className="files-manager__small-button">
    //       x
    //     </span>
    //   );

    //   return (
    //     <CatalogItem
    //       key={image}
    //       backgroundFile={image}
    //       smallButtons={buttons}
    //     />
    //   );
    // });
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <div><Alert type="danger">{error}</Alert></div>;
  }

  render() {
    return (
      <div>
        {this.makeError()}
        <input 
          type="file"
          className="files-manager__input"
          encType="multipart/form-data"
          ref={this.setRefInput}
          onChange={this.onUpload}
        />
        <Catalog>
          {this.makeFiles()}

          <CatalogItem
            bigButton={this.state.loading ? <Loader /> : <span>+</span>}
            onBigButtonClick={this.toggleUpload}
          />
        </Catalog>
      </div>
    );
  }
}

export default FilesManager;
