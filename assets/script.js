const relogio = document.querySelector('.relogio');
const pomodoroBtn = document.querySelector('.pomodoroBtn');
const shortBreak = document.querySelector('.shortBreak');
const longBreak = document.querySelector('.longBreak');
const mainBtn = document.querySelector('.mainBtn');
const darkModeButton = document.getElementById('darkModeButton');
const setting = document.getElementById('setting');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const settingContent = document.querySelector('.setting-content');
const okBtn = document.getElementById('okBtn');
const inputTimePomodoro = document.getElementById('inputTimePomodoro');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.querySelector('.task-list');

let minutos = 25;
let segundos = 0;
let intervalo;
let darkMode = false;
let emExecucao = false;
let emIntervaloCurto = false;
let selectedButton = null;
let mainBtnClicked = false;

selectButton(pomodoroBtn);

function atualizarInterface() {
    let tempoFormatado;
  
    if (emIntervaloCurto) {
      tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    } else {
      tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
  
    relogio.innerHTML = tempoFormatado;
  }

function selectButton(button) {
    if(selectedButton) {
        selectedButton.style.backgroundColor = '';
    }

    button.style.backgroundColor = 'rgba(42, 42, 199, 0.682)';
    selectedButton = button;
};

function updatePageTitle() {
    const tempoDecorrido = minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
    document.title = `${tempoDecorrido} - Pomodoro Timer`;
}

setInterval(updatePageTitle, 1000);

function shortBreakTime() {
        minutos = 5;
        segundos = 0;
        atualizarInterface();
        selectButton(shortBreak);
        if (minutos === 0 && segundos === 0) {
            playAlarmSound();
            reiniciarPomodoro();
    }
}

function longBreakTime() {
    minutos = 15;
    segundos = 0;
    atualizarInterface();
    selectButton(longBreak);
    if (minutos === 0 && segundos === 0) {
        playAlarmSound();
        reiniciarPomodoro();
    }
}

function reiniciarPomodoro() {
    minutos = 25;
    segundos = 0;
    atualizarInterface();
    exibirBotoes();
}

function openTaskDialog() {
    if (document.querySelector('#taskInput')) {
        return;
    }

    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', 'taskInput');
    inputElement.setAttribute('placeholder', 'What are you working on?');
    inputElement.classList.add('styled-input');

    taskList.appendChild(inputElement);

    addTaskButton.addEventListener('click', function (event) {
        const taskDescription = document.getElementById('taskInput').value;
        if (taskDescription.trim() !== "") {
            document.getElementById('taskDescription').textContent = taskDescription;
            inputElement.remove();
        }
    });

    inputElement.focus();
}

pomodoroBtn.addEventListener('click', function () {
    if (!emExecucao) {
        minutos = 25;
        segundos = 0;
        atualizarInterface();
        selectButton(pomodoroBtn);
    }
});

const pomodoroBtnDisplay = getComputedStyle(pomodoroBtn).display;
const shortBreakDisplay = getComputedStyle(shortBreak).display;
const longBreakDisplay = getComputedStyle(longBreak).display;

function ocultarBotoes() {
    pomodoroBtn.style.display = 'none';
    shortBreak.style.display = 'none';
    longBreak.style.display = 'none';
}

function exibirBotoes() {
    pomodoroBtn.style.display = pomodoroBtnDisplay;
    shortBreak.style.display = shortBreakDisplay;
    longBreak.style.display = longBreakDisplay;
}

shortBreak.addEventListener('click', function () {
    if (!emExecucao) {
        shortBreakTime();
        selectButton(shortBreak);
        updatePageTitle();
        document.title = `${minutos}:${segundos < 10 ? '0' : ''}${segundos} - Short break`;
    }
});

longBreak.addEventListener('click', function () {
    if (!emExecucao) {
        longBreakTime();
        selectButton(longBreak);
        updatePageTitle();
        document.title = `${minutos}:${segundos < 10 ? '0' : ''}${segundos} - Long break`;
    }
});

function playAlarmSound() {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.play();
}

function iniciarPomodoro() {
    if (!mainBtnClicked) {
        return;
    } else if (segundos === 0) {
        if (minutos === 0) {
            if (!emIntervaloCurto) {
                emIntervaloCurto = true;
                exibirBotoes();
                playAlarmSound();
                shortBreakTime();
                selectButton(shortBreak);
                mainBtn.textContent = 'START';
                mainBtn.setAttribute('title', 'Press spacebar to start/pause');
                return;
            } else {
                clearInterval(intervalo);
                emExecucao = false;
                mainBtn.textContent = 'START';
                mainBtn.setAttribute('title', 'Press spacebar to start/pause');
            }

        } else {
            segundos = 59;
            minutos--;
        }
    } else {
        segundos--;
    }
    if (minutos === 0 && segundos === 0 && emExecucao) {
        clearInterval(intervalo);
        emExecucao = false;
        exibirBotoes();
        playAlarmSound();
        shortBreakTime();
        selectButton(shortBreak);
        mainBtn.textContent = 'START';
        mainBtn.setAttribute('title', 'Press spacebar to start/pause');
    }

    atualizarInterface();
}

mainBtn.addEventListener('click', function () {
    mainBtnClicked = true;
    if (emIntervaloCurto) {
        emIntervaloCurto = false;
        iniciarPomodoro();
        ocultarBotoes();
        addTaskButton.style.display = 'none';
        taskInput.style.display = 'none';
    } else if (emExecucao) {
        clearInterval(intervalo);
        emExecucao = false;
        mainBtn.textContent = 'START';
        mainBtn.setAttribute('title', 'Press spacebar to start/pause');
        exibirBotoes();
        addTaskButton.style.display = 'block';
        taskInput.style.display = 'block';
    } else {
        intervalo = setInterval(iniciarPomodoro, 1000);
        emExecucao = true;
        mainBtn.textContent = 'PAUSE';
        ocultarBotoes();
        addTaskButton.style.display = 'none';
        taskInput.style.display = 'none';
    }
});

setting.addEventListener('click', function() {
    modal.style.display = "block";
});

closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

okBtn.addEventListener('click', function() {
    const inputValue = inputTimePomodoro.value;
    minutos = inputValue;
    atualizarInterface();
    
    console.log("Valor inserido:", inputValue);
    modal.style.display = "none";
});

darkModeButton.addEventListener('click', function () {
    darkMode = !darkMode;

    let container = document.querySelector('.container');

    if (darkMode) {
        document.body.style.backgroundColor = '#000';
        container.style.backgroundColor = '#000';
        mainBtn.style.backgroundColor = '#fff';
        pomodoroBtn.style.backgroundColor = '#000';
        shortBreak.style.backgroundColor = '#000';
        longBreak.style.backgroundColor = '#000';
        mainBtn.style.color = '#000';
        darkModeButton.style.color = '#fff';
        addTaskButton.style.backgroundColor = '#fff';
        addTaskButton.style.color = '#000';
        this.setAttribute('title', 'Change to Light Mode');
    } else {
        document.body.style.backgroundColor = 'rgba(42, 42, 199, 0.682)';
        container.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
        mainBtn.style.backgroundColor = '#fff';
        mainBtn.style.color = 'rgba(42, 42, 199, 0.682)';
        darkModeButton.style.color = '#fff';
        this.setAttribute('title', 'Change to Dark Mode');

        if (selectedButton === pomodoroBtn) {
            pomodoroBtn.style.backgroundColor = 'rgba(42, 42, 199, 0.682)';
            shortBreak.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
            longBreak.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
        } else if (selectedButton === shortBreak) {
            shortBreak.style.backgroundColor = 'rgba(42, 42, 199, 0.682)';
            pomodoroBtn.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
            longBreak.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
        } else if (selectedButton === longBreak) {
            longBreak.style.backgroundColor = 'rgba(42, 42, 199, 0.682)';
            shortBreak.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
            pomodoroBtn.style.backgroundColor = 'rgba(178, 178, 238, 0.367)';
        }
    }
});