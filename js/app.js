document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    // The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0,width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
      ]
    
      const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
      ]
    
      const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
      ]
    
      const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
      ]
    
      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

      let currentPosition = 4
      let currentRotation = 0

      // Select a random tetromino and it's starting position
      let random  = Math.floor(Math.random()*theTetrominoes.length)
      let current = theTetrominoes[random][currentRotation]


    // Drawing the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

   // Undraw the Tetromino
   function unDraw() {
       current.forEach(index => {
           squares[currentPosition + index].classList.remove('tetromino')
           squares[currentPosition + index].style.backgroundColor = ''
       })
   }

   // Assign function to KeyCodes
   function control(e) {
       if(e.keyCode === 37) {
           moveLeft()
       } else if(e.keyCode === 38) {
           rotate()
       } else if (e.keyCode === 39) {
           moveRight()
       }  else if (e.keyCode === 40) {
           moveDown()
       }
   }

   document.addEventListener('keydown', control)
   // Move down function
   function moveDown() {
       unDraw()
       currentPosition += width
       draw()
       freeze()
   }

   // Freeze and start new Tetromino function
   function freeze() {
       if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
           current.forEach(index => squares[currentPosition + index].classList.add('taken'))
           // Start new Tetromino
           random = nextRandom
           nextRandom = Math.floor(Math.random() * theTetrominoes.length)
           current = theTetrominoes[random][currentRotation]
           currentPosition = 4
           draw()
           displayShape()
           addScore()
           gameOver()
       }
   }

   // Move Tetremino left only if it is not at the edge or there is something blocking it.
   function moveLeft() {
       unDraw()
       const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
       if(!isAtLeftEdge) currentPosition -= 1
       if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
       }
       draw()
   }

   // Move right only if it is not at the edge or there is something blocking it
   function moveRight() {
       unDraw()
       const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1 )
       if(!isAtRightEdge) currentPosition +=1
       if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
           currentPosition -= 1
       }
       draw()
   }


   // Roate the Tetremino 

   function rotate() {
       unDraw()
       currentRotation ++
       // If the current rotation gets to 4,
       // it makes sure to bring it back to the starting position.
       if(currentRotation === current.length) {
           currentRotation = 0
       }
       current = theTetrominoes[random][currentRotation]
       draw()
   }


   // Mini Grid -> Shows the next Tetrimone that will spawn.
   const displaySquares = document.querySelectorAll('.mini-grid div')
   const displayWidth = 4
   const displayIndex = 0


   // Tetreminoes without rotation
   const upNextTetrominoes = [
       // The L Tetremino
       [1, displayWidth+1, displayWidth*2+1, 2],
       // The Z Tetremino 
       [0, displayWidth, displayWidth+1, displayWidth*2+1],
       // The T Tetremino
       [1, displayWidth, displayWidth+1, displayWidth+2],
       // The O Tetremino
       [0, 1, displayWidth, displayWidth+1],
       // The I Tetremino
       [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]

   ]

    // Display the shape in the mini Grid
    function displayShape() {
        // Removes any trace of a tetromino from entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // Adding funcitonality to the button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // Add score
    function addScore() {
        for(let i = 0; i < 199; i++) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score 
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game Over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
});