import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,                       // ouvir em 0.0.0.0
        allowedHosts: [
            'a6a4c034dd33.ngrok-free.app',  // o domínio que o erro mostrou
            /\.ngrok(-free)?\.app$/         // e qualquer subdomínio ngrok (futuras sessões)
        ],
        hmr: {
            host: 'a6a4c034dd33.ngrok-free.app', // para o HMR funcionar através do túnel
            protocol: 'wss',
            clientPort: 443
        }
    }
})
