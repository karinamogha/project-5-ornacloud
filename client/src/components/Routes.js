// routes.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import Signin from "./Signin";
import MemosPage from "./MemosPage";
import InvoicesPage from "./InvoicesPage";
import CreateMemoPage from "./CreateMemoPage";
import CreateInvoicePage from "./CreateInvoicePage";

// 1) IMPORT YOUR NEW EDIT PAGE
import EditMemoPage from "./EditMemoPage"; // <--- Add this

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/signin", element: <Signin /> },
      { path: "/memos", element: <MemosPage /> },
      { path: "/invoices", element: <InvoicesPage /> },
      { path: "/create-memo", element: <CreateMemoPage /> },
      { path: "/create-invoice", element: <CreateInvoicePage /> },

      // 2) ADD A ROUTE FOR EDIT
      { path: "/memos/:memoId/edit", element: <EditMemoPage /> },
    ],
  },
]);

export default routes;


