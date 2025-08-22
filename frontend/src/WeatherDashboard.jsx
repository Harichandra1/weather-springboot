import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('London');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [insights, setInsights] = useState([]);

  const sampleCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
    'Dubai', 'Mumbai', 'Los Angeles', 'Berlin', 'Singapore',
    'Moscow', 'Cairo', 'Istanbul', 'Bangkok', 'Rio de Janeiro',
    'Mexico City', 'Toronto', 'Vancouver', 'Rome', 'Madrid'
  ];

  const weatherConditions = {
    1000: { type: 'sunny' },
    1003: { type: 'cloudy' },
    1006: { type: 'cloudy' },
    1009: { type: 'cloudy' },
    1183: { type: 'rainy' },
    1186: { type: 'rainy' },
    1210: { type: 'snowy' }
  };

  useEffect(() => {
    fetchWeatherData();
    // eslint-disable-next-line
  }, []);

  const fetchWeatherData = async (cityName = city) => {
    setLoading(true);
    setShowError(false);
    
    try {
      const response = await axios.get(
        `http://localhost:8080/Weather/getWeather?city=${cityName}`
      );
      setWeatherData(response.data);
      setCity(cityName);
      generateInsights(response.data);
      updateWeatherTheme(response.data);
      setSearchQuery('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      showErrorModal('Unable to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data) => {
    const newInsights = [];
    const temp = data.current.temp_c;
    const condition = data.current.condition.text.toLowerCase();

    if (temp > 25) {
      newInsights.push({
        icon: '🌡️',
        title: 'Temperature Alert',
        description: 'Warm weather ahead. Stay hydrated and seek shade when outdoors.'
      });
    } else if (temp < 10) {
      newInsights.push({
        icon: '❄️',
        title: 'Cold Weather',
        description: 'Bundle up! Cold temperatures require extra layers for comfort.'
      });
    } else {
      newInsights.push({
        icon: '🌡️',
        title: 'Temperature',
        description: 'Pleasant temperature conditions, perfect for outdoor activities.'
      });
    }

    if (condition.includes('rain')) {
      newInsights.push({
        icon: '🌧️',
        title: 'Rain Alert',
        description: 'Rainy conditions expected. Don\'t forget your umbrella!'
      });
    } else if (condition.includes('cloud')) {
      newInsights.push({
        icon: '☁️',
        title: 'Cloud Cover',
        description: 'Cloudy skies provide natural sun protection.'
      });
    } else if (condition.includes('sunny') || condition.includes('clear')) {
      newInsights.push({
        icon: '☀️',
        title: 'Clear Skies',
        description: 'Perfect weather for outdoor activities and vitamin D!'
      });
    }

    if (temp > 20 && temp < 30 && !condition.includes('rain')) {
      newInsights.push({
        icon: '🏃‍♂️',
        title: 'Activity Tip',
        description: 'Great weather for outdoor exercise and recreational activities!'
      });
    }

    setInsights(newInsights.slice(0, 3));
  };

  const updateWeatherTheme = (data) => {
    const app = document.querySelector('.weather-dashboard');
    if (!app) return;

    const condition = weatherConditions[data.current.condition.code];
    
    app.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'night');
    
    setTimeout(() => {
      if (condition) {
        app.classList.add(condition.type);
      } else if (data.current.is_day === 0) {
        app.classList.add('night');
      } else {
        app.classList.add('cloudy');
      }
    }, 300);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query && query.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      fetchWeatherData(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setSearchQuery('');
    setShowSuggestions(false);
    fetchWeatherData(city);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      showErrorModal('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        fetchWeatherData(randomCity);
      },
      (error) => {
        showErrorModal('Unable to retrieve your location. Please search manually.');
      }
    );
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const hideError = () => {
    setShowError(false);
  };

  const filteredCities = sampleCities
    .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  if (loading) return <div className="loading">Loading...</div>;
  if (!weatherData) return <div>No data available</div>;

  return (
    <div className="weather-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="nav-brand">
          <div className="ai-pulse"></div>
          <h1>Weather Dashboard</h1>
        </div>
        <span className="year">2025</span>
        <div className="nav-actions">
          <button className="location-btn" onClick={getUserLocation}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Panel - Enhanced with search suggestions */}
        <div className="left-panel">
          <div className="location-search">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleSearchSubmit}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a city..."
                autoComplete="off"
              />
              {showSuggestions && filteredCities.length > 0 && (
                <div className="search-suggestions">
                  {filteredCities.map(city => (
                    <div 
                      key={city}
                      className="suggestion-item" 
                      onClick={() => selectCity(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="current-weather">
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
              className="weather-icon"
            />
            <div className="temperature">
              {Math.round(weatherData.current.temp_c)}°
              <span className="temp-feels">
                Feels like {Math.round(weatherData.current.feelslike_c)}°
              </span>
            </div>
            <div className="humidity">
              Humidity: {weatherData.current.humidity}%
            </div>
            <div className="weather-details">
              <span>Wind: {weatherData.current.wind_kph} km/h</span>
              <span>UV: {weatherData.current.uv}</span>
            </div>
          </div>

          <div className="location-info">
            <h3>{weatherData.location.name}</h3>
            <p>
              {weatherData.location.region}, {weatherData.location.country}
            </p>
            <p className="localtime">
              Local Time: {weatherData.location.localtime}
            </p>
          </div>

          {/* AI Insights Section */}
          <div className="insights-panel">
            <div className="insights-header">
              <div className="ai-badge">
                <div className="ai-pulse-small"></div>
                <span>AI Insights</span>
              </div>
            </div>
            <div className="insights-content">
              {insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <div className="insight-icon">{insight.icon}</div>
                  <div className="insight-text">
                    <p><strong>{insight.title}:</strong> {insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="weather-header">
            <span className="weather-service">NATIONAL WEATHER</span>
            <h2>Weather Forecast</h2>
            <h1>{weatherData.current.condition.text}</h1>
            <div className="forecast-time">
              <span>{weatherData.location.localtime}</span>
            </div>
          </div>
          <div className="weather-description">
            <p>
              It is currently {weatherData.current.condition.text} in{' '}
              {weatherData.location.name}.<br /> Temperature:{' '}
              {Math.round(weatherData.current.temp_c)}°C.
            </p>
            <span className="temperature-big">
              {Math.round(weatherData.current.temp_c)}°
            </span>
          </div>

          {/* Weather Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Humidity</span>
                <span className="metric-value">{weatherData.current.humidity}%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Wind Speed</span>
                <span className="metric-value">{weatherData.current.wind_kph} km/h</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">UV Index</span>
                <span className="metric-value">{weatherData.current.uv}</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Pressure</span>
                <span className="metric-value">{weatherData.current.pressure_mb} mb</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="modal">
          <div className="modal-backdrop" onClick={hideError}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Weather Data Unavailable</h3>
              <button className="modal-close" onClick={hideError}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>{errorMessage}</p>
              <button className="btn btn--primary" onClick={() => {
                hideError();
                fetchWeatherData();
              }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;