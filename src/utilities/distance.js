const axios = require('axios');

const ORS_API_KEY = process.env.ORS_API_KEY; 

async function getDrivingDistance(userCoords, atmCoords) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${userCoords.lng},${userCoords.lat}&end=${atmCoords.lng},${atmCoords.lat}`;
//   const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${ORS_API_KEY}&start=${userCoords.lng},${userCoords.lat}&end=${atmCoords.lng},${atmCoords.lat}`;
  // const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${userCoords.lng},${userCoords.lat}&end=${atmCoords.lng},${atmCoords.lat}`;
  // const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${userCoords.lng},${userCoords.lat}&end=${atmCoords.lng},${atmCoords.lat}`;
  console.log('Calling OpenRouteService with:');
  console.log('User coordinates:', userCoords);
  console.log('ATM coordinates:', atmCoords);
  console.log('Constructed URL:', url);
  try {
    const response = await axios.get(url);
    const distance = response.data.features[0].properties.segments[0].distance; 
    const duration = response.data.features[0].properties.segments[0].duration; 
    return { distance, duration };
  } catch (error) {
    console.error('OpenRouteService error:', error?.response?.data || error.message);
    return { distance: Infinity, duration: Infinity }; 
  }
}

/**
 * Get distances and durations for multiple travel modes (driving, walking, cycling)
 * @param {Object} userCoords - { lat, lng }
 * @param {Object} atmCoords - { lat, lng }
 * @returns {Promise<Object>} - { driving-car: {distance, duration}, foot-walking: {...}, cycling-regular: {...} }
 */
async function getDistanceForAllModes(userCoords, atmCoords) {
  const profiles = ['driving-car', 'foot-walking', 'cycling-regular'];
  const results = {};
  for (const profile of profiles) {
    const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${ORS_API_KEY}&start=${userCoords.lng},${userCoords.lat}&end=${atmCoords.lng},${atmCoords.lat}`;
    try {
      const response = await axios.get(url);
      const distance = response.data.features[0].properties.segments[0].distance;
      const duration = response.data.features[0].properties.segments[0].duration;
      results[profile] = { distance, duration };
    } catch (error) {
      results[profile] = { distance: null, duration: null, error: error.message };
    }
  }
  return results;
}

module.exports = { getDrivingDistance, getDistanceForAllModes };