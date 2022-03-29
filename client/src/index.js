import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './CssFiles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore} from 'redux';
import {Provider}  from 'react-redux';
import { pokemonReducer } from './JsFiles/Reducers/pokemonReducer';
const store = createStore(pokemonReducer)


ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
