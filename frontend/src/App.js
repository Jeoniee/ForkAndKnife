import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './App.css';  // 필요에 따라 CSS 파일 수정

function App() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [menu, setMenu] = useState('');

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });
        } else {
            console.log("Geolocation is not available");
        }
    }, []);

    useEffect(() => {
        if (location) {
            const fetchWeather = async () => {
                const apiKey = 'your api key';
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${apiKey}`;
                try {
                    const response = await axios.get(url);
                    setWeather(response.data);
                } catch (error) {
                    console.error("Error fetching weather data", error);
                }
            };

            fetchWeather();
        }
    }, [location]);

    useEffect(() => {
        if (weather) {
            const fetchMenu = async () => {
                try {
                    const response = await axios.post('http://localhost:8080/api/recommend', {
                        location,
                        weather
                    });
                    setMenu(response.data);
                } catch (error) {
                    console.error("Error fetching menu", error);
                }
            };

            fetchMenu();
        }
    }, [weather]);

    return (
        <div>
            <h1>점심 메뉴 추천</h1>
            {location ? (
                weather ? (
                    <div>
                        <p>현재 위치: {location.latitude}, {location.longitude}</p>
                        <p>현재 날씨: {weather.main.temp}°C, {weather.weather[0].description}</p>
                        <h2>추천 메뉴: {menu}</h2>
                    </div>
                ) : (
                    <p>날씨 정보를 불러오는 중...</p>
                )
            ) : (
                <p>위치 정보를 불러오는 중...</p>
            )}
        </div>
    );
}

export default App;
