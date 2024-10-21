import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AddInterview from "./page/createInterview/AddInterview";
import Register from "./page/Register/Register";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initialised } from "./Feature/adminSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "company",
    element: <AddInterview />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialised());
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
