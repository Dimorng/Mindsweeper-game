export const CARD_STATUS = {
  HIDDEN: "hidden",
  NUMBER: "number",
  MARKED: "marked",
  MINE: "mine",
}

export function generateGameBoard(BOARD_DIMENSION, MINE_NUMBER) {
  const mines = generateMineCard(BOARD_DIMENSION, MINE_NUMBER)

  const board = []
  for (let y = 0; y < BOARD_DIMENSION; y++) {
    const row = []
    for (let x = 0; x < BOARD_DIMENSION; x++) {
      const cardElement = document.createElement("div")
      cardElement.dataset.status = CARD_STATUS.HIDDEN
      const card = {
        cardElement,
        x,
        y,
        get status() {
          return this.cardElement.dataset.status
        },
        set status(value) {
          this.cardElement.dataset.status = value
        },
        mine: mines.some(checkRepeat.bind(null, { x, y })),
      }
      row.push(card)
    }
    board.push(row)
  }
  return board
}

export function revealCard(board, card) {
  if (card.status !== CARD_STATUS.HIDDEN && card.status !== CARD_STATUS.MARKED)
    return

  if (card.mine) {
    card.status = CARD_STATUS.MINE
    return
  }

  card.status = CARD_STATUS.NUMBER

  const adjecentCard = getAdjecentCard(card, board)
  const MINECount = adjecentCard.filter(c => c.mine).length

  if (MINECount === 0) {
    adjecentCard.forEach(revealCard.bind(null, board))
    return
  }
  card.cardElement.textContent = MINECount
}

export function markCard(card) {
  if (card.status !== CARD_STATUS.HIDDEN) return

  card.status = CARD_STATUS.MARKED
}

export function checkWin(board) {
  return board.every(row => {
    return row.every(card => {
      return (
        (card.mine &&
          (card.status === CARD_STATUS.HIDDEN ||
            card.status === CARD_STATUS.MARKED)) ||
        card.status === CARD_STATUS.NUMBER
      )
    })
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(c => c.status === CARD_STATUS.MINE)
  })
}

function getAdjecentCard({ x, y }, board) {
  const cards = []
  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      const card = board?.[y + yOffset]?.[x + xOffset]
      if (card == null) continue
      cards.push(card)
    }
  }
  return cards
}

function generateMineCard(BOARD_DIMENSION, MINE_NUMBER) {
  const mines = []
  while (mines.length < MINE_NUMBER) {
    const mine = {
      x: getRandomNumber(BOARD_DIMENSION),
      y: getRandomNumber(BOARD_DIMENSION),
    }
    const isRepeat = mines.some(checkRepeat.bind(null, mine))
    if (isRepeat) continue
    mines.push(mine)
  }
  return mines
}

function checkRepeat(coordinate, { x, y }) {
  return coordinate.x === x && coordinate.y === y
}

function getRandomNumber(maxNumber) {
  return Math.floor(Math.random() * maxNumber)
}
