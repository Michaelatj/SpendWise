# 📄 LAPORAN TUGAS KELOMPOK 1 [MID]
## Pengembangan Aplikasi Berbasis Container

---

### 📌 INFORMASI PROYEK & KELOMPOK

* **Nama Aplikasi:** SpendWise — Expense & Budget Tracker
* **Repositori GitHub:** [https://github.com/Michaelatj/SpendWise](https://github.com/Michaelatj/SpendWise)
* **Link Video Dokumentasi:** [https://youtube.com/watch?v=placeholder](https://youtube.com/watch?v=placeholder) *(Ganti dengan URL video kelompok Anda)*
* **File Laporan PDF:** `Tugas01_230101001_Kelompok.pdf`

#### 👥 Anggota Kelompok (3 Orang):
1. **[Nama Anggota 1 - Ketua]** (NIM: `230101001`)
2. **[Nama Anggota 2]** (NIM: `230101002`)
3. **[Nama Anggota 3]** (NIM: `230101003`)

---

## 1. DESKRIPSI APLIKASI & TATA CARA PENGGUNAAN

### 1.1 Deskripsi Aplikasi
**SpendWise** adalah aplikasi web manajemen keuangan & anggaran pribadi yang dirancang untuk berjalan di lingkungan container (**Docker / Podman**). Aplikasi ini mengintegrasikan pencatatan pengeluaran harian, pengelolaan kategori, alokasi anggaran bulanan, serta visualisasi grafik distribusi keuangan pengguna secara real-time.

### 1.2 Fitur CRUD & Fitur Utama:
* **Expense Management (CRUD):**
  * **Create:** Menambah catatan pengeluaran baru (deskripsi, nominal, kategori, metode pembayaran, tanggal).
  * **Read:** Menampilkan daftar transaksi pengeluaran dalam bentuk tabel interaktif.
  * **Update:** Memperbarui data transaksi yang sudah dicatat.
  * **Delete:** Menghapus transaksi pengeluaran.
* **Category Management (CRUD):**
  * **Create/Read/Update/Delete:** Mengelola kategori pengeluaran (Makanan, Transportasi, Tagihan, Hiburan, dll.).
* **Monthly Budget Tracking:**
  * Menetapkan limit anggaran bulanan dan memantau persentase serta sisa anggaran otomatis.
* **Dashboard Visualizer:**
  * Grafik distribusi pengeluaran per kategori & indikator kesehatan keuangan.

### 1.3 Tata Cara Penggunaan:
1. Buka browser dan navigasi ke `http://localhost`.
2. Halaman **Dashboard** akan menampilkan total pengeluaran, sisa anggaran, dan grafik kategori.
3. Untuk mengelola kategori, masuk ke menu **Categories** untuk menambah, mengedit, atau menghapus kategori.
4. Untuk mencatat pengeluaran, masuk ke menu **Expenses** &rarr; klik **Add Expense** &rarr; isi formulir transaksi &rarr; simpan.
5. Untuk menetapkan batas anggaran bulanan, pilih menu **Budget** &rarr; masukkan nominal limit bulanan.

---

## 2. ARSITEKTUR CONTAINER & SUMBER REFERENSI

### 2.1 Arsitektur Aplikasi Multi-Container
SpendWise dibangun menggunakan arsitektur 3-tier containerized microservices:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                       Docker Host                           │
 │                                                             │
 │  ┌─────────────────┐   HTTP   ┌──────────────────────────┐  │
 │  │ Frontend (80)   │ ───────> │ Backend (5000)           │  │
 │  │ React + Nginx   │          │ Node.js Express REST API │  │
 │  └─────────────────┘          └────────────┬─────────────┘  │
 │                                            │                │
 │                                         Database            │
 │                                            │                │
 │                                            ▼                │
 │                               ┌──────────────────────────┐  │
 │                               │ Database (3306)          │  │
 │                               │ MySQL 8.0 (Init + Vol)   │  │
 │                               └──────────────────────────┘  │
 └─────────────────────────────────────────────────────────────┘
```

* **Frontend Container:** Menggunakan Nginx Alpine untuk me-serve static assets React (Vite SPA) dan berfungsi sebagai reverse proxy untuk permintaan `/api`.
* **Backend Container:** Berbasis Node.js 20 Alpine yang menjalankan Express.js REST API service.
* **Database Container:** Menggunakan MySQL 8.0 Official Image dengan auto-initialization script (`init.sql`) dan persistent volume (`db_data`).

### 2.2 Sumber Referensi Kode & Tools:
1. **Node.js Express API:** [https://expressjs.com/](https://expressjs.com/)
2. **MySQL2 Driver:** [https://github.com/sidorares/node-mysql2](https://github.com/sidorares/node-mysql2)
3. **React.js & Vite:** [https://vitejs.dev/](https://vitejs.dev/)
4. **Nginx Web Server:** [https://nginx.org/](https://nginx.org/)
5. **Docker & Docker Compose Documentation:** [https://docs.docker.com/](https://docs.docker.com/)

---

## 3. FILE PENDUKUNG CONTAINERIZATION

### 3.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
ENV NODE_ENV=production PORT=5000
CMD ["npm", "start"]
```

### 3.2 Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 Docker Compose (`docker-compose.yml`)
```yaml
services:
  database:
    image: mysql:8.0
    container_name: spendwise-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: spendwise
      MYSQL_USER: spendwise_user
      MYSQL_PASSWORD: spendwise_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/01-init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpassword"]
      interval: 5s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: spendwise-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: database
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: spendwise
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: spendwise-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  db_data:
```

---

## 4. PETUNJUK MENJALANKAN DOCKER CONTAINER

1. **Pastikan Docker Desktop / Podman sudah aktif.**
2. **Jalankan Perintah Docker Compose:**
   ```bash
   docker compose up -d --build
   ```
3. **Periksa Status Service Container:**
   ```bash
   docker compose ps
   ```
4. **Buka Aplikasi di Browser:**
   Akses `http://localhost`
5. **Menghentikan Container:**
   ```bash
   docker compose down
   ```

---

## 5. CHEKLIS MATRIKS PENILAIAN

| Kriteria Penilaian | Bobot | Status Implementasi | Catatan / Lokasi File |
| :--- | :---: | :---: | :--- |
| **Penggunaan Container** | 40 Poin | ✅ TERSEDIA | Multi-container setup (`docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`). |
| **Penerapan CRUD** | 10 Poin | ✅ TERSEDIA | Full CRUD pada Expense & Category di Frontend React & Backend REST API. |
| **Penerapan Database** | 10 Poin | ✅ TERSEDIA | Database MySQL 8.0 dengan auto-init `database/init.sql` & persistent volume. |
| **Kelengkapan Laporan** | 10 Poin | ✅ TERSEDIA | Laporan PDF `Tugas01_230101001_Kelompok.pdf` & `LAPORAN_TUGAS_MID.md`. |
| **Originalitas** | 30 Poin | ✅ TERSEDIA | Aplikasi SpendWise — Expense & Budget Tracker. |
