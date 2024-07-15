// src/pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import DishCard from '../components/DishCard';
// import axios from 'axios';

// const Dashboard = () => {
//   const [dishes, setDishes] = useState([]);

//   useEffect(() => {
//     axios.get('/api/dishes')
//       .then(response => {
//         setDishes(response.data);
//       })
//       .catch(error => console.error('Error fetching dishes:', error));
//   }, []);

//   const togglePublished = (id) => {
//     axios.put(`/api/dishes/${id}/toggle`)
//       .then(response => {
//         const updatedDish = response.data;
//         setDishes(dishes.map(dish =>
//           dish._id === id ? { ...dish, isPublished: updatedDish.isPublished } : dish
//         ));
//       })
//       .catch(error => console.error('Error updating dish:', error));
//   };

//   return (
//     <div className="dashboard">
//       <h1>Dish Dashboard</h1>
//       <div className="dishes-list">
//         {dishes.map(dish => (
//           <DishCard key={dish._id} dish={dish} togglePublished={togglePublished} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;








// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';

// const socket = io('http://localhost:5173');

// const Dashboard = () => {
//   const [dishes, setDishes] = useState([]);

//   useEffect(() => {
//     axios.get('/api/dishes')
//       .then(response => response.json())
//       .then(data => setDishes(data))
//       .catch(error => console.error('Error fetching dishes:'));

//     socket.on('dishUpdated', (updatedDish) => {
//       setDishes(prevDishes =>
//         prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
//       );
//     });

//     return () => {
//       socket.off('dishUpdated');
//     };
//   }, []);

//   const togglePublishedStatus = (id) => {
//    axios.get(`http://localhost:3000/api/dishes/${id}/toggle`, {
//       method: 'PUT',
//     })
//       .then(response => response.json())
//       .then(updatedDish => {
//         setDishes(prevDishes =>
//           prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
//         );
//       })
//       .catch(error => console.error('Error toggling published status:', error));
//   };

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Dish Name</th>
//             <th>Image</th>
//             <th>Published</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dishes.map(dish => (
//             <tr key={dish.dishId}>
//               <td>{dish.dishName}</td>
//               <td>
//                 <img src={dish.imageUrl} alt={dish.dishName} style={{ width: '100px' }} />
//               </td>
//               <td>{dish.isPublished ? 'Yes' : 'No'}</td>
//               <td>
//                 <button onClick={() => togglePublishedStatus(dish.dishId)}>
//                   {dish.isPublished ? 'Unpublish' : 'Publish'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5173'); // Ensure this is the correct port where your Socket.io server is running

const Dashboard = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
   // axios.get('http://localhost:3000/api/dishes')// Ensure this is the correct API URL
    axios.get('/api/dishes')
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));

    socket.on('dishUpdated', (updatedDish) => {
      setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    });

    return () => {
      socket.off('dishUpdated');
    };
  }, []);

  const togglePublishedStatus = (id) => {
    axios.put(`api/dishes/${id}/toggle`)
      .then(response => setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === response.data.dishId ? response.data : dish))
      ))
      .catch(error => console.error('Error toggling published status:', error));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Dish Name</th>
            <th>Image</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(dish => (
            <tr key={dish.dishId}>
              <td>{dish.dishName}</td>
              <td>
                <img src={dish.imageUrl} alt={dish.dishName} style={{ width: '100px' }} />
              </td>
              <td>{dish.isPublished ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => togglePublishedStatus(dish.dishId)}>
                  {dish.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
