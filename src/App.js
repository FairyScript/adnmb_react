/* * * * * * * * *
 * A岛黎明版(使用React构建)
 * Developed by Sharin in 2019
 * //////WARNING//////
 * 工地英语
 * 辣鸡代码
 * 令人迷惑的注释
 */

import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { MainPage } from './js/MainPage';
import { Test } from './test';

function App() {
  return (
    <CookiesProvider>
      <MainPage />
    </CookiesProvider>
  )
}

export default App;
