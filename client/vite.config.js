import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,

    allowedHosts: [
      'ec2-15-135-167-165.ap-southeast-2.compute.amazonaws.com',
      'ec2-16-178-42-29.ap-southeast-2.compute.amazonaws.com',
      'ec2-13-210-105-100.ap-southeast-2.compute.amazonaws.com'
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});