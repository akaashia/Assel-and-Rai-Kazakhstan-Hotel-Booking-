import { rooms as fallbackRooms } from './mock-data';
import { Room } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

type BackendRoom = {
  id: number;
  hotel_id: number;
  number: string;
  room_type: string;
  capacity: number;
  price: string | number;
  status: string;
};

const categoryKz: Record<string, string> = {
  Luxury: 'Люкс',
  Standard: 'Стандарт',
  Presidential: 'Президенттік',
  Family: 'Отбасылық',
  Business: 'Бизнес',
};

function buildRoomFromApi(room: BackendRoom, index: number): Room {
  const fallback = fallbackRooms[index % fallbackRooms.length];
  const category = room.room_type || fallback.category;
  const price = typeof room.price === 'number' ? room.price : Number(room.price);

  return {
    ...fallback,
    id: String(room.id),
    name: `${category} Room ${room.number}`,
    nameKz: `${categoryKz[category] || category} бөлме ${room.number}`,
    category,
    categoryKz: categoryKz[category] || category,
    description: `Room ${room.number} from PostgreSQL database, hotel ID ${room.hotel_id}.`,
    descriptionKz: `Бұл бөлме PostgreSQL дерекқорынан алынды. Қонақүй ID: ${room.hotel_id}, бөлме нөмірі: ${room.number}.`,
    price: Number.isFinite(price) ? price : fallback.price,
    maxGuests: room.capacity || fallback.maxGuests,
    available: room.status !== 'busy',
  };
}

export async function getRoomsFromApi(): Promise<Room[]> {
  const response = await fetch(`${API_BASE}/rooms`);
  if (!response.ok) throw new Error(`Rooms API error: ${response.status}`);
  const data = (await response.json()) as BackendRoom[];
  return data.map(buildRoomFromApi);
}

export async function askHotelAssistant(question: string): Promise<string> {
  const payload = { question };

  const backendResponse = await fetch(`${API_BASE}/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (backendResponse.ok) {
    const data = await backendResponse.json();
    return data.answer || data.response || 'AI жауап бермеді';
  }

  if (N8N_WEBHOOK_URL) {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (n8nResponse.ok) {
      const data = await n8nResponse.json();
      return data.answer || data.response || 'n8n жауап бермеді';
    }
  }

  throw new Error(`AI API error: ${backendResponse.status}`);
}
