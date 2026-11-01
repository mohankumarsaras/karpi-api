# KARPI – Modern IT & Computer Science Learning Platform

**KARPI** is an educational initiative dedicated to helping college students, graduates, and aspiring IT professionals develop practical technical skills, gain real-world industry competence, and excel in technical careers.

The platform provides comprehensive learning experiences through **Online Live Classes**, **Offline Technical Coaching**, **Hands-on Workshops**, **College Seminars**, **Webinars**, and **Placement Mentorship**.

---

## 🏗️ Architecture & Project Structure

The project is structured into two independent, modern TypeScript applications:

```text
karpi/
├── karpi-ui/                 # Frontend Web Application (React + Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Common, Layout, Course, and Program components
│   │   ├── pages/            # 8 Core Public Pages (Home, About, Courses, CourseDetails, Programs, Events, Gallery, Contact)
│   │   ├── services/         # Axios REST API client
│   │   ├── types/            # TypeScript domain interfaces
│   │   └── App.tsx           # React Router DOM configuration
│   └── package.json
│
├── karpi-api/                # Backend REST API (NestJS + TypeScript + TypeORM + MySQL)
│   ├── src/
│   │   ├── courses/          # Courses & Categories module
│   │   ├── programs/         # Learning Programs ecosystem module
│   │   ├── events/           # Webinars, Seminars & Workshops module
│   │   ├── gallery/          # Verified Photos & Lab Sessions module
│   │   ├── testimonials/     # Student feedback & success stories module
│   │   ├── achievements/     # Trust statistics module
│   │   ├── enquiries/        # Student course/batch enquiry handling & DTO validation
│   │   ├── contact/          # General contact & College seminar requests
│   │   ├── health/           # System health check endpoint
│   │   ├── seed.ts           # Realistic database seeder
│   │   └── main.ts           # Global validation, CORS, and Swagger setup
│   └── package.json
│
└── README.md
```

---

## 🎨 Brand Identity & Design System

- **Primary**: Deep Navy (`#14213D`)
- **Secondary**: Electric Blue (`#2563EB`)
- **Accent**: Vibrant Orange (`#F97316`)
- **Background**: Off-white (`#F8FAFC`)
- **Surface**: White (`#FFFFFF`)
- **Text**: Dark Slate (`#1E293B`)
- **Typography**: Inter / Modern Sans-Serif

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on v22)
- **MySQL**: 8.0+ running on `localhost:3306`

### 1. Database Configuration
Ensure MySQL has a database named `karpi_db`.
```sql
CREATE DATABASE IF NOT EXISTS karpi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup (`karpi-api`)
```bash
cd karpi-api

# Install dependencies
npm install

# Run database seeder (populates courses, programs, events, testimonials, stats)
npm run seed

# Start development server
npm run start:dev
```
- API Base URL: `http://localhost:3000/api/v1`
- Swagger Interactive Documentation: `http://localhost:3000/api/v1/docs`

### 3. Frontend Setup (`karpi-ui`)
```bash
cd karpi-ui

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- Frontend application runs at: `http://localhost:5173`

---

## 📄 Pages Implemented

1. **Home Page (`/`)**:
   - Hero section with value proposition & immediate CTAs.
   - Trust indicators & verified metrics (`1,500+` students, `50+` seminars, `94%` practical lab satisfaction).
   - About KARPI overview, Mission, and Vision.
   - 6 Core Learning Programs cards.
   - Popular Courses with skill badges and duration metadata.
   - 4-Step Student Workflow: **Discover → Learn → Build → Grow**.
   - Why Students Choose KARPI advantage grid.
   - Student success stories & testimonials.
   - Upcoming live webinars and campus events.
   - Conversion CTA section and professional footer.

2. **About Us (`/about`)**:
   - Our story, mission, and vision.
   - Code-over-slides philosophy and core values.
   - Comparative analysis table: Traditional IT Coaching vs. KARPI Practical Learning.
   - College and Institutional partnership pledge.

3. **Courses Catalog (`/courses`)**:
   - Course listings with live search and category pills.
   - Filter by Skill Level (*Beginner*, *Intermediate*, *Advanced*, *All Levels*).
   - Filter by Learning Mode (*Online Live*, *Offline Classroom*, *Hybrid*).

4. **Course Details (`/courses/:slug`)**:
   - Complete syllabus breakdown with topics and hands-on lab exercises.
   - Learning objectives, target audience, prerequisites, and capstone project details.
   - Dynamic related courses recommendations.
   - Sticky course enrollment and syllabus enquiry drawer.

5. **Programs & Services (`/programs`)**:
   - Deep dive into Online Live Classes, Offline Technical Coaching, Technical Webinars, College Seminars, Hands-on Workshops, and Career Placement Guidance.

6. **Events & Seminars (`/events`)**:
   - Upcoming and completed events filterable by type (*Webinar*, *Seminar*, *Workshop*).
   - Registration status (*Open*, *Filling Fast*, *Completed*).
   - Speaker profiles, dates, and venue/platform links.

7. **Photo Gallery & Achievements (`/gallery`)**:
   - Filterable photo grid across verified categories: Seminars, Workshops, Training Sessions, Student Participation, Certifications.
   - Interactive Lightbox view with detailed descriptions.

8. **Contact Us (`/contact`)**:
   - Contact form with client-side and backend DTO validation.
   - Specific option for College Seminar / On-Campus talk requests.
   - Direct phone, email, operating hours, and campus hub address.

---

## 🛡️ Security & Quality Standards
- **DTO Validation**: Every incoming payload validated through NestJS `ValidationPipe` with `class-validator`.
- **SQL Injection Protection**: TypeORM parameterized query builders and repository methods.
- **CORS & Environment Configuration**: Configured for seamless communication between `karpi-ui` (port 5173) and `karpi-api` (port 3000).
- **TypeScript Strictness**: Type-safe end-to-end between frontend types and backend entities.

