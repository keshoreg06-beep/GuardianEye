import { createStore } from 'redux';

// Define initial state
const initialState = {};

// Define a reducer
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        // Define case statements for different actions
        default:
            return state;
    }
};

// Create the Redux store
const store = createStore(rootReducer);

export default store;