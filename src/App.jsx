import { useEffect, useState } from "react";
import Box from "./components/box";
import LineTo from 'react-lineto';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [history, setHistory] = useState([{ board: Array(9).fill(null), player: null }]);
  const [undo, setUndo] = useState({ X: 1, O: 1 });
  const [IsRemoving, setIsRemoving] = useState(true);
  const [winner, setWinner] = useState({
    coordinate: [],
    player: null,
    isDraw: false
  });
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [countdown, setCountdown] = useState(3);

  const highlightClass = (player) => {
    if (player === 'X') return 'bg-[#E45651] border border-solid border-[#E45651] bg-opacity-10';
    if (player === 'O') return 'bg-[#2475C5] border border-solid border-[#2475C5] bg-opacity-10';
  }

  const handleClick = (index) => {
    if (board[index] !== null || Boolean(winner.player)) return;

    const newBoard = [...board];

    newBoard[index] = turn === 'X' ? 'X' : 'O';
    setTurn(turn === 'X' ? 'O' : 'X');
    setBoard(newBoard);
    // console.log(turn);
    if (IsRemoving) {
      setIsRemoving(false);
    }

    checkWinner(newBoard);

    setHistory([...history, { board: newBoard, player: turn }]);

  }

  const checkWinner = (board) => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner({
          coordinate: [a, b, c],
          player: board[a]
        });
        setScore({ ...score, [board[a]]: score[board[a]] + 1 });
        setIsEnded(true);
      }
    }

    if (board.every((item) => item !== null)) {
      setIsEnded(true);
      setWinner({
        coordinate: [],
        player: null,
        isDraw: true
      });
    }
  }

  const handleUndo = () => {
    if (history.length > 1 && undo[turn] > 0 && !isEnded && !Boolean(winner.player)) {
      const prevBoard = history[history.length - 2].board;
      setBoard(prevBoard);
      setUndo({ ...undo, [turn]: undo[turn] - 1 });
      setTurn(turn === 'X' ? 'O' : 'X');
      setHistory(history.slice(0, -1));
      setIsRemoving(true);
    }
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setTurn('X')
    setHistory([{ board: Array(9).fill(null), player: null }])
    setUndo({ X: 1, O: 1 })
    setIsRemoving(true);
    setWinner({
      coordinate: [],
      player: null
    })
    setIsEnded(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('waiting')

      const nullIndex = board.reduce((acc, item, index) => {
        if (item === null) acc.push(index);
        return acc;
      }, []);

      const randomIndex = nullIndex[Math.floor(Math.random() * nullIndex.length)];

      if (!Boolean(winner.player) && !isEnded) {
        handleClick(randomIndex);
      }
    }, 3000);

    return () => {
      console.log("clear")
      clearTimeout(timer);
      setCountdown(3)
    }
  }, [board])

  useEffect(() => {
    const timer2 = setInterval(() => {
      console.log(countdown);
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer2);
    }
  }, [countdown, board])

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(3);
    }
  }, [countdown])
  
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col max-w-3xl mx-auto">
      <h1 className="font-bold text-3xl mb-9">Tic-Tac-Toe</h1>
      <div className="flex max-w-xs mx-auto w-full my-2 p-1 justify-between items-center">
        <div className={`${turn === 'X' ? 'border-[#e45651]' : 'border-transparent'} border border-solid flex p-2 bg-[#E45651] bg-opacity-20 rounded items-center`}>
          <p className="text-2xl font-semibold mr-2 px-1 bg-[#E45651] bg-opacity-10 w-fit rounded">{score.X}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect x="25.9779" y="3" width="4" height="32.4957" transform="rotate(45 25.9779 3)" fill="#E45651" />
            <rect width="4" height="32.4957" transform="matrix(-0.707107 0.707107 0.707107 0.707107 6.32751 3)" fill="#E45651" />
          </svg>
        </div>
        {
          winner.isDraw ? <p className="text-2xl">Draw</p> : winner.player ? <p className="text-2xl">{winner.player} Win</p> : <p className="text-2xl">0{countdown}</p>
        }
        <div className={`${turn === 'O' ? 'border-[#2475C5]' : 'border-transparent'} border border-solid flex p-2 bg-[#2475C5] bg-opacity-20 rounded items-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none"> 
              <circle cx="16" cy="16" r="12" stroke="#2475C5" strokeWidth="4"/>
          </svg>
          <p className="text-2xl font-semibold ml-2 px-1 bg-[#2475C5] bg-opacity-10 w-fit rounded">{score.O}</p>
        </div>
      </div>
      <div className="flex flex-wrap w-full max-w-xs mx-auto">
        {
          board.map((_, index) => {
            return (
              <Box key={index} value={board[index]} point={winner.coordinate[0] === index ? 'A' : winner.coordinate[2] === index && 'B'} highlight={winner.coordinate.includes(index) && highlightClass(winner.player)} onClick={() => handleClick(index)} allowCLick={Boolean(winner.player) || isEnded} />
            )
          })
        }
      </div>
      <div className="flex max-w-xs mx-auto w-full mt-4">
        <button onClick={reset} className="uppercase font-bold p-1 basis-1/2">
          <p className="bg-[#12161f] hover:bg-[#E45651] py-3 duration-75 rounded flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" height="28" className="mr-2" viewBox="0 96 960 960" width="28" fill="white"><path d="M451 934q-123-10-207-101t-84-216q0-77 35.5-145T295 361l43 43q-56 33-87 90.5T220 617q0 100 66 173t165 84v60Zm60 0v-60q100-12 165-84.5T741 617q0-109-75.5-184.5T481 357h-20l60 60-43 43-133-133 133-133 43 43-60 60h20q134 0 227 93.5T801 617q0 125-83.5 216T511 934Z" /></svg>
            {isEnded ? 'Play Again' : 'Reset'}
          </p>
        </button>
        <button onClick={handleUndo} className={`uppercase font-bold p-1 basis-1/2 ${undo[turn] < 1 | IsRemoving | isEnded | Boolean(winner.player) && 'pointer-events-none text-gray-500'}`}>
          <p className="bg-[#12161f] hover:bg-[#2475C5] py-3 duration-75 rounded flex items-center justify-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 96 960 960" width="32" className={undo[turn] < 1 | IsRemoving | isEnded | Boolean(winner.player) ? 'fill-gray-500 mr-3' : 'fill-white mr-3'}><path d="M280 856v-60h289q70 0 120.5-46.5T740 634q0-69-50.5-115.5T569 472H274l114 114-42 42-186-186 186-186 42 42-114 114h294q95 0 163.5 64T800 634q0 94-68.5 158T568 856H280Z" /></svg>
            undo
          </p>
        </button>
      </div>
      {
        Boolean(winner.player) && <LineTo from="A" to="B" delay={100} borderColor={winner.player === 'X' ? '#E45651' : '#2475C5'} borderWidth={5} />
      }
    </div>
  );
}

export default App;