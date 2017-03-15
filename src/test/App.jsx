import React, { Component } from 'react';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import './app.css';

console.log('container');

export default class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log('container mount');
  }

  render() {
    console.log('container render');
    return (
      <div>
        <PageOne />
        <PageTwo />
      </div>
    );
  }
}
