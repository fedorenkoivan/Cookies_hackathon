// import { useState, useEffect } from "react";
// import axios from "axios";

// interface User {
//   user_id: number;
//   name: string;
//   email: string;
//   password: string;
// }

// const Users = () => {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/check-users");
//         setUsers(response.data);
//         console.log(response, response.data);
//       } catch (err) {
//         console.log("err:", err);
//       }
//     })();
//   }, []);

//   return (
//     <div>
//       <h2>List of Users</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user.user_id}>
//             <h3>{user.name}</h3>
//             <p>{user.email}</p>
//             <p>{user.password}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Users;
