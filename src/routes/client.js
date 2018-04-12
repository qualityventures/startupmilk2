import RouteContact from './client-contact';
import RouteFaq from './client-faq';
import RouteLicense from './client-license';
import RouteClientProducts from './client-products';

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
  { path: '/products/:category',
    key: 'user-products',
    exact: true,
    component: RouteClientProducts,
  },
  { path: '/',
    key: 'index',
    exact: false,
    component: RouteClientProducts,
  },
];
