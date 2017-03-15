import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AdsResource from '../../pages/ads/AdsResource';
import AdsTag from '../../pages/ads/AdsTag';
// import FourOFour from '../../pages/404';

// import { } from 'antd';

export default () => (
  <section>
    <Route
      path="/ads"
      component={({ match }) => <section>
        <Route path={`${match.url}/resource`} component={AdsResource} />
        <Route path={`${match.url}/tag`} component={AdsTag} />
      </section>}
    />
  </section>
  );

