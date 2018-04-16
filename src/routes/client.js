import RouteContact from './client-contact';
import RouteFaq from './client-faq';
import RouteLicense from './client-license';
import { RouteClientProducts, fetchClientProducts } from './client-products';
import { RouteClientProduct, fetchClientProduct } from './client-product';

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
  { path: '/product/:url',
    key: 'user-product',
    exact: true,
    component: RouteClientProduct,
    fetchData: fetchClientProduct,
  },
  { path: '/products/:category',
    key: 'user-products',
    exact: true,
    component: RouteClientProducts,
    fetchData: fetchClientProducts,
  },
  { path: '/',
    key: 'index',
    exact: false,
    component: RouteClientProducts,
    fetchData: fetchClientProducts,
  },
];
