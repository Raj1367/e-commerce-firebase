import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxToolkit/Store';
import { database } from '../Components/FireBase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; 
}

interface Order {
  orderId: string;
  items: OrderItem[];
  totalValue: number;
  orderDate: string;
  orderTime: string;
}

const MyOrders: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrderHistory = async () => {
      try {
        const ordersQuery = query(
          collection(database, 'orders'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders: Order[] = [];

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          const items = Array.isArray(orderData.items) ? orderData.items : [];
          const totalValue = orderData.totalValue || 0;

          // Extract and format Firestore Timestamp to date and time strings
          const orderTimestamp = orderData.timestamp instanceof Timestamp
            ? orderData.timestamp.toDate()
            : new Date();
          const orderDate = orderTimestamp.toLocaleDateString();
          const orderTime = orderTimestamp.toLocaleTimeString();

          fetchedOrders.push({
            orderId: doc.id,
            items,
            totalValue,
            orderDate,
            orderTime,
          });
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching order history: ", error);
      }
    };

    fetchOrderHistory();
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6">
      <div className="w-full max-w-4xl px-6">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-center text-lg">You have no order history.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.orderId} className="order-card border p-6 rounded-lg mb-6 shadow-lg bg-white">
                <h3 className="text-lg font-semibold mb-2">Order ID: {order.orderId}</h3>
                <p className="text-gray-500">Order Date: {order.orderDate} at {order.orderTime}</p>

                <div className="order-items mt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-gray-600">₹{item.price} x {item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-2">
                  <h3 className="text-xl font-semibold">Total: ₹{order.totalValue}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
