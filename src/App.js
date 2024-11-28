import logo from "./logo.svg";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LayOut from "./Pages/LayOut/LayOut";
import NotFound from "./Pages/NotFound/NotFound";
import Users from "./Pages/Users/Users";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
function App() {
  const routers = createBrowserRouter([
    {
      path: "",
      element: <LayOut />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        {
          path: "users",
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={routers}></RouterProvider>;
}

export default App;
