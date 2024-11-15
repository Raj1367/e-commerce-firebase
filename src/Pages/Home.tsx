import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs } from '../Components/FireBase';
import { addToCart, removeFromCart, updateQuantity } from '../ReduxToolkit/CartSlice';
import { setSearchQuery, setCategoryFilter, setSortByPrice } from '../ReduxToolkit/FilterSlice';
import { RootState } from '../ReduxToolkit/Store';
import { database } from '../Components/FireBase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { searchQuery, categoryFilter, sortByPrice } = useSelector((state: RootState) => state.filter);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, 'products'));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          const product = doc.data();
          productsData.push({
            id: doc.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
          });
        });
        setProducts(productsData);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isInCart = (productId: string) => cartItems.some(item => item.id === productId);

  const handleToggleCart = (product: Product) => {
    if (isInCart(product.id)) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCategoryFilter(event.target.value));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as 'asc' | 'desc' | null;
    dispatch(setSortByPrice(value));
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      if (sortByPrice === 'desc') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-12 bg-gray-100 min-h-screen my-11">
      <div className="container max-w-6xl w-full">
        {/* Search Bar */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:gap-2 md:justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="border border-gray-300 p-3 rounded-md w-full"
          />
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="border border-gray-300 p-3 rounded-md w-full md:w-[200px]"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="groceries">Groceries</option>
            </select>
            <select
              value={sortByPrice || ''}
              onChange={handleSortChange}
              className="border border-gray-300 p-3 rounded-md w-full md:w-[200px]"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-gray-900 mb-4">₹{product.price}</p>

              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={() => handleToggleCart(product)}
                  className={`w-full py-2 text-white duration-200 rounded-full font-semibold transition-all active:scale-95 ${isInCart(product.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-slate-800'}`}
                >
                  {isInCart(product.id) ? 'Remove' : 'Add'}
                </button>

                {isInCart(product.id) && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(product.id, Math.max(1, (cartItems.find(item => item.id === product.id)?.quantity || 1) - 1))}
                      className="px-3 py-1 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-gray-800">{cartItems.find(item => item.id === product.id)?.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, (cartItems.find(item => item.id === product.id)?.quantity || 1) + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
