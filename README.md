# CareSlot: Doctor Booking (Next.js + MongoDB)

## Run it
1. Node 20.9+ and `npm install`
2. Copy `.env.example` to `.env.local` and fill it in
3. `npm run dev`
4. Open http://localhost:3000/api/seed once (creates treatments, doctors, admin)
5. Booking page: http://localhost:3000  |  Admin: http://localhost:3000/admin/login

## Folder structure
```
src/
├── app/                     ROUTING ONLY (Next.js App Router)
│   ├── page.js              home page (hero, treatments, about)
│   ├── book/page.js         booking page (treatment -> doctor -> slot)
│   ├── admin/               login, dashboard, forgot/reset password pages
│   └── api/                 thin route files: HTTP method -> controller
│
├── client/                  BROWSER SIDE
│   ├── components/          Header (nav), Footer, AuthCard
│   └── services/            axios calls (api.js, bookingService, adminService)
│
└── server/                  BACKEND SIDE
    ├── config/db.js         MongoDB connection
    ├── models/              Mongoose schemas (Treatment, Doctor, Appointment, Admin)
    ├── controllers/         business logic for each resource
    ├── middleware/          adminAuth.js (verifies the JWT cookie)
    └── utils/               mailer.js (Nodemailer), token.js (JWT signing)
```

## Request flow (say this in the interview)
Page -> service (axios) -> `app/api/.../route.js` -> controller -> model -> MongoDB

- Pages only show UI and call service functions. They never write axios directly.
- Route files are 2 lines: they map GET/POST/PATCH to a controller function.
- Controllers hold the logic: validation, DB queries, sending email.
- Models define the data. Utils and middleware are small shared helpers.

## Key decisions
- **Auth:** bcrypt hashes passwords, JWT is stored in an httpOnly cookie (JavaScript can't steal it).
- **Forgot password:** random token emailed to the admin, only its SHA-256 hash is stored, expires in 15 minutes, works once.
- **More admins:** a logged-in admin opens `/admin/new-admin` to create another login. The API checks the JWT cookie first, so the public can't create admins.
- **Double booking:** the server re-checks the slot before saving, so two users can't take the same one.
- **Emails:** Nodemailer sends to patient and admin; a mail failure never cancels a saved booking.
