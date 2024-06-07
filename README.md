# Weather App

This is a mobile weather application built using React Native and Expo, which fetches weather data from the OpenWeatherMap API. The app displays the current weather based on the user's location, as well as the weather forecast for the next three days at 12:00 PM.

## Features

- Displays current weather based on user's location.
- Allows users to input longitude and latitude to get weather data for a specific location.
- Shows a 3-day weather forecast at 12:00 PM in three separate tiles.
- Uses animations to display weather conditions (e.g., rain, sunny).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Xaroo/weather-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd weather-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Expo development server:

   ```bash
   npx expo start
   ```

## Usage

1. Launch the app on an emulator or a physical device.
2. Allow location permissions when prompted.
3. The app will display the current weather for your location.
4. To get weather data for a specific location, enter the longitude and latitude in the provided text fields and press the button.
5. The app will update to show the current weather and a 3-day forecast for the specified location.

## API Key

The app uses the OpenWeatherMap API. You need to have an API key to use the app. Replace the placeholder API key in the code with your own API key.

```javascript
const O_W_KEY = "your_openweathermap_api_key";
```
