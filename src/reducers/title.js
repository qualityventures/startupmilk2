import { SET_TITLE } from 'actions/title';

const initialState = '';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TITLE: {
      return action.title;
    }

    default: {
      return state;
    }
  }
}
