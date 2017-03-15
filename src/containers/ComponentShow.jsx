import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Row, Col } from 'antd';

import Header from '../layout/Header';
import Aside from '../layout/Aside';
import Content from '../layout/Content';
import FourOFour from '../pages/404';

// import AdsResource from '../pages/ads/AdsResource';
// import AdsTag from '../pages/ads/AdsTag';


class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <section>
        <Header />
        <Row>
          <Col span={5}>
            <Aside />
          </Col>
          <Col span={19}>
            <Content />
          </Col>
        </Row>
      </section>
    );
  }
}


export default class ComponentShow extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Router>
          <section>
            <Switch>
              <Route path="/" component={App} />
              <Route path="*" component={FourOFour} />
            </Switch>
          </section>
        </Router>
      </div>

    );
  }
}
