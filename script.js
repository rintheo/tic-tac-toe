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
        const getPosition = () => [rowPosition, columnPosition];

        const setValue = (mark) => value = mark;
        const getValue = () => value;

        return {
            setPosition,
            getRowPosition,
            getColumnPosition,
            getPosition,
            setValue,
            getValue,
        }
    }

    const _gameBoard = () => {
        let rows = 3,
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
    };

    const _board = _gameBoard();


    // temporary end state board =================================================
    const ENDSTATE = () => {
        _board.getBoard()[0][2].setValue('x');
        _board.getBoard()[1][0].setValue('x');
        _board.getBoard()[2][0].setValue('x');
        _board.getBoard()[2][1].setValue('o');
        _board.getBoard()[2][2].setValue('o');

        //remember to put at [0][0] 'o' to initialize this end state
    }

    const ENDSTATEFATAL = () => {
        _board.getBoard()[0][1].setValue('o');
        _board.getBoard()[1][2].setValue('o');
        _board.getBoard()[2][0].setValue('x');
        _board.getBoard()[2][1].setValue('x');

        //remember to put at [2][2] 'o' to initialize this end state
    }

    

    // ============================================================================


    // Initialize the board for the first game
    _board.resetBoard();

    const _players = [
        {
            name: 'Player One',
            mark: 'o',
            score: 0,
            isAI: false,
        },
        {
            name: 'Player Two',
            mark: 'x',
            score: 0,
            isAI: false,
            AIDifficulty: 'Easy',
        },
    ]

    const _playVersusPlayer = () => {_players[1].isAI = false}
    const _playVersusAI = () => {_players[1].isAI = true}
    const _toggleAIDifficulty = () => {
        _players[1].AIDifficulty = _players[1].AIDifficulty !== 'Easy' ? 'Easy' : 'Hard'; 
    }

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
        if (_board.getBoard()[row][column].getValue() !== '') return;

        _board.getBoard()[row][column].setValue(_activePlayer.mark);
        // board.printBoard(); // For console version only

        // Return true for successful round
        if (_checkForWinner(_board)) {
            _gameOver = true;
            _winningPlayer.score += 1;
            console.log(`Winner is ${_winningPlayer.name}!`);
            return true;
        }        
                
        if (_checkForDraw(_board)) {
            _gameOver = true;
            console.log('draw');
            return true;
        } 

        _switchActivePlayer();
        // _printActivePlayer(); // for debugging

        return true;
    }
    
    const _checkForWinner = (board) => {
        let testLines = [];
        let testLineIndex = 0;
        let check = false;

        // Log each row 
        for (let i = 0; i < board.getRowCount(); i++) {
            testLines[testLineIndex] = [];
            for (let j = 0; j < board.getColumnCount(); j++) {
                testLines[testLineIndex].push(board.getBoard()[i][j]);
            }
            testLineIndex++;
        }        

        // Log each column 
        for (let j = 0; j < board.getColumnCount(); j++) {
            testLines[testLineIndex] = [];
            for (let i = 0; i < board.getRowCount(); i++) {
                testLines[testLineIndex].push(board.getBoard()[i][j]);
            }
            testLineIndex++;
        }

        // Log back diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <board.getRowCount(); i++) {
            testLines[testLineIndex].push(board.getBoard()[i][i]);
        }
        testLineIndex++;

        // Log front diagonal
        testLines[testLineIndex] = [];
        for (let i = 0; i <board.getRowCount(); i++) {
            testLines[testLineIndex].push(board.getBoard()[i][board.getColumnCount() - 1 - i]);
        }
        
        // Check logged testLines for winning condition
        for (testLine of testLines) {
            if (testLine.every(cell => (cell.getValue() !== '') && (cell.getValue() === testLine[0].getValue()))) {
                if(!_AI.isMinimaxRunning()) {_winningLine.push(testLine)};
                for (_player of _players) {
                    if (_player.mark === testLine[0].getValue()) {
                        if(!_AI.isMinimaxRunning()) {_winningPlayer = _player};                        
                        check = true;
                    }
                }
            }
        }
        // console.log(_winningLine);
        return check;
    }

    const _checkForDraw = (board) => {
        if (board.getBoard().flat().every(cell => cell.getValue() !== '')) {
            return true;
        }
    }

    const restartGame = () => {
        _gameOver = false;
        _winningLine = [];
        _winningPlayer = '';
        _board.resetBoard();
    }

    const _AI = (() => {
        // let instanceBoard = _gameBoard();
        
        const copyCurrentBoardState = (board) => {
            let copiedBoard = _gameBoard();
            // instanceBoard.getBoard().splice(0, instanceBoard.getBoard().length);
            for (let i = 0; i < copiedBoard.getRowCount(); i++) {
                copiedBoard.getBoard()[i] = [];
                for (let j = 0; j < copiedBoard.getColumnCount(); j++) {
                    copiedBoard.getBoard()[i].push(_cell());
                    copiedBoard.getBoard()[i][j].setValue(board.getBoard()[i][j].getValue())
                    copiedBoard.getBoard()[i][j].setPosition(i, j);
                }
            }
            return copiedBoard
        }

        const instanceStartingActivePlayer = _players[1];
        const switchInstanceActivePlayer = (player) => {
            return player === _players[0] ? _players[1] : _players[0];
        }

        const generatePossibleChoices = (board) => {
            const choices = [];
            for (row of board.getBoard()) {
                for (cell of row) {
                    if (cell.getValue() === '') {choices.push(cell.getPosition())}
                }
            }
            return choices;
        }
        
        const getChoice = () => {
            if (_players[1].AIDifficulty === 'Hard') {
                minimaxRunning = true;
                minimax(copyCurrentBoardState(_board), 0, instanceStartingActivePlayer);
                minimaxRunning = false;
                // console.log('minimaxChoices:')
                // console.log(minimaxChoices)
    
                const sorted = minimaxChoices.sort((a, b) => b.score - a.score);
                const filtered = sorted.filter(choice => sorted[0].score === choice.score);
                // console.log(filtered);
    
                return filtered[~~(Math.random() * filtered.length)].position;
                // call minimax(instanceBoard, 0)
                // return minimax position value
                // console.log(`RAN MINIMAX ${ranMinimax}`);
            }
            else if (_players[1].AIDifficulty === 'Easy') {
                const possibleChoices = generatePossibleChoices(_board);
                return possibleChoices[~~(Math.random() * possibleChoices.length)];        
            }
        }
        
        // for debugging
        let ranMinimax = 0;

        let minimaxChoices = [];
        let minimaxRunning = false;
        const isMinimaxRunning = () => minimaxRunning;

        const minimax = (board, depth, activePlayer) => {
            let currentBoard = copyCurrentBoardState(board);
            let currentDepth = depth + 1; 
            // let currentDepth = 0;

            // for debugging
            // console.log(`START MINIMAX | depth = ${currentDepth}`)    
            // ranMinimax += 1;

            let currentPossibleChoices = generatePossibleChoices(currentBoard)
                                            .map(pos => {return {position: pos, score: 0}});

            // console.log('current possible choices below');
            // console.log(currentPossibleChoices);

            for (choice of currentPossibleChoices) {
                const row = choice.position[0];
                const column = choice.position[1];
                let testBoard = copyCurrentBoardState(currentBoard);

                // console.log(`FOR LOOP START | depth = ${currentDepth}`)
                // console.log(`choice below: current player is ${activePlayer.name}`)
                // console.log(`choice #${currentPossibleChoices.indexOf(choice) + 1}/${currentPossibleChoices.length}: ${choice.position}`);    
                
                testBoard.getBoard()[row][column].setValue(activePlayer.mark);
                
                // console.table(testBoard.printBoard());
                
                if (!_checkForWinner(testBoard)) {                  
                    if (_checkForDraw(testBoard)) {
                        // console.log('draw');
                        choice.score = 0 + currentDepth; 
                    }
                    else {
                        // console.log('no winner');
                        choice.score = minimax(testBoard, currentDepth, switchInstanceActivePlayer(activePlayer));
                    }
                }
                else {
                    // console.log('yes winner');
                    choice.score = activePlayer === _players[0] ? -10 + currentDepth : 10 + currentDepth;
                }  
                testBoard.getBoard()[row][column].setValue('');
                // console.log(`FOR LOOP END | depth = ${currentDepth}`)
            }

            // console.log(`Current Possible Choices with Score: ${activePlayer.name}'s turn`);
            // console.table(currentPossibleChoices);
            // console.log(currentPossibleChoices.map(choice => choice.score));

            // console.log('cloning:')
            // console.log(currentPossibleChoices.slice())
            minimaxChoices = currentPossibleChoices.slice();
            if (activePlayer === _players[0]) {
                // console.log(`returning minimum value: ${Math.min(...currentPossibleChoices.map(choice => choice.score))}`)
                return Math.min(...currentPossibleChoices.map(choice => choice.score));
            }
            else {
                // console.log(`returning maximum value: ${Math.max(...currentPossibleChoices.map(choice => choice.score))}`)
                return Math.max(...currentPossibleChoices.map(choice => choice.score));
            }

            console.log(`END MINIMAX | depth = ${currentDepth}`)    
            
            // current player (starts with AI) 
            // list possible moves [{position, score}, ...] ***
            // minimax depth +1
            // loop through each possible moves (stop loop after last possible move), set new board
                // if check win didnt return true, 
                    // switch current player
                    // current move = recurse^ *** (expected return value: {position, score})
                // else if check win returns true
                    // check winning player
                    // AI wins, add score to position +10 + depth 
                    // player wins, add score to position -10 + depth
                // else if possible moves 0
                    // draw score, add score to position 0 + depth
            // if current player is AI
                // return {position, score} with max score
            // else if current player is player
                // return {position, score} with minimum score                       
        }

        return {
            getChoice,
            isMinimaxRunning,
        }
    })();

    

    const _titleScreenController = (() => {
        const titleScreen = document.querySelector('.title-screen');
        const playButton = document.querySelector('#playButton');
        const vsButtons = document.querySelector('.vs');
        const vsPlayerButton = document.querySelector('#vsPlayerButton');
        const vsAIButton = document.querySelector('#vsAIButton');
        const homeButton = document.querySelector('#homeButton');
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('.form');
        const player2InputContainer = document.querySelector('.player2-input-container');
        const AIDifficultyContainer = document.querySelector('.AI-difficulty-container');
        const AIEasyButton = document.querySelector('#AIEasyButton');        
        const AIHardButton = document.querySelector('#AIHardButton');        
        const player1Name = document.querySelector('#player1NameInput');
        const player2Name = document.querySelector('#player2NameInput');
        const submitNamesButton = document.querySelector('#submitNamesButton');
        const backButton = document.querySelector('#backButton');

        const playGame = (e) => {
            playButton.classList.add('visibility-hidden');
            playButton.addEventListener('transitionend', () => {
                vsButtons.classList.remove('visibility-hidden');
            }, {once: true});
        }
        playButton.addEventListener('click', playGame);
        
        const playVersus = (e) => {
            if (e.target === vsPlayerButton) {
                _playVersusPlayer()
                player2InputContainer.classList.remove('visibility-hidden');
                AIDifficultyContainer.classList.add('visibility-hidden');
            }
            else if (e.target === vsAIButton) {
                _playVersusAI()
                AIDifficultyContainer.classList.remove('visibility-hidden');
                player2InputContainer.classList.add('visibility-hidden');
            }
            vsButtons.classList.add('visibility-hidden');
            vsButtons.addEventListener('transitionend', () => {
                formContainer.classList.remove('visibility-hidden');
            }, {once: true});
        }
        vsPlayerButton.addEventListener('click', playVersus);
        vsAIButton.addEventListener('click', playVersus);

        const toggleAIDifficulty = () => {
            _toggleAIDifficulty();
            AIEasyButton.classList.remove('toggled')
            AIHardButton.classList.remove('toggled')
            if (_players[1].AIDifficulty === 'Easy') {AIEasyButton.classList.add('toggled')}
            else if (_players[1].AIDifficulty === 'Hard') {AIHardButton.classList.add('toggled')}
        }
        AIEasyButton.addEventListener('click', toggleAIDifficulty);
        AIHardButton.addEventListener('click', toggleAIDifficulty);

        const resetAIDifficulty = () => {
            if (_players[1].AIDifficulty === 'Hard') {toggleAIDifficulty()};
        }

        const returnToVersus = (e) => {            
            formContainer.classList.add('visibility-hidden')            
            formContainer.addEventListener('transitionend', () => {
                vsButtons.classList.remove('visibility-hidden');
                form.reset();
                resetAIDifficulty();
            }, {once: true});
        }
        backButton.addEventListener('click', returnToVersus);

        const submitNamesStartGame = (e) => {
            let player1 = player1Name.value !== '' ? player1Name.value : 'Player One';
            
            let player2 = player2Name.value !== '' ? player2Name.value :
                          _players[1].isAI ? `AI ${_players[1].AIDifficulty}` : 'Player Two';
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
                    resetAIDifficulty();           
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
            noButton.addEventListener('click', () => {
                yesButton.removeEventListener('click', func);
            });
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
        const boardContainer = document.querySelector('.board');
        const playAgainButton = document.querySelector('#playAgainButton');
        const resetButton = document.querySelector('#resetButton');
        const player1Name = document.querySelector('#player1Name');
        const player1Score = document.querySelector('#player1Score');
        const player2Name = document.querySelector('#player2Name');
        const player2Score = document.querySelector('#player2Score');

        const displayActivePlayer = () => {
            mainTop.textContent = _players[1].isAI ?
                                  `Playing with AI ${_players[1].AIDifficulty}` :
                                  `${_activePlayer.name}'s turn` ;
        }

        const displayWinningPlayer = () => {
            if (_players[1].isAI) {
                mainTop.textContent = _winningPlayer === _players[0] ? 
                                     `You win!!` : 
                                     `AI ${_players[1].AIDifficulty} wins!!`;
            }
            else {
                mainTop.textContent = `${_winningPlayer.name} wins!!`;
            }
            
        }

        const displayDraw = () => {
            mainTop.textContent = `Draw!!`;
        }

        const displayPlayAgain = () => {
            playAgainButton.classList.remove('visibility-hidden');
            playAgainButton.addEventListener('click', playAgain, {once: true});
        }

        const displayPlayerNames = () => {
            player1Name.textContent = _players[0].name;
            player2Name.textContent = _players[1].name;
        }

        const displayPlayerScores = () => {
            player1Score.textContent = _players[0].score;
            player2Score.textContent = _players[1].score;
        }

        const clickBoard = (e) => {            
            let row = '';
            let column = '';

            if ((_activePlayer === _players[1]) && (_players[1].isAI)) {
                row = e[0];
                column = e[1];
            }
            else {
                row = e.currentTarget.dataset.row;
                column = e.currentTarget.dataset.column;             
            }
            
            if (playRound(row, column)) {
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
                if (_activePlayer.isAI) {
                    clickBoard(_AI.getChoice());
                }
                animateClickedCell(row, column);
                return
            }

            if (!_gameOver) {
                animateInvalidCell(row, column);
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
            while (boardContainer.firstChild) {boardContainer.removeChild(boardContainer.firstChild)};
        }
    
        const generateBoard = () => {
            for (let i = 0; i < _board.getRowCount(); i++) {
                for (let j = 0; j < _board.getColumnCount(); j++) {
                    const button = document.createElement('button');
                    const span = document.createElement('span');
                    button.dataset.row = i;
                    button.dataset.column = j;
                    button.classList.add('cell');
                    if ((_board.getBoard()[i][j].getValue() === '') && (!_gameOver)) {
                        _activePlayer.mark === 'o' ? button.classList.add('one') : button.classList.add('two');
                    }
                    span.textContent = _board.getBoard()[i][j].getValue();
                    if (!_activePlayer.isAI){
                        button.addEventListener('click', clickBoard);
                        button.classList.add('player');
                    }

                    button.appendChild(span);
                    boardContainer.appendChild(button);
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
            if (_activePlayer.isAI) {
                clickBoard(_AI.getChoice());
            }
        }

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
            clickBoard,
            resetGame,            
        }
    })();

    return {
        playRound, // Can be removed later
        restartGame,
        ENDSTATE,
        ENDSTATEFATAL,
    }
})();

document
    .querySelector('#currentYear')
    .textContent = new Date().getFullYear();


    