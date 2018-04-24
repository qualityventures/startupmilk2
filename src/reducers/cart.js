import {
  CART_SET_PRODUCTS,
} from 'actions/cart';

const initialState = {

};

export default function (state = initialState, action) {
  switch (action.type) {
    case CART_SET_PRODUCTS: {
      const newState = {};
      const products = action.products;

      Object.keys(products).forEach((product_id) => {
        newState[product_id] = { ...products[product_id] };
      });

      return newState;
    }

    default: {
      return state;
    }
  }
}
