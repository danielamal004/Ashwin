import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EyeScan from './pages/EyeScan';

import ScanResult from './pages/ScanResult';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<EyeScan />} />
          <Route path="/result" element={<ScanResult />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
