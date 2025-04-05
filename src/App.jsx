import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Header from './components/Header';
import Home from "./pages/Home";
import Data from "./pages/Data";
import M1Release from './pages/M1Release';
import M2NodeOperators from './pages/M2NodeOperators';
import M3Education from './pages/M3Education';
import M4Mainenance from './pages/M4Maintenance';
import Settings from './pages/Settings';
import UserAdmin from './pages/UserAdmin';
import Errors from './pages/Errors';
import PaymentAdmin from './pages/PaymentAdmin';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="/m1" element={<M1Release />} />
      <Route path="/m2" element={<M2NodeOperators />} />
      <Route path="/m3" element={<M3Education />} />
      <Route path="/m4" element={<M4Mainenance />} />
      <Route path="/admin-users" element={<UserAdmin />} />
      <Route path="/admin-payments" element={<PaymentAdmin />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/return-data" element={<Data />} />
    </Route>
  )
)

function App({ routes }) {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
