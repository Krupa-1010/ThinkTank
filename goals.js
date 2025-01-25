document.addEventListener('DOMContentLoaded', () => {
    const goalInput = document.getElementById('goalInput');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const goalList = document.getElementById('goalList');
    const encouragementPopup = document.getElementById('encouragementPopup');

    const encouragementMessages = [
        "Great job! Keep pushing forward!",
        "You're making awesome progress!",
        "Fantastic work! Stay motivated!",
        "Wow! Another goal accomplished!",
        "You're unstoppable!"
    ];

    function addGoal() {
        const goalText = goalInput.value.trim();
        if (goalText) {
            const goalItem = document.createElement('div');
            goalItem.classList.add('goal-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('goal-checkbox');

            const goalTextSpan = document.createElement('span');
            goalTextSpan.textContent = goalText;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.style.display = 'none'; // Hide the delete button initially

            deleteBtn.addEventListener('click', () => {
                goalList.removeChild(goalItem);
            });

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    goalItem.classList.add('completed');
                    deleteBtn.style.display = 'inline-block'; // Show delete button
                    showEncouragement();
                } else {
                    goalItem.classList.remove('completed');
                    deleteBtn.style.display = 'none'; // Hide delete button
                }
            });

            goalItem.appendChild(checkbox);
            goalItem.appendChild(goalTextSpan);
            goalItem.appendChild(deleteBtn);

            goalList.appendChild(goalItem);
            goalInput.value = '';
        }
    }

    function showEncouragement() {
        const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        encouragementPopup.textContent = message;
        encouragementPopup.classList.add('show');

        setTimeout(() => {
            encouragementPopup.classList.remove('show');
        }, 2500);
    }

    addGoalBtn.addEventListener('click', addGoal);
    goalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addGoal();
        }
    });
});