const broker = "ws://" + location.hostname + ":9001";

console.log("Connexion au broker :", broker);

const client = mqtt.connect(broker);

client.on("connect", function () {
    console.log("Connecté au broker MQTT");
    client.subscribe("sensors/data");
});

client.on("message", function (topic, message) {
    if (topic === "sensors/data") {
        try {
            const data = JSON.parse(message.toString());
            console.log("Data:", data);
            const timestamp = new Date(data.timestamp * 1000);
            const options = {
                timeZone: "Europe/Brussels",
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            const dateStr = timestamp.toLocaleString('fr-FR', options);

            document.getElementById("timestamp").textContent = dateStr;
            document.getElementById("temperature").textContent = data.temperature.toFixed(2) + " °C";
            document.getElementById("humidity").textContent = data.humidity.toFixed(2) + " %";
            document.getElementById("heatindex").textContent = data.heatindex.toFixed(2) + " °C";
            document.getElementById("pressure").textContent = data.pressure.toFixed(2) + " Pa";
            document.getElementById("light").textContent = data.light.toFixed(2);

            // Sélection des boxes à modifier
            const tempBox = document.getElementById("temperature").parentElement;
            const humidityBox = document.getElementById("humidity").parentElement;
            const heatindexBox = document.getElementById("heatindex").parentElement;
            const pressureBox = document.getElementById("pressure").parentElement;
            const lightBox = document.getElementById("light").parentElement;

            // Définition des seuils
            const tempThreshold = 30; // Exemple : seuil de température 30°C
            const humidityThreshold = 43; // Seuil de l'humidité à 43%
            const heatindexThreshold = 35; // Seuil de l'indice de chaleur à 35°C
            const pressureThreshold = 1000; // Seuil de pression à 1000 Pa (par exemple)
            const lightThreshold = 1000; // Seuil de luminosité à 1000 lux (par exemple)

            // Fonction pour appliquer ou enlever la classe 'threshold-exceeded'
            function applyThresholdClass(boxElement, value, threshold) {
                if (value > threshold) {
                    boxElement.classList.add('threshold-exceeded');
                    boxElement.classList.remove('normal');
                } else {
                    boxElement.classList.add('normal');
                    boxElement.classList.remove('threshold-exceeded');
                }
            }

            // Appliquer la logique pour chaque box
            applyThresholdClass(tempBox, data.temperature, tempThreshold);
            applyThresholdClass(humidityBox, data.humidity, humidityThreshold);
            applyThresholdClass(heatindexBox, data.heatindex, heatindexThreshold);
            applyThresholdClass(pressureBox, data.pressure, pressureThreshold);
            applyThresholdClass(lightBox, data.light, lightThreshold);
        } catch (error) {
            console.error("Erreur de parsing JSON: ", error);
        }
    }
});

client.on("error", function (error) {
    console.error("Erreur MQTT: ", error);
});
