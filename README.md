# Sistema_doacao_frontend
front end para o sistema de doação
## Rodar o APP (Expo)

### 1) Entrar na pasta do app
```bash
cd Sistema_Doacao
```

### 2) Configurar URL da API
Edite `Sistema_Doacao/.env`:

- **Emulador Android:** `http://10.0.2.2:3000`
- **Web / iOS Simulator:** `http://localhost:3000`
- **Celular (Expo Go):** `http://SEU_IP_WIFI:3000`

Exemplo:
```env
EXPO_PUBLIC_URL_API=http://10.0.2.2:3000
```

### 3) Instalar e iniciar
```bash
npm install
npx expo start
```

Depois, clique em uma campanha na Home para abrir:
- Detalhes (carrossel + descrição)
- Botão **Doar** (formulário)
- Botão **Localização** (mapa)
