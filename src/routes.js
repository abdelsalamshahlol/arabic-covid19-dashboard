import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: '/dashboard', name: 'لوحة معلومات جائحة كورونا المستجد | covid-19', component: Dashboard},
];

export default routes;
