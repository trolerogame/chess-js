// VARIABLES INICIALES

const $ = sl => document.querySelector(sl)
let alternator = 0
let count = 0
let move = 0
let togglePlayer = 1
let idBefore = null
let beforeGrid = []
let grids = [
    { player:0,piece:'toward'},
    { player:0,piece:'horse'},
    { player:0,piece:'alpil'},
    { player:0,piece:'queen'},
    { player:0,piece:'king'},
    { player:0,piece:'alpil'},
    { player:0,piece:'horse'},
    { player:0,piece:'toward'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    { player:0,piece:'pawn'},
    {},{},{},{},{},{},{},{},
    {},{},{},{},{},{},{},{},
    {},{},{},{},{},{},{},{},
    {},{},{},{},{},{},{},{},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'pawn'},
    { player:1,piece:'toward'},
    { player:1,piece:'horse'},
    { player:1,piece:'alpil'},
    { player:1,piece:'queen'},
    { player:1,piece:'king'},
    { player:1,piece:'alpil'},
    { player:1,piece:'horse'},
    { player:1,piece:'toward'}
]
let positionsKings = [4, 60]

const piecesImgsPlayerOne = {
    'toward':'./images/chess-rook-svgrepo-com.svg',
    'horse':'./images/chess-knight-svgrepo-com.svg',
    'alpil':'./images/chess-bishop-svgrepo-com.svg',
    // 'queen':'./images/New_Project.svg',
    'queen':'./images/chess-queen-svgrepo-com.svg',
    'king':'./images/chess-king-svgrepo-com.svg',
    'pawn':'./images/chess-pawn-svgrepo-com.svg',
}

const piecesImgsPlayerTwo = {
    'toward':'./images/chess-rook-svgrepo-com-white.svg',
    'horse':'./images/chess-knight-svgrepo-com-white.svg',
    'alpil':'./images/chess-bishop-svgrepo-com-white.svg',
    //'queen':'./images/New_Project.svg',
    'queen':'./images/chess-queen-svgrepo-com-white.svg',
    'king':'./images/chess-king-svgrepo-com-white.svg',
    'pawn':'./images/chess-pawn-svgrepo-com-white.svg',
}

let actuaclesMovements = []
let actualPiece = null

// CREACION DE LA GRILLA

grids.forEach((grid, index) => {
    let div = document.createElement('div')
    div.classList.add('grid')
    div.id = index
    if(count >= 8) {
        count = 0
        alternator == 1 ? alternator = 0 : alternator = 1
    }
    if(alternator == 0){
        div.classList.add('even')
        alternator = 1
    }else{
        div.classList.add('odd')
        alternator = 0
    }
    count++
    if(!!grid.piece){
        let img = document.createElement('div')
        img.classList.add('img')
        img.style.backgroundImage = 
            `url(${grid.player == 0 ? piecesImgsPlayerOne[grid.piece] : piecesImgsPlayerTwo[grid.piece]})`
        img.id = index
        div.appendChild(img)
    }
    $('.container-chess').appendChild(div)
})

grids = grids.map(grid => {
    return grid.piece == undefined ? grid : {...grid, actuaclesMovements:[]}
})


let divs = Array.from(document.querySelectorAll('.grid'))


// FUNCIONES ----------


const comprobatePieceEnemy = (id,playerActual) => 
    grids[id].player != undefined && grids[id].player != playerActual ? 1 : 0


const comprobatePieceAlie = (idOne,idTwo) =>
    grids[idOne].player != idTwo


//  AGREGA A UNA LISTA LOS POSIBLES MOVIMIENTOS DE LA PIEZA ACTUAL
const addStyleGrids = (add,actuaclesMovements) => {
    actuaclesMovements.filter(item => item != undefined).forEach(movement => {
        const div = divs.find(d => d.id == movement)
        div.classList[add]('circle')
    })
}

// ROTACION DEL TABLERO

const rotatePanel = () => {
    document.querySelector('.container-chess').append(...divs.reverse())
}

const movementY = (id, tb, limit) => {
    let playerActual = grids[id].player 
    while(
        !!grids[id + tb] && 
        comprobatePieceAlie(id + tb, playerActual) && 
        (tb == 8 ? id < limit : id > limit)
    ){
        actuaclesMovements.push(id + tb)
        if(comprobatePieceEnemy(id + tb,playerActual)) return
        id += tb
    }
}

const movementX = (id,l) => {
    let playerActual = grids[id].player 
    let rest = id % 8 
    let count = 0
    let Id = l ? id - count - 1 : id + count + 1
    while(
        ( l ? rest > 0 : rest < 7) && 
        comprobatePieceAlie(Id, playerActual) 
    ){
        actuaclesMovements.push(Id)
        if(comprobatePieceEnemy(Id,playerActual)) return
        rest += l ? -1 : 1 
        count++
        Id = l ? id - count - 1 : id + count + 1
    }
}

const movementZ = (id, tb, limit, l) => {
    let playerActual = grids[id].player 
    let one = l ? -1 : 1
    count = one
    let rest = id % 8
    let Id = id + tb + count
    while(
        !!grids[Id] && 
        comprobatePieceAlie(Id, playerActual) && 
        (tb == 8 ? id < limit : id > limit) && 
        (l ? rest > 0 : rest < 7) 
    ){
        actuaclesMovements.push(Id)
        if(comprobatePieceEnemy(Id,playerActual)) return
        id += tb
        count += one
        rest += one
        Id = id + tb + count
    }
}

const movementL = (id,num, mul, one) => {
    let grid = id + num  // Calcula la fila en donde moverse
    let piece = grid + (one * mul)  // calcula el id para generar la forma de L
    let rest = grid % 8
    let limitLeft = grid - rest // Genera el limite de movimiento del extremo izquierdo de la fila
    let limitRight = grid + ( 7 - rest) // Genera el limite de movimiento del extremo derecho de la fila
    if(
        piece < 64 && 
        piece >= 0 && 
        grid >= 0 && 
        grid <= 63 && 
        piece >= limitLeft &&
        piece <= limitRight &&
        comprobatePieceAlie(piece, grids[id].player)
    ){
        actuaclesMovements.push(piece)
    }
    
}

// REGLAS PARA LAS TORRES

const movementToward = id => {
    movementY(id,-8, 0)
    movementY(id,8, 64)
    movementX(id,true)
    movementX(id,false)
}

// REGLAS PARA LOS ALFILES

const movementAlpil = id => {
    movementZ(id,-8, 0)
    movementZ(id,-8, 0, true)
    movementZ(id,8, 64)
    movementZ(id,8, 64, true)
}


// REGLAS PARA EL CABALLO
const movementHorse = (id, num, mul) => {
    movementL(id,num,mul,1)
    movementL(id,num,mul,-1)
}

// REGLAS PARA EL REY
const movementKing = (id,king) => {
    if(
        id < 0 ||
        id > 63 ||
        grids[id].player == grids[king].player
    ) return;
    console.log(id)
}

const movementPiece = (img, divFind) => {
    img.style.cursor = 'grab'
    move = 0
    img.style.position = 'static'
    idBefore = img.id
    // Si no tiene movimientos posibles vuelve a ponerlo en la casilla en donde estaba
    if(!grids[img.id].actuaclesMovements.includes(Number(divFind.id))){
        img.style.left = beforeGrid[0] + 'px'
        img.style.top = beforeGrid[1] + 'px'
        return
    }
    addStyleGrids('remove', grids[img.id].actuaclesMovements)
    // if(grids[img.id].player != togglePlayer) return
    if(img.id != divFind.id){
        if(grids[img.id].piece == 'pawn') {
            grids[img.id].firstMovement ??= true
            // Convertir al peon en rey
            if(divFind.id < 8 || divFind.id > 55 ){
                grids[img.id].piece = 'queen'
                img.style.backgroundImage = 
                    `url(${grids[img.id].player == 0 ? 
                            piecesImgsPlayerOne[grids[img.id].piece] : 
                            piecesImgsPlayerTwo[grids[img.id].piece]
                    })`
            }
        }
        togglePlayer = togglePlayer == 0 ? 1 : 0
        let beforeMove = grids[img.id]
        grids[img.id] = {}
        img.id = divFind.id
        grids[img.id] = beforeMove
        let beforeChild = divFind.children.item(0)
        beforeChild && divFind.removeChild(divFind.children.item(0))
        divFind.appendChild(img)
        beforeGrid = [divs[img.id].offsetLeft, divs[img.id].offsetTop]
        
        idBefore = beforeMove.id
        if(grids[img.id].piece == 'king'){
            positionsKings[grids[img.id].player] = img.id
        }
        divs.forEach(div => {
            let imgFound = div.children.item(0)
            if(!imgFound) return
            actuaclesMovements = []
            comprobateKingAndPieces(imgFound)
        })
        actuaclesMovements = []
        // rotatePanel()
    }
}

const comprobatePiece = (img,id) => {
    if(grids[id].piece == 'pawn'){
        let numAdvance = grids[id].player == 0 ? 8 : -8
        if(!grids[id + numAdvance].piece){
            actuaclesMovements = 
                !grids[id].firstMovement && 
                grids[id + numAdvance * 2].piece == null ? 
                [id + numAdvance, id + numAdvance * 2] : 
                [id + numAdvance]
        }

        // Comprueba diagonalmente si hay una pieza enemiga
        let enemy = grids[id].player == 0 ? 1 : 0
        grids[id + numAdvance + 1].player == enemy &&
            actuaclesMovements.push(id + numAdvance + 1)

        grids[id + numAdvance - 1].player == enemy &&
        actuaclesMovements.push(id + numAdvance - 1)  
        actualPiece = img
    }

    if(grids[id].piece == 'toward'){
        movementToward(id)
        actualPiece = img
    }

    if(grids[id].piece == 'alpil'){
        movementAlpil(id)
        actualPiece = img
    }

    if(grids[id].piece == 'queen'){
        movementToward(id)
        movementAlpil(id)
        actualPiece = img
    }

    if(grids[id].piece == 'horse'){
        movementHorse(id ,-16, 1)
        movementHorse(id ,16, 1)
        movementHorse(id, -8, 2)
        movementHorse(id, 8, 2)
        actualPiece = img
    }
}


const comprobateKingAndPieces = (img) => {
    let id = Number(img.id)
    beforeGrid = [img.offsetLeft, img.offsetTop]
    positionsKings.forEach((king,index) => {
        movementKing(king, king)
        movementKing(king + 8, king)
        movementKing(king + 8 + 1, king)
        movementKing(king + 8 - 1, king)
        movementKing(king - 8, king)
        movementKing(king - 8 + 1, king)
        movementKing(king - 8 - 1, king)
        movementKing(king + 1, king)
        movementKing(king - 1, king)
    })
    comprobatePiece(img,id)
    grids[id] = {...grids[id], actuaclesMovements}
}


// EVENTOS PARA LOS CONTENEDORES

divs.forEach(div => {
    let img = div.children.item(0)

    div.addEventListener('click', e => {
        movementPiece(actualPiece,div)
    })
    if(img == null) return
    comprobateKingAndPieces(img)
    actuaclesMovements = []
    img.addEventListener('mousedown', e => {
        img.style.left = (img.offsetLeft) + 'px'
        img.style.top = (img.offsetTop) + 'px'
        img.style.cursor = 'grabbing'
        img.style.position = 'absolute'
        actualPiece = img
        idBefore != null && addStyleGrids('remove', grids[idBefore].actuaclesMovements)
        actuaclesMovements = []
        if(grids[img.id].piece != undefined && grids[img.id].actuaclesMovements.length == 0){
            comprobateKingAndPieces(img)
        }
        move = 1
        addStyleGrids('add',grids[img.id].actuaclesMovements)
    })

    img.addEventListener('mousemove', e => {
        if(move == 1){
            img.style.left = (e.pageX - (75 / 2)) + 'px'
            img.style.top = (e.pageY - (75 / 2)) + 'px'
        }
    })

    img.addEventListener('mouseup', e => {
        

        // Busca la Pieza
        const divFind = divs.find(div => 
            div.offsetLeft + 75 >= e.pageX && 
            div.offsetTop + 75 >= e.pageY && 
            div.offsetLeft <= e.pageX && 
            div.offsetTop <= e.pageY
        )
        movementPiece(img,divFind)
    })
})
