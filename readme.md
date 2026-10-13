# Weather App

A lightweight desktop weather app that lives in your system tray. It shows the current temperature right on the tray icon and updates in real time.

## Features

- Shows the current weather condition and temperature
- Runs in the system tray, with the temperature displayed on the tray icon
- Updates in real time
- Caches weather data to avoid unnecessary requests
- Set your location by latitude and longitude
- Remembers your last saved location when the app starts

## Tech Stack

- Electron
- JavaScript (Node.js)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Glenardd/weather-app.git
cd weather-app
npm install
```

### Run

```bash
npm start
```

## Usage

1. Launch the app. It appears in your system tray with the current temperature.
2. Open it to see the weather condition and temperature.
3. Enter a latitude and longitude to change location. It's saved and reused the next time you start the app.

## Project Structure

```
weather-app/
├── public/             # UI files
├── index.js            # Main process (window and tray)
├── preload.js          # Preload script
├── weather_codes.json  # Weather code to description mapping
└── package.json
```

## Roadmap

- [x] Cache weather data
- [x] Display weather condition and temperature
- [x] Run as a tray process
- [x] Show temperature on the tray icon
- [x] Real-time updates
- [x] Change location by latitude and longitude
- [x] Save location between launches

## Author

Jan ([@Glenardd](https://github.com/Glenardd))
