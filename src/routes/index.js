import RouteContact from './contact';
import RouteFaq from './faq';
import RouteLicense from './license';
import RouteUserProducts from './user-products';

export default [
  { path: '/contact',
    key: 'contact',
    exact: true,
    component: RouteContact,
  },
  { path: '/license',
    key: 'license',
    exact: true,
    component: RouteLicense,
  },
  { path: '/faq',
    key: 'faq',
    exact: true,
    component: RouteFaq,
  },
  { path: '/',
    key: 'user-products',
    exact: false,
    component: RouteUserProducts,
  },
];
