import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from "./pages/Home";
import Data from "./pages/Data";
import M1Release from './pages/M1Release';
import M2NodeOperators from './pages/M2NodeOperators';
import M3Education from './pages/M3Education';
import M4Mainenance from './pages/M4Maintenance';
import Settings from './pages/Settings';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="m1" element={<M1Release />} />
      <Route path="m2" element={<M2NodeOperators />} />
      <Route path="m3" element={<M3Education />} />
      <Route path="m4" element={<M4Mainenance />} />
      <Route path="settings" element={<Settings />} />
      <Route path="return-data" element={<Data />} />
    </Route>
  )
)

function App({routes}) {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
