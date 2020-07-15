import { Signale } from 'signale';
import axios from 'axios';
import {
  GoogleMapsResponse,
  IndividualGeolocation,
  AddressComponent,
  ComposeAddress,
} from './types';

const log = new Signale();

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

export const processGeolocation = (
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

    log.success('returned valid individual geolocation data');

    return i;
  }

  if (data && data.status === 'ZERO_RESULTS') {
    log.error(
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
    log.info(`requesting google with address ${address}...`);
    const response: { data: GoogleMapsResponse } = await axios.post(
      'https://maps.googleapis.com/maps/api/geocode/json',
      undefined,
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    log.success('google maps responded!');

    if (response.data && response.data.error_message) {
      log.error(
        `google maps response failed (email, address): '${email}', ${address}`,
        response.data.error_message
      );
      return processGeolocation(email, address, undefined);
    }

    return processGeolocation(email, address, response.data);
  } catch (e) {
    log.error(
      `google maps response failed (email, address): '${email}', ${address}`,
      e
    );
    return processGeolocation(email, address, undefined);
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
  const a = address ? `${address},` : '';
  const n = neighborhood ? `${neighborhood},` : '';
  const c = city ? `${city},` : '';
  const s = state ? `${state},` : '';
  const z = cep ? cep + ',BR' : '';
  const composeSearchAddress = a + n + c + s + z;

  return await getGoogleGeolocation(composeSearchAddress, email);
};
