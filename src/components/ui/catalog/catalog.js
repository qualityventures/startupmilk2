import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import apiFetch from 'helpers/api-fetch';
import './catalog.scss';

class Catalog extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    total: PropTypes.number,
    sortValue: PropTypes.string,
    sortLink: PropTypes.string,
  }

  static defaultProps = {
    total: null,
    sortLink: null,
    sortValue: null,
  }
  componentDidMount() {
    // drop
    /* global $ */
    let activePop = null;
    const dropClass = $('.drop');

    if (dropClass) {
      dropClass.mouseover(function () {
        activePop = dropClass.index(this);
      });

      dropClass.mouseout(() => {
        activePop = null;
      });

      $(document.body).click(() => {
        const activeDrops = document.getElementsByClassName('drop active');
        for (let i = 0; i < activeDrops.length; i++) {
          if (i !== activePop) {
            activeDrops[i].classList.remove('active');
          }
        }
      });

      $('.drop-toggle').on('click', function (event) {
        event.preventDefault();
        $(this).parent(dropClass).toggleClass('active');
      });
    }
  }

  makeTotal() {
    const { total } = this.props;

    if (total === null) {
      return null;
    }

    return (
      <div className="catalog-total">
        <div className="catalog-total-count">{total || 'Nothing was found'}</div>
        <div className="count-total-category">Premium recources</div>
      </div>
    );
  }

  makeOrderBy() {
    const { sortValue, sortLink } = this.props;

    if (!sortLink) {
      return null;
    }

    let selected = null;
    const ret = [];
    const list = [
      { value: '-created', title: 'Latest first' },
      { value: 'price', title: 'By Price' },
    ];

    list.forEach((option) => {
      if (option.value === sortValue) {
        selected = option.title;
      }

      ret.push(
        <li key={option.value}>
          <Link to={sortLink.replace('%sort%', option.value)}>
            {option.title}
          </Link>
        </li>
      );
    });

    return (
      <div className="catalog-sort">
        <div className="drop">
          <a className="catalog-sort-toggle drop-toggle">
            {selected || list[0].title}
          </a>
          <div className="drop-block">
            <ul className="drop-block-list">
              {ret}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  makeInfoblock() {
    const total = this.makeTotal();
    const sort = this.makeOrderBy();

    if (!total && !sort) {
      return null;
    }

    return (
      <div className="catalog-infoblock">
        {total}
        {sort}
      </div>
    );
  }
  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    apiFetch('api/orders/subscribe', {
      method: 'POST',
      payload: {
        email: formData.get('email'),
      },
    }).then((response) => {
      this.hideNewsletterSignUp();
    }).catch((error) => {
      this.setState({ loading: false, error: error || 'Something went wrong' });
    });
  }

  renderNewsletterSignup() {
    return (
      <div className="col col-12 newsletter-signup flex items-center flex-wrap">
        <div
          className="col col-3 sm-col-5 md-col-4 lg-col-3 image-container"
          style={{ backgroundImage: 'url("/static/images/at_image2.png")' }}
        />
        <form
          className="col sm-col-7 md-col-8 col-12 flex flex-wrap items-center pl3"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
        >
          <h2 className="pr3">{"Let's be friends. Get a freebie a month, delivered to your inbox"}
          </h2>
          <div className="email-field">
            <input
              className="email-input"
              type="email"
              placeholder="Your Email"
            />
            <input
              type="submit"
              className="submit-button"
              value="Search"
            />
          </div>
        </form>
        
      </div>
    );
  }

  render() {
    return (
      <div className="catalog">
        {this.makeInfoblock()}

        <div className="catalog-list">
          {this.props.children.slice(0, 4)}
          {this.renderNewsletterSignup()}
          {this.props.children.length > 4 && this.props.children.slice(4)}
        </div>
      </div>
    );
  }
}

export default Catalog;
