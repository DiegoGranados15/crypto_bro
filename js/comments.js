// Almacenamiento de comentarios en memoria
let comments = [];

// Elementos del DOM
const commentForm = document.getElementById("commentForm");
const commentsContainer = document.getElementById("commentsContainer");
const totalCommentsElement = document.getElementById("totalComments");
const uniqueCryptosElement = document.getElementById("uniqueCryptos");
const averageRatingElement = document.getElementById("averageRating");
const sortFilter = document.getElementById("sortFilter");

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", function () {
  loadComments();
  updateStats();
  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  commentForm.addEventListener("submit", handleFormSubmit);
  sortFilter.addEventListener("change", handleSortChange);
}

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(commentForm);
  const comment = {
    id: Date.now(),
    userName: formData.get("userName").trim(),
    cryptoName: formData.get("cryptoName").trim(),
    rating: parseInt(formData.get("rating")),
    investment: formData.get("investment"),
    comment: formData.get("comment").trim(),
    timestamp: new Date(),
  };

  // Validar datos
  if (!validateComment(comment)) {
    return;
  }

  // Agregar comentario
  comments.push(comment);

  // Guardar en localStorage (simulado en memoria)
  saveComments();

  // Actualizar interfaz
  displayComments();
  updateStats();

  // Limpiar formulario
  commentForm.reset();

  // Mostrar mensaje de éxito
  showSuccessMessage();

  // Scroll a la sección de comentarios
  document.querySelector(".comments-section").scrollIntoView({
    behavior: "smooth",
  });
}

// Validar comentario
function validateComment(comment) {
  if (!comment.userName || comment.userName.length < 2) {
    showErrorMessage("El nombre debe tener al menos 2 caracteres");
    return false;
  }

  if (!comment.cryptoName || comment.cryptoName.length < 2) {
    showErrorMessage(
      "El nombre de la criptomoneda debe tener al menos 2 caracteres"
    );
    return false;
  }

  if (!comment.rating || comment.rating < 1 || comment.rating > 5) {
    showErrorMessage("Debe seleccionar una calificación válida");
    return false;
  }

  if (!comment.investment) {
    showErrorMessage("Debe seleccionar una razón");
    return false;
  }

  if (!comment.comment || comment.comment.length < 10) {
    showErrorMessage("El comentario debe tener al menos 10 caracteres");
    return false;
  }

  return true;
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
  const message = document.createElement("div");
  message.className = "success-message";
  message.innerHTML =
    '<i class="fas fa-check-circle"></i> ¡Comentario publicado exitosamente!';
  message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.5s ease-out;
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.animation = "slideOutRight 0.5s ease-out";
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

// Mostrar mensaje de error
function showErrorMessage(text) {
  const message = document.createElement("div");
  message.className = "error-message";
  message.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${text}`;
  message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.5s ease-out;
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.animation = "slideOutRight 0.5s ease-out";
    setTimeout(() => message.remove(), 500);
  }, 4000);
}

// Cargar comentarios (simulado - en una app real sería desde una base de datos)
function loadComments() {
  // Agregar algunos comentarios de ejemplo
  if (comments.length === 0) {
    comments = [
      {
        id: 1,
        userName: "María González",
        cryptoName: "Bitcoin",
        rating: 5,
        investment: "Potencial de crecimiento",
        comment:
          "Bitcoin sigue siendo el rey de las criptomonedas. Su adopción institucional y la escasez programada lo convierten en una excelente reserva de valor a largo plazo.",
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 días atrás
      },
      {
        id: 2,
        userName: "Carlos Rodríguez",
        cryptoName: "Ethereum",
        rating: 4,
        investment: "Tecnología innovadora",
        comment:
          "Ethereum 2.0 ha revolucionado el ecosistema DeFi. Los contratos inteligentes y las aplicaciones descentralizadas tienen un futuro muy prometedor.",
        timestamp: new Date(Date.now() - 86400000), // 1 día atrás
      },
      {
        id: 3,
        userName: "Ana López",
        cryptoName: "Cardano",
        rating: 4,
        investment: "Equipo de desarrollo",
        comment:
          "Me gusta el enfoque académico de Cardano. Su desarrollo basado en investigación científica le da mucha credibilidad en el mercado.",
        timestamp: new Date(Date.now() - 43200000), // 12 horas atrás
      },
    ];
  }
  displayComments();
}

// Guardar comentarios (simulado en memoria)
function saveComments() {
  // En una aplicación real, aquí se guardarían en localStorage o se enviarían a un servidor
  console.log("Comentarios guardados:", comments);
}

// Mostrar comentarios
function displayComments() {
  if (comments.length === 0) {
    commentsContainer.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comment-slash"></i>
                <p>Aún no hay comentarios. ¡Sé el primero en compartir tu criptomoneda favorita!</p>
            </div>
        `;
    return;
  }

  const sortedComments = getSortedComments();

  commentsContainer.innerHTML = sortedComments
    .map(
      (comment) => `
        <div class="comment-card" data-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-user">
                    <i class="fas fa-user-circle"></i>
                    ${escapeHtml(comment.userName)}
                </div>
                <div class="comment-date">
                    <i class="fas fa-clock"></i>
                    ${formatDate(comment.timestamp)}
                </div>
            </div>
            
            <div class="comment-crypto">
                <div class="crypto-name">
                    <i class="fas fa-coins"></i>
                    ${escapeHtml(comment.cryptoName)}
                </div>
                <div class="comment-rating">
                    ${generateStars(comment.rating)}
                </div>
                <div class="comment-reason">
                    <i class="fas fa-lightbulb"></i>
                    ${escapeHtml(comment.investment)}
                </div>
            </div>
            
            <div class="comment-text">
                ${escapeHtml(comment.comment)}
            </div>
        </div>
    `
    )
    .join("");
}

// Obtener comentarios ordenados
function getSortedComments() {
  const sortedComments = [...comments];

  switch (sortFilter.value) {
    case "newest":
      return sortedComments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    case "oldest":
      return sortedComments.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    case "highest-rated":
      return sortedComments.sort((a, b) => b.rating - a.rating);
    case "lowest-rated":
      return sortedComments.sort((a, b) => a.rating - b.rating);
    default:
      return sortedComments;
  }
}

// Manejar cambio de ordenamiento
function handleSortChange() {
  displayComments();
}

// Actualizar estadísticas
function updateStats() {
  const totalComments = comments.length;
  const uniqueCryptos = new Set(comments.map((c) => c.cryptoName.toLowerCase()))
    .size;
  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
        ).toFixed(1)
      : 0;

  totalCommentsElement.textContent = totalComments;
  uniqueCryptosElement.textContent = uniqueCryptos;
  averageRatingElement.textContent = averageRating;

  // Animar números
  animateNumber(totalCommentsElement);
  animateNumber(uniqueCryptosElement);
  animateNumber(averageRatingElement);
}

// Animar números en las estadísticas
function animateNumber(element) {
  element.style.transform = "scale(1.2)";
  element.style.transition = "transform 0.3s ease";

  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 300);
}

// Generar estrellas para la calificación
function generateStars(rating) {
  const fullStars = "⭐".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  return fullStars + emptyStars;
}

// Formatear fecha
function formatDate(date) {
  const now = new Date();
  const diff = now - new Date(date);

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
  } else if (days < 7) {
    return `Hace ${days} día${days !== 1 ? "s" : ""}`;
  } else {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Agregar estilos CSS para las animaciones
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .comment-card {
        animation: fadeIn 0.5s ease-out;
    }
`;

document.head.appendChild(style);
