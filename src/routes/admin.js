import RouteAdminProducts from './admin-products';
import RouteAdminProductEdit from './admin-product-edit';
import RouteAdminProductCreate from './admin-product-create';

export default [
  { path: '/admin/product/create',
    key: 'admin-product-create',
    exact: true,
    component: RouteAdminProductCreate,
  },
  { path: '/admin/product/:id',
    key: 'admin-product-edit',
    exact: true,
    component: RouteAdminProductEdit,
  },
  { path: '/admin/products',
    key: 'admin-products',
    exact: true,
    component: RouteAdminProducts,
  },
  { path: '/',
    key: 'index',
    exact: false,
    component: RouteAdminProducts,
  },
];
