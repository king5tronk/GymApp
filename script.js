document.addEventListener('DOMContentLoaded', function () {
    // Hämta DOM-element
    const saveButton = document.getElementById('save-button');
    const muscleGroupInput = document.getElementById('muscle-group');
    const trainingList = document.getElementById('training-list');

    // Hämta data från localStorage
    let trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];

    // Variabel för att hålla reda på vilket datum som redigeras
    let editingDate = null;

    // Uppdatera listan med de senaste 14 dagarna
    function updateTrainingList() {
        trainingList.innerHTML = '';
        const weekdays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
        let currentDate = new Date();

        for (let i = 0; i < 14; i++) {
            let date = new Date(currentDate);
            date.setDate(currentDate.getDate() - i);

            const dayName = weekdays[date.getDay() - 1] || 'Söndag';
            const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            const training = trainingData.find(t => t.date === dateStr);
            const muscleGroup = training ? training.muscleGroup : 'Ingen träningspass';

            // Skapa en lista för varje dag
            const listItem = document.createElement('li');
            listItem.innerHTML = `${dayName} (${dateStr}): <span class="muscle-group">${muscleGroup}</span>`;

            // Lägg till redigeringsknapp för varje dag
            const editButton = document.createElement('button');
            editButton.textContent = 'Redigera';
            editButton.className = 'edit-button';

            listItem.appendChild(editButton);
            trainingList.appendChild(listItem);

            // Lägg till eventlyssnare för redigeringsknappen
            editButton.addEventListener('click', function () {
                handleEdit(dateStr, muscleGroup);
            });

            // Lägg till separator för veckoseparation
            if (dayName === 'Måndag' && i !== 0) {
                const separator = document.createElement('hr');
                trainingList.appendChild(separator);
            }
        }
    }

    // Hantera redigering av träningsdata
    function handleEdit(dateStr, currentMuscleGroup) {
        // Sätt det redigerade datumet
        editingDate = dateStr;

        // Visa den aktuella muskelgruppen i inputfältet
        muscleGroupInput.value = currentMuscleGroup === 'Ingen träningspass' ? '' : currentMuscleGroup;
    }

    // Spara träningspass för det valda datumet (redigerade eller dagens datum)
    saveButton.addEventListener('click', function () {
        const muscleGroup = muscleGroupInput.value.trim();

        if (!editingDate) {
            // Om inget datum är redigerat, spara för dagens datum
            const currentDate = new Date();
            editingDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        }

        // Uppdatera eller lägg till träningsdata för det valda datumet
        const existingEntryIndex = trainingData.findIndex(t => t.date === editingDate);

        if (existingEntryIndex > -1) {
            // Uppdatera befintligt träningspass
            trainingData[existingEntryIndex].muscleGroup = muscleGroup;
        } else {
            // Lägg till ett nytt träningspass
            trainingData.push({ date: editingDate, muscleGroup });
        }

        // Begränsa listan till 14 dagar
        if (trainingData.length > 14) {
            trainingData.shift();
        }

        // Spara i localStorage
        localStorage.setItem('trainingData', JSON.stringify(trainingData));

        // Rensa inputfältet och uppdatera listan
        muscleGroupInput.value = '';
        editingDate = null;  // Återställ redigeringsdatum
        updateTrainingList();
    });

    // Uppdatera listan vid sidladdning
    updateTrainingList();
});
