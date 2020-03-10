import React from 'react';

//Assets
import './App.css';

import './assets/css/style.css';
import './assets/css/custom.css'
import './assets/css/bootstrap.min.css'

//Components
import Routes from './Routes';
import Header from './components/Header';
import Top from './components/Top';
import Navigation from './components/Navigation';
function App() {
  return (
      <>
      <Header />
      <div id="content">
        <Top />
        <Navigation />
        <Routes />
      </div>
      </>
    )
}

export default App;
