export const ROOM_PRICES = {
  'Estándar': 80.00,
  'Suite Junior': 120.00,
  'Suite': 180.00,
  'Cabaña': 90.00,
}

export const SERVICE_PRICES = {
  'Limpieza de habitación': 0,
  'Toallas extra': 0,
  'Reabastecer minibar': 5.00,
  'Room service': 12.00,
  'Desayuno en habitación': 8.00,
  'Transporte': 25.00,
  'Lavandería': 15.00,
  'Información local': 0,
}

export function getRoomPrice(room) {
  if (room?.precio_noche > 0) return Number(room.precio_noche)
  return ROOM_PRICES[room?.tipo] || 80.00
}

export function getServicePrice(service) {
  if (service?.precio > 0) return Number(service.precio)
  return SERVICE_PRICES[service?.titulo] || 0
}

export function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`
}
