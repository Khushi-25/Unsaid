import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import UnsaidApp from './UnsaidApp';
export default function App() {
  return (
    <>
      {React.createElement(UnsaidApp, null)}
      <Analytics />
    </>
  );
}
