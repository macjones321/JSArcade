

//declaring game variables
const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
const width = 15
const aliensRemoved = []
let currentShooterIndex = 202
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

//drawing gameboard
for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    square.id = i
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

console.log(squares)

//drawing enemies
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw () {
    for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i))
    squares[alienInvaders[i]].classList.add('invader')
    }
}

draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
    }
}

//drawing shooter
squares [currentShooterIndex].classList.add('shooter')

//player movement

function moveShooter (e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !==0) currentShooterIndex -=1
            break

        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex +=1
            break
    }
    squares [currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

//moving enemies

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1

    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight =true
        }
    }

    for (let i = 0; i< alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    //player death state

    if (squares[currentShooterIndex].classList.contains('invader')) {
        resultDisplay.innerHTML = 'GAME-OVER!'
    }

    //win or lose?
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = 'WINNER!'
    }

}

invadersId = setInterval(moveInvaders, 600)

//laser functionality
function shoot (e) {
    let laserId
    let currentLaserInderx = currentShooterIndex

    function moveLaser() {
        squares[currentLaserInderx].classList.remove('laser')
        currentLaserInderx -= width 
        squares[currentLaserInderx].classList.add('laser')

        if(squares[currentLaserInderx].classList.contains('invader')) {
            squares[currentLaserInderx].classList.remove('laser')
            squares[currentLaserInderx].classList.remove('invader')
            squares[currentLaserInderx].classList.add('boom')

            setTimeout(() => squares[currentLaserInderx].classList.remove('boom'), 60)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserInderx)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }

    }

    if (e.key === 'ArrowUp') {
        laserId = setInterval(moveLaser, 100)
    }

}

document.addEventListener ('keydown', shoot)