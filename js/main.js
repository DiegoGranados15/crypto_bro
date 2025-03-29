// Configuración de la aplicación
const config = {
  apiKey: "CG-mTkgcn2YTmVSPmyqVvE49az8",
  baseUrl: "https://api.coingecko.com/api/v3",
  perPage: 12,
  currentPage: 1,
  currency: "usd",
  sortBy: "market_cap_desc",
};

// Selectores DOM
const elements = {
  cryptoContainer: document.getElementById("cryptoContainer"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  currencySelect: document.getElementById("currencySelect"),
  prevPageBtn: document.getElementById("prevPage"),
  nextPageBtn: document.getElementById("nextPage"),
};

// Controlador principal
class CryptoController {
  constructor(config, elements) {
    this.config = config;
    this.elements = elements;
    this.cryptoData = [];
    this.filteredData = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.fetchCryptoData();
  }

  setupEventListeners() {
    // Debounce para la búsqueda
    let searchTimeout;
    this.elements.searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filterCryptoData();
      }, 300);
    });

    this.elements.sortSelect.addEventListener("change", () => {
      this.config.sortBy = this.elements.sortSelect.value;
      this.fetchCryptoData();
    });

    this.elements.currencySelect.addEventListener("change", () => {
      this.config.currency = this.elements.currencySelect.value;
      this.fetchCryptoData();
    });

    this.elements.prevPageBtn.addEventListener("click", () => {
      if (this.config.currentPage > 1) {
        this.config.currentPage--;
        this.fetchCryptoData();
      }
    });

    this.elements.nextPageBtn.addEventListener("click", () => {
      this.config.currentPage++;
      this.fetchCryptoData();
    });
  }

  async fetchCryptoData() {
    this.showLoader();

    try {
      const url = `${this.config.baseUrl}/coins/markets?vs_currency=${this.config.currency}&order=${this.config.sortBy}&per_page=${this.config.perPage}&page=${this.config.currentPage}&sparkline=false&price_change_percentage=24h`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-api-key": this.config.apiKey,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      this.cryptoData = await response.json();
      this.filterCryptoData();
      this.updatePaginationButtons();
    } catch (error) {
      this.showError(error.message);
      console.error("Error fetching data:", error);
    }
  }

  filterCryptoData() {
    const searchTerm = this.elements.searchInput.value.toLowerCase();

    if (searchTerm === "") {
      this.filteredData = this.cryptoData;
    } else {
      this.filteredData = this.cryptoData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm) ||
          crypto.symbol.toLowerCase().includes(searchTerm)
      );
    }

    this.renderCryptoData();
  }

  renderCryptoData() {
    this.elements.cryptoContainer.innerHTML = "";

    if (this.filteredData.length === 0) {
      this.elements.cryptoContainer.innerHTML = `
                <div class="error-message">
                    <p>No se encontraron criptomonedas que coincidan con tu búsqueda.</p>
                </div>
            `;
      return;
    }

    this.filteredData.forEach((crypto) => {
      const priceChange = crypto.price_change_percentage_24h;
      const priceChangeClass = priceChange >= 0 ? "positive" : "negative";
      const priceChangeSign = priceChange >= 0 ? "+" : "";

      const card = document.createElement("div");
      card.className = "crypto-card";
      card.innerHTML = `
                <div class="crypto-header">
                    <div class="crypto-name">
                        <img src="${crypto.image}" alt="${
        crypto.name
      }" class="crypto-img">
                        <h3>${
                          crypto.name
                        } <span>(${crypto.symbol.toUpperCase()})</span></h3>
                    </div>
                    <div class="rank">#${crypto.market_cap_rank}</div>
                </div>
                <div class="crypto-content">
                    <div class="price-info">
                        ${this.formatCurrency(crypto.current_price)}
                        <span class="${priceChangeClass}">${priceChangeSign}${priceChange.toFixed(
        2
      )}%</span>
                    </div>
                    <div class="crypto-info">
                        <div class="info-item">
                            <span class="info-label">Market Cap</span>
                            <span class="info-value">${this.formatCurrency(
                              crypto.market_cap,
                              true
                            )}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Volumen 24h</span>
                            <span class="info-value">${this.formatCurrency(
                              crypto.total_volume,
                              true
                            )}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Alto 24h</span>
                            <span class="info-value">${this.formatCurrency(
                              crypto.high_24h
                            )}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Bajo 24h</span>
                            <span class="info-value">${this.formatCurrency(
                              crypto.low_24h
                            )}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Supply Circulante</span>
                            <span class="info-value">${this.formatNumber(
                              crypto.circulating_supply
                            )} ${crypto.symbol.toUpperCase()}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Supply Máximo</span>
                            <span class="info-value">${
                              crypto.max_supply
                                ? this.formatNumber(crypto.max_supply) +
                                  " " +
                                  crypto.symbol.toUpperCase()
                                : "N/A"
                            }</span>
                        </div>
                    </div>
                </div>
            `;

      this.elements.cryptoContainer.appendChild(card);
    });
  }

  updatePaginationButtons() {
    this.elements.prevPageBtn.disabled = this.config.currentPage <= 1;
    // Habilitamos el botón siguiente siempre que tengamos datos completos
    this.elements.nextPageBtn.disabled =
      this.cryptoData.length < this.config.perPage;
  }

  formatCurrency(value, compact = false) {
    if (value === null || value === undefined) return "N/A";

    const currencySymbol = this.getCurrencySymbol();

    if (compact && value >= 1e9) {
      return `${currencySymbol}${(value / 1e9).toFixed(2)}B`;
    } else if (compact && value >= 1e6) {
      return `${currencySymbol}${(value / 1e6).toFixed(2)}M`;
    } else if (compact && value >= 1e12) {
      return `${currencySymbol}${(value / 1e12).toFixed(2)}T`;
    }

    return `${currencySymbol}${this.formatNumber(value)}`;
  }

  formatNumber(value) {
    if (value === null || value === undefined) return "N/A";

    // Para valores pequeños, mostramos más decimales
    if (value < 0.01) {
      return value.toFixed(6);
    } else if (value < 1) {
      return value.toFixed(4);
    } else if (value < 1000) {
      return value.toFixed(2);
    }

    // Para valores grandes, separamos con comas
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getCurrencySymbol() {
    switch (this.config.currency) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "gbp":
        return "£";
      case "jpy":
        return "¥";
      default:
        return "$";
    }
  }

  showLoader() {
    this.elements.cryptoContainer.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
            </div>
        `;
  }

  showError(message) {
    this.elements.cryptoContainer.innerHTML = `
            <div class="error-message">
                <p>Error al cargar los datos: ${message}</p>
                <p>Por favor, intenta de nuevo más tarde.</p>
            </div>
        `;
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new CryptoController(config, elements);
});
