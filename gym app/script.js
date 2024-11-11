document.addEventListener('DOMContentLoaded', function() {
    // Hämta DOM-element
    const saveButton = document.getElementById('save-button');
    const muscleGroupInput = document.getElementById('muscle-group');
    const trainingList = document.getElementById('training-list');

    // Hämta data från localStorage
    let trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];

    // Uppdatera listan med de senaste 14 dagarna
    function updateTrainingList() {
        trainingList.innerHTML = '';
        const weekdays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
        let currentDate = new Date();

        // Lägg till de senaste 14 dagarna
        for (let i = 0; i < 14; i++) {
            let date = new Date(currentDate);
            date.setDate(currentDate.getDate() - i);

            const dayName = weekdays[date.getDay() - 1] || 'Söndag';
            // Ändra här för att visa dag, månad och år i rätt ordning
            const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            const training = trainingData.find(t => t.date === dateStr);
            const muscleGroup = training ? training.muscleGroup : 'Ingen träningspass';

            // Skapa en lista för varje dag
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${dayName} (${dateStr}): <span class="muscle-group">${muscleGroup}</span>
                <button class="edit-button">Redigera</button>
            `;
            // Lägg till "Redigera" knapp till listan
            trainingList.appendChild(listItem);

            // Lägg till eventlyssnare för att kunna redigera
            const editButton = listItem.querySelector('.edit-button');
            editButton.addEventListener('click', function() {
                const muscleGroupSpan = listItem.querySelector('.muscle-group');
                const currentMuscleGroup = muscleGroupSpan.textContent;

                // Sätt inputfältet till den nuvarande muskelgruppen
                muscleGroupInput.value = currentMuscleGroup;

                // Ta bort det gamla träningspasset från listan
                trainingData = trainingData.filter(t => t.date !== dateStr);

                // Uppdatera listan när användaren klickar på "Spara Träning"
                saveButton.onclick = function() {
                    const newMuscleGroup = muscleGroupInput.value.trim();
                    if (!newMuscleGroup) {
                        alert('Ange en muskelgrupp');
                        return;
                    }

                    // Lägg till den nya muskelgruppen i träningsdata
                    trainingData.push({ date: dateStr, muscleGroup: newMuscleGroup });
                    
                    // Begränsa listan till 14 dagar
                    if (trainingData.length > 14) {
                        trainingData.shift();
                    }

                    // Spara i localStorage
                    localStorage.setItem('trainingData', JSON.stringify(trainingData));

                    // Rensa inputfältet och uppdatera listan
                    muscleGroupInput.value = '';
                    updateTrainingList();
                };
            });
        }
    }

    // Spara träningspass
    saveButton.addEventListener('click', function() {
        const muscleGroup = muscleGroupInput.value.trim();
        if (!muscleGroup) {
            alert('Ange en muskelgrupp');
            return;
        }

        const currentDate = new Date();
        const dateStr = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        trainingData.push({ date: dateStr, muscleGroup });
        
        // Begränsa listan till 14 dagar
        if (trainingData.length > 14) {
            trainingData.shift();
        }

        // Spara i localStorage
        localStorage.setItem('trainingData', JSON.stringify(trainingData));

        // Rensa inputfältet
        muscleGroupInput.value = '';

        // Uppdatera listan
        updateTrainingList();
    });

    // Uppdatera listan vid sidladdning
    updateTrainingList();
});
