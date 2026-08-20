/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';

import Scheduling from './pages/modules/Scheduling';
import Optimisation from './pages/modules/Optimisation';
import SelfRoster from './pages/modules/SelfRoster';
import Leave from './pages/modules/Leave';
import Exceptions from './pages/modules/Exceptions';
import Theatre from './pages/modules/Theatre';
import Integrations from './pages/modules/Integrations';
import Mobile from './pages/modules/Mobile';
import Vacancies from './pages/modules/Vacancies';
import Analytics from './pages/modules/Analytics';
import Admin from './pages/modules/Admin';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/optimisation" element={<Optimisation />} />
            <Route path="/selfroster" element={<SelfRoster />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/exceptions" element={<Exceptions />} />
            <Route path="/theatre" element={<Theatre />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/mobile" element={<Mobile />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

