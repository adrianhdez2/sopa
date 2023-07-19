  const words = [
    "CATEQUINA",
    "CASCARILLA",
    "TOSTADO",
    "FERMENTACION",
    "ANTIOXIDANTES",
    "CHOCOLATE",
    "CACAO",
    "TEOBROMINA",
    "MAZORCA",
    "FENILETILAMINA",
    // Agrega más palabras aquí
  ];

  const gridSize = 15; // Tamaño del rompecabezas (10x10 en este caso)
  const puzzleContainer = document.getElementById("puzzle-container");
  const foundWordsList = document.getElementById("found-words");
  const directions = [
    { x: 1, y: 0 },   // Horizontal
    { x: 0, y: 1 },   // Vertical
    { x: 1, y: 1 },   // Diagonal
    { x: -1, y: 0 },  // Horizontal inversa
    { x: 0, y: -1 },  // Vertical inversa
    { x: -1, y: -1 }, // Diagonal inversa
  ];
  
  let puzzle = [];
  
  // Función para generar una sopa de letras aleatoria
  function generatePuzzle() {
    // Crea una matriz 2D para el rompecabezas con celdas vacías
    for (let i = 0; i < gridSize; i++) {
      puzzle[i] = [];
      for (let j = 0; j < gridSize; j++) {
        puzzle[i][j] = "";
      }
    }
  
    // Coloca las palabras aleatoriamente en el rompecabezas
    for (const word of words) {
      let direction = directions[Math.floor(Math.random() * directions.length)];
      let added = false;
  
      while (!added) {
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
  
        let currentX = startX;
        let currentY = startY;
        let canPlace = true;
  
        for (const letter of word) {
          if (
            currentX < 0 ||
            currentY < 0 ||
            currentX >= gridSize ||
            currentY >= gridSize ||
            puzzle[currentY][currentX] !== ""
          ) {
            canPlace = false;
            break;
          }
  
          currentX += direction.x;
          currentY += direction.y;
        }
  
        if (canPlace) {
          currentX = startX;
          currentY = startY;
          for (const letter of word) {
            puzzle[currentY][currentX] = letter;
            currentX += direction.x;
            currentY += direction.y;
          }
          added = true;
        }
      }
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (puzzle[i][j] === "") {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          puzzle[i][j] = randomLetter;
        }
      }
    }
  }
  
  // Función para renderizar el rompecabezas en el HTML
  function renderGrid() {
    const gridContainer = document.getElementById("puzzle-container");
    const grid = document.createElement("div");
    grid.classList.add("grid");
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = puzzle[i][j]; // Asignamos la letra a la celda
        grid.appendChild(cell);
      }
    }
  
    gridContainer.appendChild(grid);
  }
  

// Función para manejar la selección de palabras por el usuario
function handleWordInput() {
  const cells = document.querySelectorAll(".cell");

  // Variable para rastrear la palabra ingresada por el usuario
  let inputWord = "";

  function resetInput() {
    inputWord = "";
  }

  function markWordAsFound() {

    cells.forEach((cell) => {
      if (cell.style.backgroundColor === "yellow") {
        cell.classList.add("found-word");
        cell.style.backgroundColor = "gray";
      }
    });
  }

  cells.forEach((cell) => {
    cell.addEventListener("mousedown", () => {
      const index = Array.from(cells).indexOf(cell);
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const letter = puzzle[row][col];

      // Verificar si el usuario está escribiendo una palabra nueva o continúa una existente
      if (cell.style.backgroundColor === "yellow") {
        // Si el fondo de la celda es amarillo, la celda ya fue seleccionada previamente.
        // Entonces, removemos la letra de la palabra en progreso.
        inputWord = inputWord.slice(0, -1);
        cell.style.backgroundColor = "";
      } else {
        // Si la celda no ha sido seleccionada, la agregamos a la palabra en progreso.
        inputWord += letter;
        cell.style.backgroundColor = "yellow";
      }

      // Comprobar si la palabra ingresada coincide con alguna de las palabras en la sopa de letras
      if (words.includes(inputWord)) {
        const foundWords = foundWordsList.getElementsByTagName("li");
        if (!Array.from(foundWords).some((li) => li.textContent === inputWord)) {
          const li = document.createElement("li");
          li.textContent = inputWord;
          foundWordsList.appendChild(li);

          // Reiniciamos la palabra ingresada para buscar otra palabra
          resetInput();

          // Marcar la palabra encontrada
          markWordAsFound();
        }
      }
      
    });
  });
}


generatePuzzle();
renderGrid();
handleWordInput();