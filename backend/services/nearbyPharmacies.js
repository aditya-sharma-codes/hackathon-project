const http = require('http');
const https = require('https');

const NOMINATIM_BASE_URL = process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org/';
const PHOTON_BASE_URL = process.env.PHOTON_BASE_URL || 'https://photon.komoot.io/';
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const OVERPASS_FALLBACK_URL = process.env.OVERPASS_FALLBACK_URL || 'https://overpass.private.coffee/api/interpreter';
const OVERPASS_EXTRA_URL = process.env.OVERPASS_EXTRA_URL || 'https://maps.mail.ru/osm/tools/overpass/api/interpreter';
const USER_AGENT = process.env.OSM_USER_AGENT || 'GramHealth/1.0 (local rural-health pharmacy locator)';
const MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
const GEOCODE_TTL_MS = 24 * 60 * 60 * 1000;
const PHARMACY_TTL_MS = 10 * 60 * 1000;

const geocodeCache = new Map();
const pharmacyCache = new Map();
const overpassUnavailableUntil = new Map();
let nominatimQueue = Promise.resolve();
let lastNominatimRequestAt = 0;
let overpassQueue = Promise.resolve();
let lastOverpassRequestAt = 0;

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function readCache(cache, key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function writeCache(cache, key, value, ttl) {
  if (cache.size >= 100) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expiresAt: Date.now() + ttl });
}

function requestJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body || '';
    const transport = url.protocol === 'http:' ? http : https;
    const request = transport.request(url, {
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'User-Agent': USER_AGENT,
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
        ...options.headers
      },
      timeout: options.timeout || 20000
    }, response => {
      let responseBody = '';

      response.setEncoding('utf8');
      response.on('data', chunk => {
        responseBody += chunk;
        if (Buffer.byteLength(responseBody) > MAX_RESPONSE_BYTES) {
          response.destroy(new Error('Map service response was too large'));
        }
      });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(Object.assign(
            new Error(`Map service returned HTTP ${response.statusCode}`),
            {
              status: response.statusCode,
              retryAfterSeconds: Number(response.headers['retry-after']) || 0
            }
          ));
        }

        try {
          resolve(JSON.parse(responseBody));
        } catch {
          reject(new Error('Map service returned invalid JSON'));
        }
      });
    });

    request.on('timeout', () => request.destroy(new Error('Map service request timed out')));
    request.on('error', reject);
    request.end(body);
  });
}

function parseCoordinates(location) {
  const match = location.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

  return {
    latitude,
    longitude,
    displayName: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  };
}

async function requestNominatim(url) {
  const task = async () => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const elapsed = Date.now() - lastNominatimRequestAt;
      if (elapsed < 1100) await delay(1100 - elapsed);

      try {
        return await requestJson(url, { timeout: 15000 });
      } catch (error) {
        if (error.status !== 429 || attempt === 1) throw error;
        await delay(Math.max(2000, error.retryAfterSeconds * 1000));
      } finally {
        lastNominatimRequestAt = Date.now();
      }
    }
  };

  const resultPromise = nominatimQueue.then(task, task);
  nominatimQueue = resultPromise.catch(() => {});
  return resultPromise;
}

async function geocodeLocation(location) {
  const coordinates = parseCoordinates(location);
  if (coordinates) return coordinates;

  const cacheKey = location.trim().toLowerCase();
  const cached = readCache(geocodeCache, cacheKey);
  if (cached) return cached;

  const url = new URL('search', NOMINATIM_BASE_URL.endsWith('/')
    ? NOMINATIM_BASE_URL
    : `${NOMINATIM_BASE_URL}/`);
  url.searchParams.set('q', location);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '1');
  let result;
  try {
    const results = await requestNominatim(url);
    if (Array.isArray(results) && results.length) {
      result = {
        latitude: Number(results[0].lat),
        longitude: Number(results[0].lon),
        displayName: results[0].display_name || location
      };
    }
  } catch (error) {
    console.warn('Nominatim geocoding unavailable:', error.message);
  }

  if (!result) result = await geocodeWithPhoton(location);
  if (!result) return null;

  writeCache(geocodeCache, cacheKey, result, GEOCODE_TTL_MS);
  return result;
}

async function requestOverpass(endpoint, body) {
  const task = async () => {
    const elapsed = Date.now() - lastOverpassRequestAt;
    if (elapsed < 3000) await delay(3000 - elapsed);

    try {
      return await requestJson(new URL(endpoint), {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 12000
      });
    } finally {
      lastOverpassRequestAt = Date.now();
    }
  };

  const resultPromise = overpassQueue.then(task, task);
  overpassQueue = resultPromise.catch(() => {});
  return resultPromise;
}

async function geocodeWithPhoton(location) {
  const url = new URL('api/', PHOTON_BASE_URL.endsWith('/')
    ? PHOTON_BASE_URL
    : `${PHOTON_BASE_URL}/`);
  url.searchParams.set('q', location);
  url.searchParams.set('limit', '1');
  url.searchParams.set('lang', 'en');

  const data = await requestJson(url, { timeout: 15000 });
  const feature = data.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const properties = feature.properties || {};
  return {
    latitude: Number(coordinates[1]),
    longitude: Number(coordinates[0]),
    displayName: [
      properties.name,
      properties.city || properties.district,
      properties.state,
      properties.country
    ].filter(Boolean).join(', ') || location
  };
}

function haversineDistance(latitude1, longitude1, latitude2, longitude2) {
  const earthRadiusKm = 6371;
  const toRadians = degrees => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) *
    Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatAddress(tags) {
  if (tags['addr:full']) return tags['addr:full'];

  const street = [tags['addr:housenumber'], tags['addr:street']]
    .filter(Boolean)
    .join(' ');
  return [
    street,
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:postcode']
  ].filter(Boolean).join(', ') || 'Address not available';
}

function formatPharmacy(element, origin) {
  const tags = element.tags || {};
  const latitude = Number(element.lat ?? element.center?.lat);
  const longitude = Number(element.lon ?? element.center?.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const distanceKm = haversineDistance(
    origin.latitude,
    origin.longitude,
    latitude,
    longitude
  );

  return {
    id: `osm-${element.type}-${element.id}`,
    name: tags['name:en'] || tags.name || tags.brand || 'Medical Store / Pharmacy',
    address: formatAddress(tags),
    distance: `${distanceKm < 1 ? distanceKm.toFixed(1) : distanceKm.toFixed(1)} km`,
    distanceKm,
    phone: tags['contact:phone'] || tags.phone || tags.mobile || 'Not available',
    hours: tags.opening_hours || 'Hours not specified',
    latitude,
    longitude,
    mapUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`
  };
}

function createBoundingBox(origin, radiusMetres) {
  const latitudeSpan = radiusMetres / 111320;
  const longitudeSpan = radiusMetres /
    (111320 * Math.max(0.2, Math.cos(origin.latitude * Math.PI / 180)));

  return {
    south: origin.latitude - latitudeSpan,
    west: origin.longitude - longitudeSpan,
    north: origin.latitude + latitudeSpan,
    east: origin.longitude + longitudeSpan
  };
}

function formatNominatimPharmacy(place, origin) {
  const latitude = Number(place.lat);
  const longitude = Number(place.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const distanceKm = haversineDistance(
    origin.latitude,
    origin.longitude,
    latitude,
    longitude
  );
  const extras = place.extratags || {};
  const address = place.display_name || 'Address not available';
  const name = place.namedetails?.name || place.name ||
    address.split(',')[0] || 'Medical Store / Pharmacy';

  return {
    id: `osm-${place.osm_type || 'place'}-${place.osm_id || `${latitude}-${longitude}`}`,
    name,
    address,
    distance: `${distanceKm.toFixed(1)} km`,
    distanceKm,
    phone: extras['contact:phone'] || extras.phone || extras.mobile || 'Not available',
    hours: extras.opening_hours || 'Hours not specified',
    latitude,
    longitude,
    mapUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`
  };
}

async function queryPharmaciesWithNominatim(origin, radiusMetres) {
  const bounds = createBoundingBox(origin, radiusMetres);
  const url = new URL('search', NOMINATIM_BASE_URL.endsWith('/')
    ? NOMINATIM_BASE_URL
    : `${NOMINATIM_BASE_URL}/`);
  url.searchParams.set('q', 'pharmacy');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '20');
  url.searchParams.set('bounded', '1');
  url.searchParams.set('viewbox', `${bounds.west},${bounds.north},${bounds.east},${bounds.south}`);
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('extratags', '1');
  url.searchParams.set('namedetails', '1');

  const places = await requestNominatim(url);
  return (Array.isArray(places) ? places : [])
    .map(place => formatNominatimPharmacy(place, origin))
    .filter(pharmacy => pharmacy && pharmacy.distanceKm <= radiusMetres / 1000)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 12)
    .map(({ distanceKm, ...pharmacy }) => pharmacy);
}

async function queryNearbyPharmacies(origin, radiusMetres) {
  const cacheKey = `${origin.latitude.toFixed(4)},${origin.longitude.toFixed(4)},${radiusMetres}`;
  const cached = readCache(pharmacyCache, cacheKey);
  if (cached) return cached;

  const bounds = createBoundingBox(origin, radiusMetres);
  const boundingBox = [bounds.south, bounds.west, bounds.north, bounds.east].join(',');
  const query = `[out:json][timeout:25];
(
  nwr["amenity"="pharmacy"](${boundingBox});
  nwr["shop"="chemist"](${boundingBox});
);
out center tags;`;
  const body = `data=${encodeURIComponent(query)}`;
  const endpoints = [...new Set([
    OVERPASS_URL,
    OVERPASS_FALLBACK_URL,
    OVERPASS_EXTRA_URL
  ].filter(Boolean))];
  let data;
  let lastError;

  for (const endpoint of endpoints) {
    if ((overpassUnavailableUntil.get(endpoint) || 0) > Date.now()) continue;

    try {
      data = await requestOverpass(endpoint, body);
      if (data.remark) throw new Error(`Map search could not complete: ${data.remark}`);
      break;
    } catch (error) {
      lastError = error;
      data = null;
      overpassUnavailableUntil.set(endpoint, Date.now() + 2 * 60 * 1000);
      console.warn(`Overpass endpoint unavailable (${new URL(endpoint).host}):`, error.message);
    }
  }

  if (!data) {
    try {
      const pharmacies = await queryPharmaciesWithNominatim(origin, radiusMetres);
      writeCache(pharmacyCache, cacheKey, pharmacies, PHARMACY_TTL_MS);
      return pharmacies;
    } catch (fallbackError) {
      console.warn('Nominatim pharmacy fallback unavailable:', fallbackError.message);
      throw lastError || fallbackError || new Error('No map search service is available');
    }
  }

  const overpassPharmacies = (data.elements || [])
    .map(element => formatPharmacy(element, origin))
    .filter(pharmacy => pharmacy && pharmacy.distanceKm <= radiusMetres / 1000);

  const seen = new Set();
  const pharmacies = overpassPharmacies
    .filter(pharmacy => {
      const key = `${pharmacy.latitude.toFixed(5)},${pharmacy.longitude.toFixed(5)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 12)
    .map(({ distanceKm, ...pharmacy }) => pharmacy);

  writeCache(pharmacyCache, cacheKey, pharmacies, PHARMACY_TTL_MS);
  return pharmacies;
}

async function findNearbyPharmacies(location, radiusMetres = 10000) {
  const origin = await geocodeLocation(location);
  if (!origin) {
    throw Object.assign(new Error('Location not found. Try entering a city, district, and state.'), {
      status: 404
    });
  }

  let searchRadiusMetres = radiusMetres;
  let pharmacies = await queryNearbyPharmacies(origin, searchRadiusMetres);

  if (!pharmacies.length && searchRadiusMetres < 25000) {
    searchRadiusMetres = 25000;
    pharmacies = await queryNearbyPharmacies(origin, searchRadiusMetres);
  }

  return {
    pharmacies,
    location: {
      query: location,
      displayName: origin.displayName,
      latitude: origin.latitude,
      longitude: origin.longitude
    },
    source: 'openstreetmap',
    searchRadiusKm: searchRadiusMetres / 1000,
    attribution: '© OpenStreetMap contributors',
    attributionUrl: 'https://www.openstreetmap.org/copyright'
  };
}

module.exports = { findNearbyPharmacies };
