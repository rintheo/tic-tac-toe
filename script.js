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
                    _board[i].push('-');
                }
            }
        }
    
        // Initialize the board for the first game
        resetBoard();
    
        const getBoard = () => _board;
        const printBoard = () => console.log(_board); // For console version only
    
        return {
            getBoard,
            printBoard, // For console version only
            resetBoard,
        }
    })();

    const _players = [
        {
            name: 'Player One',
            mark: 'o',
        },
        {
            name: 'Player Two',
            mark: 'x'
        },
    ];

    let _activePlayer = _players[0];
    const getActivePlayer = () => _activePlayer;
    const _switchActivePlayer = () => _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
    const _printActivePlayer = () => console.log(`It's ${_activePlayer().name}'s turn!`);

    let _winningPlayer = '';
    const getWinningPlayer = () => _winningPlayer;

    let _gameOver = false;

    const playRound = (row, column) => {
        if (_gameOver === true) return;
        if (_gameBoard.getBoard()[row][column] !== '-') return;

        _gameBoard.getBoard()[row][column] = _activePlayer().mark;
        _gameBoard.printBoard(); // For console version only

        if (_checkForWinner()) {
            _gameOver = true;
            console.log(`Winner is ${_winningPlayer.name}!`);
            return;
        }      
                
        if (_checkForDraw()) {
            _gameOver = true;
            console.log('draw');
            return;
        }

        _switchActivePlayer();
        _printActivePlayer();
    }
    
    const _checkForWinner = () => {
        const rows = _gameBoard.getBoard().length;
        const columns = _gameBoard.getBoard()[0].length;
        let testLines = [];
        let testLineIndex = 0;

        // Log each row 
        for (let i = 0; i < rows; i++) {
            testLines[testLineIndex] = [];
            for (let j = 0; j < columns; j++) {
                testLines[testLineIndex].push(_gameBoard.getBoard()[i][j]);
            }
            testLineIndex++;
        }        

        // Log each column 
        for (let j = 0; j < columns; j++) {
            testLines[testLineIndex] = [];
            for (let i = 0; i < rows; i++) {
                testLines[testLineIndex].push(_gameBoard.getBoard()[i][j]);
            }
            testLineIndex++;
        }

        // Log back diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <rows; i++) {
            testLines[testLineIndex].push(_gameBoard.getBoard()[i][i]);
        }
        testLineIndex++;

        // Log front diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <rows; i++) {
            testLines[testLineIndex].push(_gameBoard.getBoard()[i][columns - 1 - i]);
        }

        // Check logged testLines for winning condition
        for (testLine of testLines) {
            if (testLine.every(cell => (cell !== '-') && (cell === testLine[0]))) {
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
        if (_gameBoard.getBoard().flat().every(cell => cell !== '-')) {
            return true;
        }
    };

    const resetGame = () => {
        _gameOver = false;
        _winningPlayer = '';
        _gameBoard.resetBoard();
    };

    return {
        playRound,
        resetGame,
        getWinningPlayer,
        getActivePlayer,
    }
})();
