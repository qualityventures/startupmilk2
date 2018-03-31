const initialState = {
  logged_in: false,
  access_level: 'guest',
  data: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
