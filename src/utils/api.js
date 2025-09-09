// src/utils/api.js
const API_KEY = import.meta.env.VITE_AVIATION_KEY;
export async function searchFlights(from, to, date){
  try{
    const res = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${from}&arr_iata=${to}&flight_date=${date}`
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.data || [];
  }catch(e){
    console.error(e);
    return [];
  }
}