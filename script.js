const game = (() => {
    const _gameBoard = (() => {
        const _rows = 3,
              _columns = 3,
              _board = [
                // [1,2,3],
                // [4,5,6],
                // [7,8,9],
              ];
        
        const resetBoard = () => {
            for (let i = 0; i < _rows; i++) {
                _board[i] = [];
                for (let j = 0; j < _columns; j++) {
                    _board[i].push('');
                }
            }
        }
    
        // Initialize the board for the first game
        resetBoard();
    
        const getRowCount = () => _rows;
        const getColumnCount = () => _columns;
        const getBoard = () => _board;
        const printBoard = () => console.log(_board); // For console version only
    
        return {
            getRowCount,
            getColumnCount,
            getBoard,
            printBoard, // For console version only
            resetBoard,
        }
    })();

    const _players = [
        {
            name: 'Player One',
            mark: 'o',
            score: 0,
        },
        {
            name: 'Player Two',
            mark: 'x',
            score: 0,
        },
    ];

    let _activePlayer = _players[0];
    const _switchActivePlayer = () => _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
    const _printActivePlayer = () => console.log(`It's ${_activePlayer.name}'s turn!`);

    let _winningPlayer = '';

    let _gameOver = false;

    const playRound = (row, column) => {
        if (_gameOver === true) return;
        if (_gameBoard.getBoard()[row][column] !== '') return;

        _gameBoard.getBoard()[row][column] = _activePlayer.mark;
        _gameBoard.printBoard(); // For console version only

        // Return true for successful round

        if (_checkForWinner()) {
            _gameOver = true;
            _winningPlayer.score += 1;
            console.log(`Winner is ${_winningPlayer.name}!`);
            return true;
        }      
                
        if (_checkForDraw()) {
            _gameOver = true;
            console.log('draw');
            return true;
        }

        _switchActivePlayer();
        _printActivePlayer();

        return true;
    }
    
    const _checkForWinner = () => {
        let testLines = [];
        let testLineIndex = 0;

        // Log each row 
        for (let i = 0; i < _gameBoard.getRowCount(); i++) {
            testLines[testLineIndex] = [];
            for (let j = 0; j < _gameBoard.getColumnCount(); j++) {
                testLines[testLineIndex].push(_gameBoard.getBoard()[i][j]);
            }
            testLineIndex++;
        }        

        // Log each column 
        for (let j = 0; j < _gameBoard.getColumnCount(); j++) {
            testLines[testLineIndex] = [];
            for (let i = 0; i < _gameBoard.getRowCount(); i++) {
                testLines[testLineIndex].push(_gameBoard.getBoard()[i][j]);
            }
            testLineIndex++;
        }

        // Log back diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <_gameBoard.getRowCount(); i++) {
            testLines[testLineIndex].push(_gameBoard.getBoard()[i][i]);
        }
        testLineIndex++;

        // Log front diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <_gameBoard.getRowCount(); i++) {
            testLines[testLineIndex].push(_gameBoard.getBoard()[i][_gameBoard.getColumnCount() - 1 - i]);
        }

        // Check logged testLines for winning condition
        for (testLine of testLines) {
            if (testLine.every(cell => (cell !== '') && (cell === testLine[0]))) {
                for (_player of _players) {
                    if (_player.mark === testLine[0]) {
                        _winningPlayer = _player;
                        return true;
                    }
                }
            }
        }
    }

    const _checkForDraw = () => {
        if (_gameBoard.getBoard().flat().every(cell => cell !== '')) {
            return true;
        }
    }

    const restartGame = () => {
        _gameOver = false;
        _winningPlayer = '';
        _gameBoard.resetBoard();
    }

    const _screenController = (() => {
        const mainTop = document.querySelector('.main-top>p');
        const board = document.querySelector('.board');
        const playAgainButton = document.querySelector('#playAgainButton');
        const resetButton = document.querySelector('#resetButton');
        const player1Score = document.querySelector('#player1Score');
        const player2Score = document.querySelector('#player2Score');

        const displayActivePlayer = () => {

            mainTop.textContent = `${_activePlayer.name}'s turn`;
        }

        const displayWinningPlayer = () => {
            mainTop.textContent = `${_winningPlayer.name} wins!!`;
        }

        const displayDraw = () => {
            mainTop.textContent = `Draw!!`;
        }

        const displayPlayAgain = () => {
            playAgainButton.classList.remove('visibility-hidden');
        }

        const displayPlayerScores = () => {
            player1Score.textContent = _players[0].score;
            player2Score.textContent = _players[1].score;
        }

        const refreshScreen = () => {
            displayActivePlayer();
            clearBoard();
            generateBoard();
            displayPlayerScores();
        }

        const clickBoard = (e) => {
            if (playRound(e.target.dataset.row, e.target.dataset.column)) {
                refreshScreen();
                if (_gameOver) {
                    (_winningPlayer !== '') ? displayWinningPlayer() : displayDraw();
                    displayPlayAgain();
                }
                // animateCell(e.target.dataset.row, e.target.dataset.column);
            }
        }

        // const animateCell = (row, column) => {
        //     const clickedCell = document.querySelector(`[data-row='${row}'][data-column='${column}']`)
        //     clickedCell.classList.add('clicksed');
        // }

        const clearBoard = () => {
            while (board.firstChild) {board.removeChild(board.firstChild)};
        }
    
        const generateBoard = () => {
            for (let i = 0; i < _gameBoard.getRowCount(); i++) {
                for (let j = 0; j < _gameBoard.getColumnCount(); j++) {
                    const button = document.createElement('button');
                    button.dataset.row = i;
                    button.dataset.column = j;
                    button.classList.add('cell');
                    if (_gameBoard.getBoard()[i][j] === '') {
                        _activePlayer.mark === 'o' ? button.classList.add('one') : button.classList.add('two');
                    }
                    button.textContent = _gameBoard.getBoard()[i][j];
                    button.addEventListener('click', clickBoard);
                    board.appendChild(button);
                }           
            }
        }

        const playAgain = () => {
            restartGame();
            refreshScreen();
            playAgainButton.classList.add('visibility-hidden');
        }
        playAgainButton.addEventListener('click', playAgain);

        const resetGame = () => {
            _players[0].score = 0;
            _players[1].score = 0;
            _activePlayer = _players[0];
            playAgain();
        }
        resetButton.addEventListener('click', resetGame);
        
        // Initialize for the first game
        displayActivePlayer();
        generateBoard();

    })();

    return {
        playRound, // Can be removed later
        restartGame,
    }
})();
