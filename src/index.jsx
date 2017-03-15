import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR
import ComponentShow from './containers/ComponentShow';
// import App from './test/App';
import auth from './auth';

const init = () => {
  render(
    <AppContainer>
      <ComponentShow />
    </AppContainer>,
    document.querySelector('#app'),
  );

  if (module.hot) {
    module.hot.accept('./containers/ComponentShow', () => {
      const ComponentShow = require('./containers/ComponentShow').default;
      render(
        <AppContainer>
          <ComponentShow />
        </AppContainer>,
        document.querySelector('#app'),
    );
    });
  }
};

auth()
  .then(() => {
    init();
  });
