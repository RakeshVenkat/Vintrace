import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = { wine: null };

  componentDidMount() {
    fetch('/api/v1/wine')
      .then(res => res.json())
      .then(wine => this.setState({ wine }));
  }

  render() {
    const { wine } = this.state;
    return (
      <div>
        <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
        <h3>The following are the Wine details fetched from backend</h3>
        {wine ? wine.data.lotCodes.map(el => (<h4>{el}</h4>)) : 'Please wait'}
        <h6>This is a boilerplate to validate that the full stack app is functional!!</h6>
      </div>
    );
  }
}
