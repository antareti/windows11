document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const desktop = document.getElementById('desktop');
    const appWindowsContainer = document.getElementById('app-windows-container');
    const appWindows = document.querySelectorAll('.app-window'); // Все окна приложений

    // Иконки рабочего стола
    const myComputerIcon = document.getElementById('myComputerIcon');
    const edgeIcon = document.getElementById('edgeIcon');
    const notepadIcon = document.getElementById('notepadIcon');

    // Иконки панели задач
    const taskbarExplorerIcon = document.getElementById('taskbarExplorerIcon');
    const taskbarEdgeIcon = document.getElementById('taskbarEdgeIcon');
    const taskbarNotepadIcon = document.getElementById('taskbarNotepadIcon');
    const taskbarCalculatorIcon = document.getElementById('taskbarCalculatorIcon');

    // Элементы меню Пуск
    const startAppTiles = document.querySelectorAll('.start-app-tile');

    // Кнопки управления окнами (Закрыть, Свернуть, Развернуть)
    const closeButtons = document.querySelectorAll('.close-button');
    const minimizeButtons = document.querySelectorAll('.minimize-button');
    const maximizeButtons = document.querySelectorAll('.maximize-button');

    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    let zIndexCounter = 100; // Для управления порядком окон (z-index)

    // Объект для хранения ссылок на окна по их ID
    const appWindowMap = {
        'explorer': document.getElementById('explorerWindow'),
        'notepad': document.getElementById('notepadWindow'),
        'calculator': document.getElementById('calculatorWindow'),
        'edge': document.getElementById('edgeWindow')
    };

    // --- Функции для времени и даты ---
    function updateTimeAndDate() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
        const year = now.getFullYear();

        timeElement.textContent = `${hours}:${minutes}`;
        dateElement.textContent = `${day}.${month}.${year}`;
    }

    // Обновляем время сразу и затем каждую минуту
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 60000); // Обновлять каждую минуту (60 000 мс)

    // --- Переключение меню Пуск ---
    startButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Предотвращаем закрытие меню сразу
        startMenu.classList.toggle('show');
    });

    // Закрытие меню Пуск при клике вне его
    desktop.addEventListener('click', () => {
        if (startMenu.classList.contains('show')) {
            startMenu.classList.remove('show');
        }
    });

    // Предотвращение закрытия меню при клике внутри него
    startMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // --- Открытие окон по иконкам рабочего стола ---
    myComputerIcon.addEventListener('dblclick', () => openApp('explorer'));
    edgeIcon.addEventListener('dblclick', () => openApp('edge'));
    notepadIcon.addEventListener('dblclick', () => openApp('notepad'));

    // --- Открытие окон по плиткам меню Пуск ---
    startAppTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const appId = tile.dataset.app;
            if (appId) {
                openApp(appId);
                startMenu.classList.remove('show'); // Закрыть меню Пуск
            }
        });
    });

    // --- Обработчики для кнопок окна (Закрыть, Свернуть, Развернуть) ---
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const windowToClose = event.target.closest('.app-window');
            if (windowToClose) {
                closeWindow(windowToClose);
            }
        });
    });

    minimizeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const windowToMinimize = event.target.closest('.app-window');
            if (windowToMinimize) {
                windowToMinimize.classList.add('hidden'); // Просто скрываем окно
                windowToMinimize.classList.remove('maximized'); // Если было развернуто, сбрасываем
            }
        });
    });

    maximizeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const windowToMaximize = event.target.closest('.app-window');
            if (windowToMaximize) {
                toggleMaximize(windowToMaximize);
            }
        });
    });

    // --- Функции для управления окнами ---

    // Открыть или активировать приложение
    function openApp(appId) {
        const windowElement = appWindowMap[appId];
        if (windowElement) {
            windowElement.classList.remove('hidden');
            bringWindowToFront(windowElement);
        } else {
            console.warn(`Приложение с ID "${appId}" не найдено.`);
        }
    }

    // Закрыть окно (сбросить состояние)
    function closeWindow(windowElement) {
        windowElement.classList.add('hidden');
        windowElement.classList.remove('maximized'); // Убрать режим развернутого окна
        // Сбросить позицию и размер окна, чтобы при следующем открытии оно было в центре и дефолтного размера
        windowElement.style.top = '50%';
        windowElement.style.left = '50%';
        windowElement.style.transform = 'translate(-50%, -50%)';
        windowElement.style.width = ''; // Вернуть к CSS-определенному размеру
        windowElement.style.height = '';
        windowElement.style.borderRadius = '8px'; // Вернуть скругления
        windowElement.style.resize = 'both'; // Включить изменение размера
    }

    // Переключение между развернутым и обычным размером
    function toggleMaximize(windowElement) {
        windowElement.classList.toggle('maximized');
        if (windowElement.classList.contains('maximized')) {
            // Если развернуто, сохраняем предыдущие размеры и позицию
            windowElement.dataset.prevWidth = windowElement.style.width;
            windowElement.dataset.prevHeight = windowElement.style.height;
            windowElement.dataset.prevTop = windowElement.style.top;
            windowElement.dataset.prevLeft = windowElement.style.left;
            windowElement.dataset.prevTransform = windowElement.style.transform;

            // Устанавливаем полноэкранный режим через CSS класс
        } else {
            // Восстанавливаем предыдущие размеры и позицию
            windowElement.style.width = windowElement.dataset.prevWidth || '';
            windowElement.style.height = windowElement.dataset.prevHeight || '';
            windowElement.style.top = windowElement.dataset.prevTop || '50%';
            windowElement.style.left = windowElement.dataset.prevLeft || '50%';
            windowElement.style.transform = windowElement.dataset.prevTransform || 'translate(-50%, -50%)';
        }
    }

    // Перемещение окна на передний план (увеличение z-index)
    function bringWindowToFront(windowElement) {
        appWindows.forEach(win => {
            win.classList.remove('active-window');
        });
        zIndexCounter++;
        windowElement.style.zIndex = zIndexCounter;
        windowElement.classList.add('active-window');
    }

    // --- Перетаскивание окон ---
    let activeWindow = null;
    let initialX, initialY;
    let isDragging = false;

    // Назначаем обработчик на контейнер, чтобы отлавливать клики по заголовкам
    appWindowsContainer.addEventListener('mousedown', (e) => {
        const header = e.target.closest('.window-header');
        if (header) {
            activeWindow = header.closest('.app-window');

            // Если окно развернуто, сначала восстановим его
            if (activeWindow.classList.contains('maximized')) {
                toggleMaximize(activeWindow);
            }

            bringWindowToFront(activeWindow); // Привести на передний план при клике
            isDragging = true;

            const rect = activeWindow.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            activeWindow.style.cursor = 'grabbing';
            activeWindow.style.transition = 'none'; // Отключить transition во время перетаскивания
        } else {
            // Если клик не по заголовку, но по окну, просто делаем его активным
            const clickedWindow = e.target.closest('.app-window');
            if (clickedWindow) {
                bringWindowToFront(clickedWindow);
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !activeWindow) return;
        e.preventDefault();

        let newX = e.clientX - initialX;
        let newY = e.clientY - initialY;

        // Ограничиваем перетаскивание, чтобы окно не выходило за пределы экрана
        const desktopRect = desktop.getBoundingClientRect();
        const windowRect = activeWindow.getBoundingClientRect();

        // Ограничение по X
        if (newX < desktopRect.left) newX = desktopRect.left;
        if (newX + windowRect.width > desktopRect.right) newX = desktopRect.right - windowRect.width;

        // Ограничение по Y (учитывая панель задач)
        if (newY < desktopRect.top) newY = desktopRect.top;
        if (newY + windowRect.height > desktopRect.bottom - 48) newY = desktopRect.bottom - 48 - windowRect.height; // -48px для панели задач


        activeWindow.style.left = `${newX}px`;
        activeWindow.style.top = `${newY}px`;
        activeWindow.style.transform = 'none'; // Отменяем translate(-50%, -50%)
    });

    document.addEventListener('mouseup', () => {
        if (isDragging && activeWindow) {
            activeWindow.style.cursor = 'grab';
            activeWindow.style.transition = ''; // Включить transition обратно
            isDragging = false;
            activeWindow = null;
        }
    });

    // --- Обработка иконок на панели задач для сворачивания/разворачивания ---
    const taskbarIcons = document.querySelectorAll('#taskbar-center-icons img');
    taskbarIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const appId = icon.id.replace('taskbar', '').toLowerCase().replace('icon', ''); // Получаем ID приложения из ID иконки
            const windowElement = appWindowMap[appId];

            if (windowElement) {
                if (windowElement.classList.contains('hidden')) {
                    // Если окно скрыто, открываем его и приводим на передний план
                    openApp(appId);
                } else {
                    // Если окно видимо, сворачиваем его
                    windowElement.classList.add('hidden');
                    windowElement.classList.remove('maximized'); // Также снять режим развернутого окна
                }
            }
        });
    });


    // Инициализация: убедиться, что все окна скрыты по умолчанию при загрузке
    appWindows.forEach(window => {
        window.classList.add('hidden');
    });

    // Делаем Explorer видимым при старте для демонстрации (можно убрать)
    // openApp('explorer');
});