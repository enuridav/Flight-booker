 # 🛫 Flight Booker

A modern flight booking demo built with **React + Vite**.  
It lets you search for flights, preview results, and simulate bookings with a smooth, glassy UI.

![screenshot](public/preview.png)

---

## ✨ Features
- ⚡ **Instant results** – fast and responsive search  
- 🧭 **Smart autocomplete** – airports with country flags  
- 🧳 **Booking flow** – select flight, confirm, and get a booking reference  
- 🔒 **Privacy-first** – all state handled on device (no real backend)  
- 🎨 **Modern UI** – glassmorphism, gradients, fully responsive  

---

## 🛠️ Tech Stack
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- React Router (multi-page flow)
- Context API (global state management)
- Custom Components (AirportPicker, SearchForm, Loader, etc.)
- CSS with glassmorphism and gradient design

---

## 📂 Pages
- `/` **Home** → Hero + Search Form  
- `/results` → Flight results list + filters  
- `/booking` → Passenger form + validation  
- `/confirmation` → Summary + booking reference  

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/enuridav/Flight-booker.git
cd Flight-booker
npm install
npm run dev
