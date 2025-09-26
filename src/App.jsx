import {useState} from "react"
import { languages} from "./utils/languages"
import { getFarewellText } from "./utils/utils"
import { getRandomWord } from "./utils/utils.js"
import ReactConfetti from "react-confetti"
import clsx from "clsx"
export default function App () {
  // state variables
  
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  
   // constants
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
// Derived variables

  const lastGuess =  guessedLetters[guessedLetters.length - 1]
  const isLastGuessWrong = lastGuess && !getWordArr(currentWord).includes(lastGuess)
  const gameWon = getWordArr(currentWord).every(letter => guessedLetters.includes(letter))
  const gameLost = getWrongGuessCount() >= languages.length-1

  const isGameOver = gameLost || gameWon

  // Create chip elements from the list of languages 
  const chips = languages.map((chip, index) => {
    const style = {
      backgroundColor: chip.backgroundColor, 
      color: chip.color
    }
// conditional class names to the chips
    const className = clsx({
      "chip": true,
      "lost": index < getWrongGuessCount()
    })

    return (
      <span
        className={className}
        key={chip.name}
        style={style}      
      >{chip.name}</span>
    )
  })
// to return an array of characters from a word string
  function getWordArr(word) {
    const wordArr = []
    for (let i = 0; i < word.length; i++){
      wordArr.push(word[i].toUpperCase())
    }
    return wordArr
  }

// Spans representing word to be guessed 
  const wordSpans = getWordArr(currentWord).map(
    (letter, id) => {
      const letterMissed = gameLost && !guessedLetters.includes(letter)
      const className = clsx({letter: true, missed: letterMissed})
      return (
        <span
          key={id}
          className={className}
        >{gameLost ? letter : (guessedLetters.includes(letter) ? letter: "")}</span>
      )
    } 
  )
// creating keyboard elements 
  const keyboardElements = getWordArr(alphabet).map(
    (letter) => {    
      const isGuessed = guessedLetters.includes(letter)
      const isRight = isGuessed && getWordArr(currentWord).includes(letter)
      const isWrong = isGuessed && !getWordArr(currentWord).includes(letter)
      const className = clsx({
        right: isRight,
        wrong: isWrong
      }
      )
      return(
        <button 
          className={className}
          key={letter}
          disabled={isGameOver}
          onClick={() => addGuessLetter(letter)}
        >{letter}</button>
      )
    }
  )

  function getWrongGuessCount(){
    let wrongGuessCount = 0
    for (let i = 0; i < guessedLetters.length; i++) {
      if (!getWordArr(currentWord).includes(guessedLetters[i])){
        wrongGuessCount += 1
      } 
    }
    return wrongGuessCount
  }



  function addGuessLetter(letter) {
    setGuessedLetters(
      (prev) => {
        return prev.includes(letter) ? prev : [...prev, letter]      
      }
    )
    
  }

  const statusClassName = clsx(
    {
      status: true,
      won: gameWon,
      lost: getWrongGuessCount() >= languages.length-1,
      pending: !isGameOver && isLastGuessWrong
    }
  )

  function getStatusText() {
    if(!isGameOver && isLastGuessWrong) {
      const index = getWrongGuessCount()
      return (
        <p>{getFarewellText(languages[index].name)}</p>
      )
    }else if(gameWon) {
      return (
        <>
          <h3>You won</h3>
          <p>Well done</p>
        </>
      )
    }else if(gameLost){
      return (
        <>
          <h3>You lost</h3>
          <p>Time to start learning assembly</p>
        </>
      )
    }
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }
  
  return(
    <main>   
      {
        gameWon && 
        <ReactConfetti
          recycle={false}
        />
      }   
      <header className="header">
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>   
      <section className={statusClassName}>
          {getStatusText()}
      </section>
      <div className="chips">
        {chips}
      </div>
      <div className="word-container">
        {wordSpans}
      </div>
      <div className="keyboard">
        {keyboardElements}
      </div>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main>
  )
}