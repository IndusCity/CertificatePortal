export async function searchAddress(query: string) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch address suggestions');
  }
  const data = await response.json();
  return data.map((item: any) => ({
    display_name: item.display_name,
    lat: item.lat,
    lon: item.lon,
    address: {
      house_number: item.address?.house_number,
      road: item.address?.road,
      city: item.address?.city || item.address?.town,
      state: item.address?.state,
      postcode: item.address?.postcode,
      country: item.address?.country,
      country_code: item.address?.country_code,
    },
  }));
}

