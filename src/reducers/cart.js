import {
  CART_SET_PRODUCTS,
} from 'actions/cart';

const initialState = {

};

export default function (state = initialState, action) {
  switch (action.type) {
    case CART_SET_PRODUCTS: {
      const newState = {};

      action.products.forEach((product) => {
        newState[product.id] = { ...product };
      });

      return newState;
    }

    default: {
      return state;
    }
  }
}
