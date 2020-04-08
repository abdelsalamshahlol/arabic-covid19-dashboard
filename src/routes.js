import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: '/dashboard', name: 'لوحة المعلومات covid-19', component: Dashboard},
];

export default routes;
