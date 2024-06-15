document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const playButton = document.getElementById('play-button');
    const scoreboardButton = document.getElementById('scoreboard-button');
    const howToPlayButton = document.getElementById('how-to-play-button');
    const creditsButton = document.getElementById('credits-button');
    
    const gameContainer = document.getElementById('game-container');
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const gameMenuButton = document.getElementById('game-menu-button');
    
    const winScreen = document.getElementById('win-screen');
    const winMenuButton = document.getElementById('win-menu-button');
    const winScore = document.getElementById('win-score');
    
    const loseScreen = document.getElementById('lose-screen');
    const loseMenuButton = document.getElementById('lose-menu-button');
    const loseScore = document.getElementById('lose-score');
    
    const scoreboardMenu = document.getElementById('scoreboard-menu');
    const scoreboardBackButton = document.getElementById('scoreboard-back-button');
    const scoreboardDisplay = document.getElementById('scoreboard');
    
    const ingameOptionsMenu = document.getElementById('ingame-options-menu');
    const restartButton = document.getElementById('restart-button');
    const ingameMainMenuButton = document.getElementById('ingame-main-menu-button');
    const ingameOptionsBackButton = document.getElementById('ingame-options-back-button');
    
    const howToPlayMenu = document.getElementById('how-to-play-menu');
    const howToPlayBackButton = document.getElementById('how-to-play-back-button');

    const creditsMenu = document.getElementById('credits-menu');
    const creditsBackButton = document.getElementById('credits-back-button');

    const backgroundMusic = document.getElementById('background-music');
    
    const audioPlayButtons = document.querySelectorAll('.audio-button');
    const soundVolumes = document.querySelectorAll('.volume-slider');
    const volumePercentages = document.querySelectorAll('.volume-percentage');
    
    const width = 4;
    let squares = [];
    let score = 0;
    let timer;
    let secondsElapsed = 0;
    let gameInProgress = false;
    let musicPlaying = false;

    playButton.addEventListener('click', startGame);
    winMenuButton.addEventListener('click', showMainMenu);
    loseMenuButton.addEventListener('click', showMainMenu);
    gameMenuButton.addEventListener('click', showInGameOptions);
    restartButton.addEventListener('click', startGame);
    ingameMainMenuButton.addEventListener('click', showMainMenu);
    ingameOptionsBackButton.addEventListener('click', hideInGameOptions);
    scoreboardButton.addEventListener('click', showScoreboard);
    scoreboardBackButton.addEventListener('click', hideScoreboard);
    howToPlayButton.addEventListener('click', showHowToPlay);
    howToPlayBackButton.addEventListener('click', hideHowToPlay);
    creditsButton.addEventListener('click', showCredits);
    creditsBackButton.addEventListener('click', hideCredits);

    audioPlayButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const icon = e.target.tagName === 'I' ? e.target : e.target.querySelector('i');
            toggleAudioPlay(icon);
        });
    });

    soundVolumes.forEach(slider => {
        slider.addEventListener('input', adjustVolume);
    });

    function showMainMenu() {
        gameContainer.classList.add('hidden');
        winScreen.classList.add('hidden');
        loseScreen.classList.add('hidden');
        scoreboardMenu.classList.add('hidden');
        ingameOptionsMenu.classList.add('hidden');
        howToPlayMenu.classList.add('hidden');
        creditsMenu.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        document.removeEventListener('keydown', control);
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function startGame() {
        mainMenu.classList.add('hidden');
        winScreen.classList.add('hidden');
        loseScreen.classList.add('hidden');
        scoreboardMenu.classList.add('hidden');
        ingameOptionsMenu.classList.add('hidden');
        howToPlayMenu.classList.add('hidden');
        creditsMenu.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gridContainer.innerHTML = '';
        score = 0;
        secondsElapsed = 0;
        scoreDisplay.innerHTML = `Score: ${score}`;
        timerDisplay.innerHTML = 'Time: 00:00';
        squares = [];
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.classList.add('grid-cell');
            square.setAttribute('data-value', '0');
            square.innerHTML = '';
            gridContainer.appendChild(square);
            squares.push(square);
        }
        generateNumber();
        generateNumber();
        gameInProgress = true;
        startTimer();
        document.addEventListener('keydown', control);
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function showInGameOptions() {
        gameContainer.classList.add('hidden');
        ingameOptionsMenu.classList.remove('hidden');
        document.removeEventListener('keydown', control);
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function hideInGameOptions() {
        gameContainer.classList.remove('hidden');
        ingameOptionsMenu.classList.add('hidden');
        document.addEventListener('keydown', control);
    }

    function showScoreboard() {
        mainMenu.classList.add('hidden');
        scoreboardMenu.classList.remove('hidden');
        displayScoreboard();
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function hideScoreboard() {
        mainMenu.classList.remove('hidden');
        scoreboardMenu.classList.add('hidden');
    }

    function showHowToPlay() {
        mainMenu.classList.add('hidden');
        howToPlayMenu.classList.remove('hidden');
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function hideHowToPlay() {
        mainMenu.classList.remove('hidden');
        howToPlayMenu.classList.add('hidden');
    }

    function showCredits() {
        mainMenu.classList.add('hidden');
        creditsMenu.classList.remove('hidden');
        updateAudioButtonIcons(); // Update the audio button icon based on the music state
    }

    function hideCredits() {
        mainMenu.classList.remove('hidden');
        creditsMenu.classList.add('hidden');
    }

    function toggleAudioPlay(icon) {
        if (musicPlaying) {
            backgroundMusic.pause();
            icon.classList.replace('fa-pause', 'fa-play');
        } else {
            backgroundMusic.play();
            icon.classList.replace('fa-play', 'fa-pause');
        }
        musicPlaying = !musicPlaying;
        updateAudioButtonIcons(); // Update the icon on all buttons
    }

    function adjustVolume(e) {
        backgroundMusic.volume = e.target.value;
        const volumePercentage = Math.round(e.target.value * 100) + '%';
        const percentageDisplay = e.target.nextElementSibling;
        percentageDisplay.innerHTML = volumePercentage;
    }

    function updateAudioButtonIcons() {
        audioPlayButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (musicPlaying) {
                icon.classList.replace('fa-play', 'fa-pause');
            } else {
                icon.classList.replace('fa-pause', 'fa-play');
            }
        });

        // Update volume percentages on page load or menu change
        soundVolumes.forEach(slider => {
            const percentageDisplay = slider.nextElementSibling;
            const volumePercentage = Math.round(slider.value * 100) + '%';
            percentageDisplay.innerHTML = volumePercentage;
        });
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            secondsElapsed++;
            const minutes = Math.floor(secondsElapsed / 60);
            const seconds = secondsElapsed % 60;
            timerDisplay.innerHTML = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function saveScore() {
        const previousScores = JSON.parse(localStorage.getItem('scores')) || [];
        previousScores.push({ score, time: secondsElapsed });
        localStorage.setItem('scores', JSON.stringify(previousScores));
    }

    function displayScoreboard() {
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        scoreboardDisplay.innerHTML = '';
        scores.forEach((scoreEntry, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.innerHTML = `Game ${index + 1}: ${scoreEntry.score} points, ${Math.floor(scoreEntry.time / 60).toString().padStart(2, '0')}:${(scoreEntry.time % 60).toString().padStart(2, '0')}`;
            scoreboardDisplay.appendChild(scoreElement);
        });
    }

    function generateNumber() {
        let emptySquares = squares.filter(square => square.innerHTML === '');
        if (emptySquares.length === 0) return;
        const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        randomSquare.innerHTML = 2;
        randomSquare.setAttribute('data-value', '2');
        checkForGameOver();
    }

    function moveRight() {
        for (let i = 0; i < width * width; i++) {
            if (i % 4 === 0) {
                let totalOne = parseInt(squares[i].innerHTML) || 0;
                let totalTwo = parseInt(squares[i + 1].innerHTML) || 0;
                let totalThree = parseInt(squares[i + 2].innerHTML) || 0;
                let totalFour = parseInt(squares[i + 3].innerHTML) || 0;
                let row = [totalOne, totalTwo, totalThree, totalFour];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill('');
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];

                squares[i].setAttribute('data-value', newRow[0]);
                squares[i + 1].setAttribute('data-value', newRow[1]);
                squares[i + 2].setAttribute('data-value', newRow[2]);
                squares[i + 3].setAttribute('data-value', newRow[3]);
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < width * width; i++) {
            if (i % 4 === 0) {
                let totalOne = parseInt(squares[i].innerHTML) || 0;
                let totalTwo = parseInt(squares[i + 1].innerHTML) || 0;
                let totalThree = parseInt(squares[i + 2].innerHTML) || 0;
                let totalFour = parseInt(squares[i + 3].innerHTML) || 0;
                let row = [totalOne, totalTwo, totalThree, totalFour];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill('');
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];

                squares[i].setAttribute('data-value', newRow[0]);
                squares[i + 1].setAttribute('data-value', newRow[1]);
                squares[i + 2].setAttribute('data-value', newRow[2]);
                squares[i + 3].setAttribute('data-value', newRow[3]);
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < width; i++) {
            let totalOne = parseInt(squares[i].innerHTML) || 0;
            let totalTwo = parseInt(squares[i + width].innerHTML) || 0;
            let totalThree = parseInt(squares[i + width * 2].innerHTML) || 0;
            let totalFour = parseInt(squares[i + width * 3].innerHTML) || 0;
            let column = [totalOne, totalTwo, totalThree, totalFour];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill('');
            let newColumn = zeros.concat(filteredColumn);

            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + width * 2].innerHTML = newColumn[2];
            squares[i + width * 3].innerHTML = newColumn[3];

            squares[i].setAttribute('data-value', newColumn[0]);
            squares[i + width].setAttribute('data-value', newColumn[1]);
            squares[i + width * 2].setAttribute('data-value', newColumn[2]);
            squares[i + width * 3].setAttribute('data-value', newColumn[3]);
        }
    }

    function moveUp() {
        for (let i = 0; i < width; i++) {
            let totalOne = parseInt(squares[i].innerHTML) || 0;
            let totalTwo = parseInt(squares[i + width].innerHTML) || 0;
            let totalThree = parseInt(squares[i + width * 2].innerHTML) || 0;
            let totalFour = parseInt(squares[i + width * 3].innerHTML) || 0;
            let column = [totalOne, totalTwo, totalThree, totalFour];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill('');
            let newColumn = filteredColumn.concat(zeros);

            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + width * 2].innerHTML = newColumn[2];
            squares[i + width * 3].innerHTML = newColumn[3];

            squares[i].setAttribute('data-value', newColumn[0]);
            squares[i + width].setAttribute('data-value', newColumn[1]);
            squares[i + width * 2].setAttribute('data-value', newColumn[2]);
            squares[i + width * 3].setAttribute('data-value', newColumn[3]);
        }
    }

    function combineRow() {
        for (let i = 0; i < width * width - 1; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML !== '') {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = '';
                score += combinedTotal;
                scoreDisplay.innerHTML = `Score: ${score}`;

                squares[i].setAttribute('data-value', combinedTotal);
                squares[i + 1].setAttribute('data-value', '');
            }
        }
        checkForWin();
    }

    function combineColumn() {
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML !== '') {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = '';
                score += combinedTotal;
                scoreDisplay.innerHTML = `Score: ${score}`;

                squares[i].setAttribute('data-value', combinedTotal);
                squares[i + width].setAttribute('data-value', '');
            }
        }
        checkForWin();
    }

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                document.removeEventListener('keydown', control);
                gameContainer.classList.add('hidden');
                winScreen.classList.remove('hidden');
                stopTimer();
                gameInProgress = false;
                saveScore();
                winScore.innerHTML = `Final Score: ${score}`;
            }
        }
    }

    function checkForGameOver() {
        let movesAvailable = false;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML === '') {
                movesAvailable = true;
                break;
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width - 1; j++) {
                if (squares[i + j * width].innerHTML === squares[i + (j + 1) * width].innerHTML) {
                    movesAvailable = true;
                    break;
                }
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width - 1; j++) {
                if (squares[i * width + j].innerHTML === squares[i * width + j + 1].innerHTML) {
                    movesAvailable = true;
                    break;
                }
            }
        }

        if (!movesAvailable) {
            document.removeEventListener('keydown', control);
            gameContainer.classList.add('hidden');
            loseScreen.classList.remove('hidden');
            stopTimer();
            gameInProgress = false;
            saveScore();
            loseScore.innerHTML = `Final Score: ${score}`;
        }
    }

    function control(e) {
        if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 38) {
            keyUp();
        } else if (e.keyCode === 40) {
            keyDown();
        }
    }

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generateNumber();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generateNumber();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generateNumber();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generateNumber();
    }

    showMainMenu();
});