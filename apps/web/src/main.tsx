import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import App from './App';
import './styles/tailwind.css';
import './styles/tokens.css';

dayjs.locale('vi');

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

createRoot(rootEl).render(
  <StrictMode>
    {/* Brand tokens theo mockups/ (đã thống nhất): primary #0d9488, secondary #10b981, accent #f59e0b */}
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: '#0d9488', borderRadius: 12, fontFamily: "'Inter', system-ui, sans-serif" } }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
