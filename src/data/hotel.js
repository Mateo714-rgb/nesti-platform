export const hotel = {
  name: "Casa del Árbol",
  tagline: "Boutique Lodge · Mindo, Ecuador",
  logo: null,
  primaryColor: "#147474",
  checkIn: "2025-03-15",
  checkOut: "2025-03-18",
  guestName: "Sebastián",
}

export const room = {
  number: "204",
  name: "Suite Orquídea",
  floor: "2do piso",
  type: "Suite Junior",
  description: "Suite con vista al jardín, balcón privado y bañera de inmersión. Diseñada para desconectarse en medio de la naturaleza.",
  features: ["King bed", "Balcón privado", "Bañera deep soak", "Wi-Fi 200 Mbps", "AC + ventilador techo", "Cafetera Nespresso"],
  checkInTime: "3:00 PM",
  checkOutTime: "12:00 PM",
}

export const services = [
  { id: 'housekeeping', category: 'habitación', icon: '🛏️', title: 'Limpieza de habitación', desc: 'Solicita limpieza o cambio de ropa de cama', eta: '20 min' },
  { id: 'towels', category: 'habitación', icon: '🪣', title: 'Toallas extra', desc: 'Toallas de baño o de piscina', eta: '10 min' },
  { id: 'minibar', category: 'habitación', icon: '🧊', title: 'Reabastecer minibar', desc: 'Agua, jugos, snacks disponibles', eta: '15 min' },
  { id: 'roomservice', category: 'alimentos', icon: '🍽️', title: 'Room service', desc: 'Menú disponible de 7am a 10pm', eta: '35 min' },
  { id: 'breakfast', category: 'alimentos', icon: '☕', title: 'Desayuno en habitación', desc: 'Disfruta el desayuno sin salir del cuarto', eta: '25 min' },
  { id: 'transport', category: 'logística', icon: '🚗', title: 'Transporte', desc: 'Taxi al aeropuerto, city tour, excursiones', eta: '30 min' },
  { id: 'laundry', category: 'logística', icon: '👕', title: 'Lavandería', desc: 'Entrega en bolsa antes de las 9am, lista a las 6pm', eta: '9h' },
  { id: 'info', category: 'logística', icon: '📍', title: 'Información local', desc: 'Restaurantes, actividades, mapas de Mindo', eta: '5 min' },
]

export const requests = [
  { id: 1, room: '101', guest: 'Ana Torres', service: 'Toallas extra', time: '09:14', status: 'pending', note: '' },
  { id: 2, room: '305', guest: 'Jorge Lima', service: 'Room service', time: '09:22', status: 'accepted', note: 'Sin gluten por favor' },
  { id: 3, room: '204', guest: 'Sebastián Ruiz', service: 'Transporte aeropuerto', time: '09:31', status: 'pending', note: 'Vuelo 1:30pm, necesito salir a las 11am' },
  { id: 4, room: '112', guest: 'Sofía Mendez', service: 'Limpieza', time: '09:45', status: 'done', note: '' },
  { id: 5, room: '208', guest: 'Marco Reyes', service: 'Información local', time: '09:51', status: 'pending', note: '¿Dónde hay buenas rutas de senderismo?' },
]
