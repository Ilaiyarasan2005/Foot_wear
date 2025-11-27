// pages/AdminDashboard.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import { Product } from '../types';

type SortColumn = keyof Product | null;
type SortDirection = 'asc' | 'desc';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAuth();
  const { products, orders, deleteProduct } = useAppContext();

  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Mock sales data calculation
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  // Calculate high sales products (mock logic)
  const productSalesMap = new Map<string, { product: Product; quantitySold: number }>();
  orders.forEach(order => {
    order.items.forEach(item => {
      const current = productSalesMap.get(item.product.id) || { product: item.product, quantitySold: 0 };
      current.quantitySold += item.quantity;
      productSalesMap.set(item.product.id, current);
    });
  });

  const highSalesProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 3); // Top 3 high sales products

  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending when changing column
    }
  };

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortColumn) {
      sortableProducts.sort((a, b) => {
        let valA: any = a[sortColumn];
        let valB: any = b[sortColumn];

        // Special handling for date strings
        if (sortColumn === 'dateAdded') {
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle string comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        // Handle number comparison
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        // Fallback for other types or inconsistencies
        return sortDirection === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }
    return sortableProducts;
  }, [products, sortColumn, sortDirection]);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      alert('Product deleted successfully!');
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const getSortIndicator = (column: keyof Product) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Sales Overview */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <p className="text-4xl font-extrabold text-green-600 mt-2">₹{totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <p className="text-4xl font-extrabold text-indigo-600 mt-2">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Products in Stock</h3>
            <p className="text-4xl font-extrabold text-blue-600 mt-2">{products.reduce((acc, p) => acc + p.stockQuantity, 0)}</p>
          </div>
        </div>
      </section>

      {/* High Sales Products */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">High Sales Products</h2>
        {highSalesProducts.length === 0 ? (
          <p className="text-gray-600">No sales data to display yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highSalesProducts.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
                <img src={item.product.imageUrl} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.product.title}</h3>
                  <p className="text-gray-600">Sold: <span className="font-bold">{item.quantitySold}</span> units</p>
                  <p className="text-green-700 font-medium">₹{(item.product.price * item.quantitySold).toFixed(2)} revenue</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Management */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <Link to="/admin/products/add">
            <Button>Add New Product</Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-600">No products available. Add one now!</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    Title {getSortIndicator('title')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIndicator('price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('stockQuantity')}
                  >
                    Stock Qty {getSortIndicator('stockQuantity')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('dateAdded')}
                  >
                    Date Added {getSortIndicator('dateAdded')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={product.imageUrl} alt={product.title} className="h-10 w-10 object-cover rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.availableSizes.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(product.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      {/* Order Management Link */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <Link to="/admin/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;