import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import MemosPage from "./MemosPage";
import InvoicesPage from "./InvoicesPage";
import CreateMemoPage from "./CreateMemoPage";
import CreateInvoicePage from "./CreateInvoicePage";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/memos", element: <MemosPage /> },
      { path: "/invoices", element: <InvoicesPage /> },
      { path: "/create-memo", element: <CreateMemoPage /> },
      { path: "/create-invoice", element: <CreateInvoicePage /> },
    ],
  },
]);

export default routes;

