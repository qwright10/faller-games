import React from 'react';
import { useStore } from '../App';
import './toggle.css';

export default () => {
  const dark = useStore(state => state.dark);

  const className = dark ? 'toggle active' : 'toggle';

  return (
    <div
      className={className}
      onClick={() => {
        console.log('[toggle.tsx] changed appearance:', dark ? 'dark' : 'light');
        useStore.setState({ dark: !dark });
      }}
    >
    </div>
  );
}
