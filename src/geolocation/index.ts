import axios from 'axios';
import {
  GoogleMapsResponse,
  IndividualGeolocation,
  AddressComponent,
  ComposeAddress,
  BrasilApiResponse,
  LatLngAddressWithOpenCage,
  BrasilApiResponseData,
  OpenCageResponse,
} from './types';
import logger from '../logger';

const log = logger.child({ module: 'geolocation' });

const getCityStateAndZipcode = (
  addressComponents: AddressComponent
): Array<string> => {
  let state = '';
  let city = '';
  let zipcode = '';
  let country = '';

  addressComponents.forEach(({ types, short_name: shortName }) => {
    if (types.includes('postal_code')) {
      zipcode = shortName;
    }
    if (types.includes('administrative_area_level_1')) {
      state = shortName;
    }
    if (types.includes('administrative_area_level_2')) {
      city = shortName;
    } else if (types.includes('locality')) {
      city = shortName;
    }
    if (types.includes('country')) {
      country = shortName;
    }
  });

  if (country !== 'BR') {
    city = 'Internacional';
    zipcode = 'Internacional';
    state = 'INT';
  }

  return [state, city, zipcode];
};

export const processGoogleResponse = (
  userEmail: string,
  searchAddress: string,
  data?: GoogleMapsResponse
) => {
  if (data && data.status === 'OK') {
    const {
      results: [
        {
          geometry: {
            location: { lat = '', lng = '' },
          },
          address_components: addressComponents,
          formatted_address: address = '',
        },
      ],
    } = data;

    const [state, city, zipcode] = getCityStateAndZipcode(addressComponents);
    const latitude = typeof lat === 'string' ? lat : lat.toFixed(3);
    const longitude = typeof lng === 'string' ? lng : lng.toFixed(3);
    const i: IndividualGeolocation = {
      latitude,
      longitude,
      address,
      state,
      city,
      cep: zipcode,
    };

    // log(i);

    log.info('returned valid individual geolocation data');

    return i;
  }

  if (data && data.status === 'ZERO_RESULTS') {
    log.warn(
      `google maps return with zero result (email, address): '${userEmail}', ${searchAddress}`
    );
  }

  const i: IndividualGeolocation = {
    latitude: null,
    longitude: null,
    address: `Endereço não encontrado - ${searchAddress}`,
    state: null,
    city: 'ZERO_RESULTS',
    cep: 'ZERO_RESULTS',
  };

  return i;
};

export const getGoogleGeolocation = async (address: string, email: string) => {
  try {
    const { GOOGLE_MAPS_API_KEY } = process.env;
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error(
        'Please specify the `GOOGLE_MAPS_API_KEY` environment variable.'
      );
    }

    log.info(`requesting google with address ${address}...`);
    const response: { data: GoogleMapsResponse } = await axios.post(
      'https://maps.googleapis.com/maps/api/geocode/json',
      undefined,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    log.info('google maps responded!');

    if (response.data && response.data.error_message) {
      log.warn(
        `google maps response failed (email, address): '${email}', ${address} %o`,
        response.data.error_message
      );
      return processGoogleResponse(email, address, undefined);
    }

    return processGoogleResponse(email, address, response.data);
  } catch (e) {
    log.warn(
      `google maps response failed (email, address): '${email}', ${address} %o`,
      e
    );
    return processGoogleResponse(email, address, undefined);
  }
};

const getLatLngAddressWithOpenCage = async (
  { state, city, neighborhood, street }: BrasilApiResponseData,
  email: string
): Promise<LatLngAddressWithOpenCage> => {
  const completeAddress = `${street}, ${neighborhood}, ${city}, ${state}`;
  const apikey = process.env.GEOCODING_API_KEY;
  const apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  const requestUrl = `${apiUrl}?key=${apikey}&q=${encodeURIComponent(
    completeAddress
  )}&pretty=1&no_annotations=1`;

  try {
    log.info(
      `requesting open cage with complete address ${completeAddress}...`
    );

    const geolocation: OpenCageResponse = await axios.get(requestUrl);

    log.info(`Open cage responded!`);

    return {
      latitude: geolocation[0].geometry.lat.toString(),
      longitude: geolocation[0].geometry.lng.toString(),
      address: geolocation[0].formatted,
    };
  } catch (e) {
    log.error(
      `Open cage response failed (email, zipcode): '${email}', ${completeAddress} %o`,
      e
    );

    return {
      latitude: null,
      longitude: null,
      address: null,
    };
  }
};

const getBrasilApiLocation = async (
  zipcode: string,
  email: string
): Promise<IndividualGeolocation> => {
  const geolocationUnkown: IndividualGeolocation = {
    latitude: null,
    longitude: null,
    address: `Endereço não encontrado - ${zipcode}`,
    state: null,
    city: 'ZERO_RESULTS',
    cep: 'ZERO_RESULTS',
  };

  try {
    if (!process.env.GEOCODING_API_KEY) {
      throw new Error(
        'Please specify the `GEOCODING_API_KEY` environment variable.'
      );
    }

    log.info(`requesting BrasilAPI with zipcode ${zipcode}...`);
    const response: BrasilApiResponse = await axios.get(
      `https://brasilapi.com.br/api/cep/v1/${zipcode}`
    );
    log.info('BrasilAPI responded!');

    const { state, city, cep } = response.data;

    const { latitude, longitude, address } = await getLatLngAddressWithOpenCage(
      response.data,
      email
    );

    if (response.statusText === 'OK' && latitude && longitude && address) {
      return {
        latitude,
        longitude,
        address,
        state,
        city,
        cep,
      };
    }

    return geolocationUnkown;
  } catch (e) {
    log.error(
      `BrasilAPI response failed (email, zipcode): '${email}', ${zipcode} %o`,
      e
    );

    return geolocationUnkown;
  }
};

export default async ({
  state,
  city,
  cep,
  address,
  neighborhood,
  email,
}: ComposeAddress): Promise<IndividualGeolocation> => {
  if (cep) {
    return getBrasilApiLocation(cep || '', email);
  }

  const a = address ? `${address},` : '';
  const n = neighborhood ? `${neighborhood},` : '';
  const c = city ? `${city},` : '';
  const s = state ? `${state},` : '';
  const z = cep ? cep + ',BR' : '';
  const composeSearchAddress = a + n + c + s + z;

  return getGoogleGeolocation(composeSearchAddress, email);
};
