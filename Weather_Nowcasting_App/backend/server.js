const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/nowcast', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        // 1. Get Coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const geoRes = await axios.get(geoUrl);
        if (!geoRes.data.results) return res.status(404).json({ error: 'City not found' });
        
        const { latitude, longitude, name, country } = geoRes.data.results[0];

        // 2. Get Weather Data with 15-MINUTE intervals for the current day
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&minutely_15=temperature_2m&timezone=auto&forecast_days=1`;
        const weatherRes = await axios.get(weatherUrl);

        // 3. Format ALL 96 data points for the day to make a super smooth graph
        const minutely = weatherRes.data.minutely_15;
        const forecast = [];
        
        for (let i = 0; i < minutely.time.length; i++) { 
            forecast.push({
                time: minutely.time[i].substring(11, 16), // Extracts just the "HH:MM" time
                temp: minutely.temperature_2m[i]
            });
        }

        // 4. Send the data payload to the frontend
        res.json({
            location: { name, country },
            current: {
                temp: weatherRes.data.current.temperature_2m,
                humidity: weatherRes.data.current.relative_humidity_2m,
                rain: weatherRes.data.current.precipitation
            },
            forecast: forecast
        });

    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(5000, () => console.log(`✅ 15-Min Smooth Server running on port 5000`));