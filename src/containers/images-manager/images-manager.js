import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert } from 'components/ui';
import './images-manager.scss';

class ImagesManager extends React.PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    images: PropTypes.array,
  }

  static defaultProps = {
    images: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      images: props.images,
    };

    this.ref_input = false;

    this.setRefInput = this.setRefInput.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images !== this.props.images) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ images: this.props.images });
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

    fetch(`/api/products/${this.props.productId}/images/`, {
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
      .then((images) => {
        this.setState({ loading: false, images: [...images] });
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

  makeImages() {
    return this.state.images.map((image) => {
      return (
        <div className="catalog-item" key={image}>
          <div className="catalog-item-wrapper">
            <div className="catalog-item-overflow">
              <div className="catalog-item-thumb" style={{ backgroundImage: `url('${image}')` }}>
                <div className="images-manager__big-button">
                  Buttons
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
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
        <input 
          type="file"
          className="images-manager__input"
          encType="multipart/form-data"
          ref={this.setRefInput}
          onChange={this.onUpload}
        />

        {this.makeError()}
        {this.makeImages()}

        <div className="catalog-item">
          <div className="catalog-item-wrapper">
            <div className="catalog-item-overflow">
              <div className="catalog-item-thumb">
                <div className="images-manager__big-button" onClick={this.toggleUpload}>
                  {this.state.loading ? <Loader /> : <span>+</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImagesManager;
