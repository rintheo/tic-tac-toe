const game = (() => {
    const _cell = () => {
        let rowPosition = '';
        let columnPosition = '';
        let value = '';
        
        const setPosition = (row, column) => {
            rowPosition = row;
            columnPosition = column;
        } 
        const getRowPosition = () => rowPosition;
        const getColumnPosition = () => columnPosition;

        const setValue = () => value = _activePlayer.mark;
        const getValue = () => value;

        return {
            setPosition,
            getRowPosition,
            getColumnPosition,
            setValue,
            getValue,

        }
    }

    const _gameBoard = (() => {
        const rows = 3,
              columns = 3,
              board = [];
        
        const resetBoard = () => {
            for (let i = 0; i < rows; i++) {
                board[i] = [];
                for (let j = 0; j < columns; j++) {
                    board[i].push(_cell());
                    board[i][j].setPosition(i, j);
                }
            }
        }
    
        // Initialize the board for the first game
        resetBoard();
    
        const getRowCount = () => rows;
        const getColumnCount = () => columns;
        const getBoard = () => board;
        const printBoard = () => {
            const printedBoard = board.map(row => row.map(cell => cell.getValue()));
            console.table(printedBoard);
        } 
    
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
    ]

    const _setPlayerNames = (player1, player2) => {
        _players[0].name = player1;
        _players[1].name = player2;
    }

    let _activePlayer = _players[0];
    const _switchActivePlayer = () => _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
    const _printActivePlayer = () => console.log(`It's ${_activePlayer.name}'s turn!`);

    let _startingPlayer = _players[0];
    const _switchStartingPlayer = () => {
        _startingPlayer = (_startingPlayer === _players[0]) ? _players[1] : _players[0];
        _activePlayer = _startingPlayer;
    } 
    const _resetStartingPlayer = () => _activePlayer = _players[0];

    let _winningPlayer = '';
    let _winningLine = [];

    let _gameOver = false;

    const _resetScores = () => {
        _players[0].score = 0;
        _players[1].score = 0;
    }

    const playRound = (row, column) => {
        if (_gameOver === true) return;
        if (_gameBoard.getBoard()[row][column].getValue() !== '') return;

        _gameBoard.getBoard()[row][column].setValue();
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
        let check = false;

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

        console.log(testLines.map(row => row.map(cell => cell.getValue())))

        // Check logged testLines for winning condition
        for (testLine of testLines) {
            if (testLine.every(cell => (cell.getValue() !== '') && (cell.getValue() === testLine[0].getValue()))) {
                _winningLine.push(testLine);
                for (_player of _players) {
                    if (_player.mark === testLine[0].getValue()) {
                        _winningPlayer = _player;
                        check = true;
                    }
                }
            }
        }
        return check;
    }

    const _checkForDraw = () => {
        if (_gameBoard.getBoard().flat().every(cell => cell.getValue() !== '')) {
            return true;
        }
    }

    const restartGame = () => {
        _gameOver = false;
        _winningLine = [];
        _winningPlayer = '';
        _gameBoard.resetBoard();
    }

    const _titleScreenController = (() => {
        const titleScreen = document.querySelector('.title-screen');
        const playButton = document.querySelector('#playButton');
        const vsButtons = document.querySelector('.vs');
        const vsPlayerButton = document.querySelector('#vsPlayerButton');
        const vsAIButton = document.querySelector('#vsAIButton');
        const homeButton = document.querySelector('#homeButton');
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('.form');
        const player1Name = document.querySelector('#player1NameInput');
        const player2Name = document.querySelector('#player2NameInput');
        const submitNamesButton = document.querySelector('#submitNamesButton');

        const playGame = (e) => {
            playButton.classList.add('visibility-hidden');
            playButton.addEventListener('transitionend', () => {
                vsButtons.classList.remove('visibility-hidden');
            }, {once: true});
        }
        playButton.addEventListener('click', playGame);
        
        const playVersusPlayer = (e) => {
            vsButtons.classList.add('visibility-hidden');
            vsButtons.addEventListener('transitionend', () => {
                formContainer.classList.remove('visibility-hidden');
            }, {once: true})
        }
        vsPlayerButton.addEventListener('click', playVersusPlayer);

        const submitNamesStartGame = (e) => {
            let player1 = player1Name.value !== '' ? player1Name.value : 'Player One';
            let player2 = player2Name.value !== '' ? player2Name.value : 'Player Two';
            _setPlayerNames(player1, player2);
            _gameScreenController.resetGame();         
            titleScreen.classList.add('visibility-hidden');
            titleScreen.addEventListener('transitionend', () => {
                formContainer.classList.add('visibility-hidden');
                form.reset();
            }, {once: true});            
            e.preventDefault();
        }
        submitNamesButton.addEventListener('click', submitNamesStartGame);

        const returnToTitle = (e) => {
            _dialogBoxController.showDialog(homeButton.dataset.dialog ,() => {
                titleScreen.classList.remove('visibility-hidden');
                playButton.classList.remove('visibility-hidden');
                titleScreen.addEventListener('transitionend', () => {
                    _gameScreenController.resetGame();                
                }, {once: true});   
            });        
        }
        homeButton.addEventListener('click', returnToTitle);        
    })();
    
    const _dialogBoxController = (() => {
        const dialogBox = document.querySelector('.dialog-box-container');
        const dialog = document.querySelector('.dialog');
        const yesButton = document.querySelector('#yesButton');
        const noButton = document.querySelector('#noButton');

        const showDialog = (text, func) => {
            dialog.textContent = text;
            dialogBox.classList.remove('visibility-hidden');
            yesButton.addEventListener('click', func, {once: true});
        }

        const hideDialog = () => {
            dialogBox.classList.add('visibility-hidden');
        }

        yesButton.addEventListener('click', hideDialog);
        noButton.addEventListener('click', hideDialog);

        return {
            showDialog,
        }
    })();

    const _gameScreenController = (() => {
        const mainTop = document.querySelector('.main-top>p');
        const board = document.querySelector('.board');
        const playAgainButton = document.querySelector('#playAgainButton');
        const resetButton = document.querySelector('#resetButton');
        const player1Name = document.querySelector('#player1Name');
        const player1Score = document.querySelector('#player1Score');
        const player2Name = document.querySelector('#player2Name');
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

        console.log(player1Name);

        const displayPlayerNames = () => {
            player1Name.textContent = _players[0].name;
            player2Name.textContent = _players[1].name;
        }

        const displayPlayerScores = () => {
            player1Score.textContent = _players[0].score;
            player2Score.textContent = _players[1].score;
        }

        const clickBoard = (e) => {            
            if (playRound(e.currentTarget.dataset.row, e.currentTarget.dataset.column)) {
                refreshScreen();
                if (_gameOver) {
                    if (_winningPlayer !== '') {
                        displayWinningPlayer();
                        highlightWinningLine();
                    }
                    else {
                        displayDraw();
                    }
                    displayPlayAgain();
                    return;
                }
                animateClickedCell(e.currentTarget.dataset.row, e.currentTarget.dataset.column);
                return
            }
            if (!_gameOver) {
                animateInvalidCell(e.currentTarget.dataset.row, e.currentTarget.dataset.column);
            }
        }

        const animateClickedCell = (row, column) => {
            const clickedCell = document.querySelector(`[data-row='${row}'][data-column='${column}']`)
            clickedCell.classList.add('clicked');
            clickedCell.addEventListener('animationend', () => {clickedCell.classList.remove('clicked')})
        }

        const animateInvalidCell = (row, column) => {
            const invalidCell = document.querySelector(`[data-row='${row}'][data-column='${column}']`)
            invalidCell.classList.add('invalid');
            invalidCell.addEventListener('animationend', () => {invalidCell.classList.remove('invalid')})
        }

        const clearBoard = () => {
            while (board.firstChild) {board.removeChild(board.firstChild)};
        }
    
        const generateBoard = () => {
            for (let i = 0; i < _gameBoard.getRowCount(); i++) {
                for (let j = 0; j < _gameBoard.getColumnCount(); j++) {
                    const button = document.createElement('button');
                    const span = document.createElement('span');
                    button.dataset.row = i;
                    button.dataset.column = j;
                    button.classList.add('cell');
                    if ((_gameBoard.getBoard()[i][j].getValue() === '') && (!_gameOver)) {
                        _activePlayer.mark === 'o' ? button.classList.add('one') : button.classList.add('two');
                    }
                    span.textContent = _gameBoard.getBoard()[i][j].getValue();
                    button.addEventListener('click', clickBoard);
                    button.appendChild(span);
                    board.appendChild(button);
                }           
            }
        }

        const highlightWinningLine = () => {
            for (line of _winningLine) {
                for (cell of line) {
                    const winningCell = document.querySelector(`[data-row='${cell.getRowPosition()}'][data-column='${cell.getColumnPosition()}']`);
                    winningCell.classList.add('winner');
                }
            }
        }

        const resetGame = () => {
            _resetScores();
            _resetStartingPlayer();
            restartGame();
            refreshScreen();
            playAgainButton.classList.add('visibility-hidden');
        }

        const resetButtonClick = () => {
            _dialogBoxController.showDialog(resetButton.dataset.dialog, resetGame);
        }
        resetButton.addEventListener('click', resetButtonClick);

        const playAgain = () => {
            _switchStartingPlayer();
            restartGame();
            refreshScreen();
            playAgainButton.classList.add('visibility-hidden');
        }
        playAgainButton.addEventListener('click', playAgain);

        const refreshScreen = () => {
            displayActivePlayer();
            clearBoard();
            generateBoard();
            displayPlayerScores();
            displayPlayerNames();
        }
        
        // Initialize for the first game
        refreshScreen();

        return {
            resetGame,
        }
    })();

    return {
        playRound, // Can be removed later
        restartGame,
    }
})();

document
    .querySelector('#currentYear')
    .textContent = new Date().getFullYear();