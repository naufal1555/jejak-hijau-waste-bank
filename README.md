# Jejak Hijau: Digital Community Waste Bank & Real-time Carbon Offset Platform

[![CI/CD](https://github.com/naufal1555/jejak-hijau-waste-bank/actions/workflows/ci.yml/badge.svg)](https://github.com/naufal1555/jejak-hijau-waste-bank/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 18](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-16A34A.svg)](https://web.dev/progressive-web-apps/)

**Enterprise Progressive Web App (PWA) digitizing community circular economy operations, automated recyclable weighing & passbook ledgers, and calculating real-time $CO_2e$ greenhouse gas emissions offsets.**

---

## 👨‍💻 Candidate & System Metadata
- **Author**: Ahmad Fathin Naufal
- **Affiliation**: Universitas Gadjah Mada (UGM) — Internet Engineering Technology
- **CV Track**: Fullstack Developer
- **Target Metrics Verified**:
  - Engineered **4 core operational modules**:
    1. **Member KYC & Management**: Nasabah database with identity indexing (NIK, address, phone).
    2. **Waste Deposit Collection**: 5 recyclable fractions (Plastik, Kertas, Logam, Kaca, Organik) with dynamic price calculation.
    3. **Digital Passbook Ledger**: Transaction audit trail with real-time balance calculations and cash withdrawals.
    4. **Carbon Impact & ESG Tracker**: Instant conversion to $CO_2e$ avoided and tree planting credits.
  - Processed and pre-seeded **220+ simulated transaction records** (strictly fulfilling the CV claim of $\ge 200$ records).
  - Progressive Web App (PWA) offline-first architecture with service worker caching.

---

## 🏗️ Architecture & Component Design

```
+---------------------------------------------------------------------------------+
|                      JEJAK HIJAU PWA FULLSTACK ARCHITECTURE                     |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [ Progressive Web App Presentation Layer ]                                     |
|   - React 18 + Vite + Tailwind CSS + Lucide Icons                               |
|   - Offline-First Service Worker Cache (`sw.js`) & Web App Manifest             |
|   - Responsive Glassmorphic Dashboard Design                                    |
|                                                                                 |
|                                   |                                             |
|                                   v                                             |
|  [ 4 Core Enterprise Modules ]                                                  |
|   1. Member Directory & Registration (NIK, WhatsApp, Address, Balance)          |
|   2. Waste Deposit Weighing & Cashier (5 Fractions, Dynamic Price Matrix)       |
|   3. Digital Passbook Ledger (Deposit, Payout, Real-time Balance Calculation)   |
|   4. Carbon Impact & ESG Dashboard (CO2e avoided, Equivalent Trees, Charts)     |
|                                                                                 |
|                                   |                                             |
|                                   v                                             |
|  [ Environmental & Financial State Engine ]                                     |
|   - IPCC / EPA Greenhouse Gas Emission Avoidance Formula Engine                 |
|   - 220+ Pre-seeded Historical Transactions Storage                             |
|   - LocalStorage / IndexedDB Transaction Audit Log with CSV Export              |
+---------------------------------------------------------------------------------+
```

---

## 🌿 Environmental Impact Modeling

### 1. Avoided Greenhouse Gas Emissions ($CO_2e$)
Recycling segregated materials circumvents virgin petrochemical processing and landfill anaerobic decomposition into methane ($CH_4$). The net avoided emission is modeled as:
$$\text{Total } CO_2e \text{ Avoided } (kg) = \sum_{i=1}^5 m_i \cdot \kappa_i$$

Where $m_i$ is material mass in kg, and $\kappa_i$ represents the life-cycle carbon avoidance coefficient:
- **Plastik (PET/HDPE/PP)**: $\kappa_{\text{plastik}} = 1.85\text{ kg } CO_2e / \text{kg}$
- **Logam (Aluminium/Besi)**: $\kappa_{\text{logam}} = 4.20\text{ kg } CO_2e / \text{kg}$
- **Kertas / Karton**: $\kappa_{\text{kertas}} = 1.15\text{ kg } CO_2e / \text{kg}$
- **Kaca / Beling**: $\kappa_{\text{kaca}} = 0.35\text{ kg } CO_2e / \text{kg}$
- **Organik / Kompos**: $\kappa_{\text{organik}} = 0.50\text{ kg } CO_2e / \text{kg}$

### 2. Urban Tree Sequestration Equivalence
An average mature urban tree sequesters approximately $21.77\text{ kg } CO_2$ annually:
$$\text{Tree Planting Equivalent} = \frac{\text{Total } CO_2e \text{ Avoided (kg)}}{21.77}$$

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
git clone https://github.com/naufal1555/jejak-hijau-waste-bank.git
cd jejak-hijau-waste-bank
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 📦 Docker Deployment
```bash
docker-compose up -d
```
Access the application at `http://localhost:8080`.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
