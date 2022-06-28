import {
  generateGameBoard,
  CARD_STATUS,
  revealCard,
  markCard,
  checkWin,
  checkLose,
} from "./gameLogic.js"

const boardElement = document.querySelector(".game-board")
const mineCount = document.querySelector("[data-mine-count]")

const gameResult = document.querySelector("[data-game-result]")

const BOARD_DIMENSION = 10
const MINE_NUMBER = 10

const board = generateGameBoard(BOARD_DIMENSION, MINE_NUMBER)
boardElement.style.setProperty("--board-column", BOARD_DIMENSION)

mineCount.textContent = MINE_NUMBER

board.forEach(row => {
  row.forEach(card => {
    const { cardElement } = card
    boardElement.appendChild(cardElement)

    cardElement.addEventListener("click", () => {
      revealCard(board, card)
      const win = checkWin(board)
      const lose = checkLose(board)

      if (win || lose) endGame()

      if (win) {
        gameResult.textContent = "You Win"
      }

      if (lose) {
        gameResult.textContent = "You Lose"
      }
    })

    cardElement.addEventListener("contextmenu", e => {
      e.preventDefault()

      markCard(card)

      mineCount.textContent = updateMineCount()
    })
  })
})

function endGame() {
  boardElement.addEventListener("click", stopPropagation, { capture: true })

  boardElement.addEventListener("contextmenu", stopPropagation, {
    capture: true,
  })

  board.forEach(row => {
    row.forEach(c => (c.cardElement.style.cursor = "not-allowed"))
  })

  boardElement.style.opacity = "30%"
}

function stopPropagation(e) {
  e.stopPropagation()
  e.preventDefault()
}

function updateMineCount() {
  const mineLeft =
    MINE_NUMBER -
    board.reduce((count, row) => {
      return count + row.filter(c => c.status === CARD_STATUS.MARKED).length
    }, 0)
  return mineLeft
}
