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

// Import your new EditInvoicePage
import EditMemoPage from "./EditMemoPage";
import EditInvoicePage from "./EditInvoicePage"; // <--- NEW

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

      // Already have memos edit
      { path: "/memos/:memoId/edit", element: <EditMemoPage /> },

      // NEW: Invoices edit route
      { path: "/invoices/:invoiceId/edit", element: <EditInvoicePage /> },
    ],
  },
]);

export default routes;



