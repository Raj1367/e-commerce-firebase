import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../ReduxToolkit/Store';
import { removeFromCart, updateQuantity, clearCart } from '../ReduxToolkit/CartSlice';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { database } from '../Components/FireBase';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

  const totalValue = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const saveCartToFirestore = async (userId: string, cartItems: any) => {
    if (!userId) {
      console.error("User ID is required to save cart data.");
      return;
    }

    try {
      const checkoutDate = new Date();
      const formattedDate = checkoutDate.toLocaleDateString();
      const formattedTime = checkoutDate.toLocaleTimeString();

      await addDoc(collection(database, 'orders'), {
        userId,
        items: cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalValue,
        checkoutDate: formattedDate,
        checkoutTime: formattedTime,
        timestamp: Timestamp.now(),
      });

      console.log("Order saved to Firestore successfully.");
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    } else {
      handleRemove(id);
    }
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) {
      alert("You must be logged in with items in the cart to complete checkout.");
      return;
    }
    try {
      await saveCartToFirestore(user.uid, cartItems);
      dispatch(clearCart());
      alert("Checkout successful! Your order has been saved.");
      navigate("/");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to complete checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg relative">
        {cartItems.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="absolute top-4 right-4 px-2 md:px-6 py-2 text-sm md:text-md bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center uppercase">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Your cart is empty</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg mb-4 shadow-sm flex flex-col md:flex-row items-center md:space-x-4 bg-white">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price}</p>
                  <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded-l text-lg">
                      -
                    </button>
                    <span className="px-4 py-1 border text-lg">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded-r text-lg">
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => handleRemove(item.id)} className="text-red-600 font-bold hover:underline mt-2 md:mt-0">
                  Remove
                </button>
              </div>
            ))}
            <div className="border-t mt-6 pt-4">
              <h3 className="text-2xl font-semibold text-right">Total: ₹{totalValue.toFixed(2)}</h3>
            </div>
            <div className="flex gap-4 mt-6 justify-center w-full">
              <button onClick={handleCheckout} className="px-6 py-3 bg-black font-semibold text-white rounded-full shadow-md hover:bg-gray-800 transition w-full md:w-auto">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

