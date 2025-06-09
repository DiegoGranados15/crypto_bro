# CryptoTracker 🪙

Una aplicación web moderna que consume la API de CoinGecko para mostrar información en tiempo real sobre criptomonedas, permitiendo a los usuarios seguir el mercado y compartir sus opiniones sobre sus criptomonedas favoritas.

## 🌐 Demo en Vivo

**URL de GitHub Pages:** [https://diegogranados15.github.io/crypto_bro/](https://diegogranados15.github.io/crypto_bro/)

## ✨ Características

- **Datos en Tiempo Real:** Información actualizada de criptomonedas usando la API de CoinGecko
- **Búsqueda y Filtrado:** Busca criptomonedas por nombre o símbolo
- **Múltiples Monedas:** Soporte para USD, EUR, JPY y GBP
- **Ordenamiento Flexible:** Ordena por capitalización de mercado o precio
- **Paginación:** Navega a través de miles de criptomonedas
- **Sistema de Comentarios:** Comparte tus criptomonedas favoritas y opiniones
- **Interfaz Responsive:** Diseño adaptable para dispositivos móviles y escritorio

## 🏗️ Estructura del Proyecto

```
crypto_bro/
├── index.html              # Página principal
├── html/
│   ├── crypto.html         # Lista de criptomonedas
│   └── comments.html       # Sistema de comentarios
├── js/
│   ├── app.js             # Funcionalidades generales
│   ├── crypto.js          # Lógica de consumo de API
│   └── comments.js        # Sistema de comentarios
├── css/
│   ├── styles.css         # Estilos principales
│   ├── crypto.css         # Estilos de criptomonedas
│   └── comments.css       # Estilos de comentarios
└── README.md
```

## 🚀 Instalación y Uso Local

### Prerrequisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional pero recomendado)

### Opción 1: Abrir Directamente en el Navegador

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/diegogranados15/crypto_bro.git
   cd crypto_bro
   ```

2. **Abre el archivo principal:**
   - Navega hasta la carpeta del proyecto
   - Haz doble clic en `index.html`
   - O arrastra el archivo al navegador
   - (Recomendado): Abrir con Live Server

## 🔧 Configuración de la API

La aplicación utiliza la API de CoinGecko con las siguientes configuraciones:

- **API Key:** Incluida en el código (CG-mTkgcn2YTmVSPmyqVvE49az8)
- **Base URL:** https://api.coingecko.com/api/v3
- **Límite por página:** 12 criptomonedas
- **Moneda predeterminada:** USD

## 📱 Uso de la Aplicación

### Página Principal (index.html)

- Información sobre la aplicación y el equipo
- Enlaces de navegación hacia otras secciones
- Explicación de las ventajas de invertir en criptomonedas

### Lista de Criptomonedas (crypto.html)

- **Búsqueda:** Usa la barra de búsqueda para encontrar criptomonedas específicas
- **Ordenamiento:** Selecciona diferentes criterios de ordenamiento
- **Moneda:** Cambia la moneda de visualización
- **Paginación:** Navega entre páginas usando los botones "Anterior" y "Siguiente"

### Sistema de Comentarios (comments.html)

- **Agregar Comentario:** Completa el formulario con tu criptomoneda favorita
- **Ver Estadísticas:** Observa el total de comentarios y calificación promedio
- **Filtrar Comentarios:** Ordena por fecha o calificación

## 🛠️ Funcionalidades Técnicas

### Consumo de API

- Peticiones HTTP asíncronas usando `fetch()`
- Manejo de errores y estados de carga
- Autenticación con API key

### Almacenamiento Local

- Los comentarios se almacenan en memoria durante la sesión
- Datos de ejemplo precargados para demostración

### Características de UX

- Debouncing en la búsqueda (300ms de retraso)
- Indicadores de carga
- Mensajes de error informativos
- Animaciones y transiciones suaves

## 🔍 Endpoints de la API Utilizados

### Markets Endpoint

```
GET /coins/markets
```

**Parámetros:**

- `vs_currency`: Moneda de referencia (usd, eur, jpy, gbp)
- `order`: Criterio de ordenamiento
- `per_page`: Número de resultados por página (12)
- `page`: Número de página
- `sparkline`: false
- `price_change_percentage`: 24h

**Ejemplo de respuesta:**

```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 43000,
    "market_cap": 840000000000,
    "market_cap_rank": 1,
    "price_change_percentage_24h": 2.5
  }
]
```

## 🎨 Personalización

### Modificar la configuración:

Edita las variables en `js/crypto.js`:

```javascript
const config = {
  apiKey: "tu-api-key",
  baseUrl: "https://api.coingecko.com/api/v3",
  perPage: 12, // Cambiar número de elementos por página
  currency: "usd", // Cambiar moneda predeterminada
};
```

### Añadir nuevas monedas:

Modifica el select en `crypto.html`:

```html
<select id="currencySelect">
  <option value="usd">USD</option>
  <option value="eur">EUR</option>
  <option value="cad">CAD</option>
  <!-- Nueva moneda -->
</select>
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **La API no responde:**

   - Verifica tu conexión a internet
   - Revisa si la API key es válida
   - Comprueba los límites de rate limiting

2. **Las imágenes no cargan:**

   - Algunas imágenes pueden estar bloqueadas por CORS en desarrollo local
   - Usa un servidor local para evitar restricciones

3. **Los comentarios no se guardan:**
   - Los comentarios se almacenan en memoria durante la sesión
   - Se pierden al refrescar la página (comportamiento esperado)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Autor

**Diego Granados** - [GitHub](https://github.com/diegogranados15)

## 🙏 Agradecimientos

- [CoinGecko API](https://www.coingecko.com/en/api) por proporcionar datos de criptomonedas
- [Font Awesome](https://fontawesome.com/) por los iconos
- Comunidad de desarrolladores por el feedback y sugerencias
