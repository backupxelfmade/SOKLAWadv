# SOK Law Associates Website

A modern, responsive web application for SOK Law Associates - a premier law firm providing comprehensive legal services in Kenya. Built with React, TypeScript, and Vite, powered by Supabase for backend services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running Locally](#running-locally)
  - [Build for Production](#build-for-production)
- [Directory Structure](#directory-structure)
- [Key Components](#key-components)
- [API & Services](#api--services)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Performance Optimizations](#performance-optimizations)
- [Contributing](#contributing)

---

## Overview

SOK Law Associates website is a comprehensive legal services platform featuring:

- **Service Catalog**: Display of specialized legal services (Civil/Criminal Litigation, Corporate Law, Intellectual Property, Real Estate, etc.)
- **Team Directory**: Team member profiles with categories (Partners, Associates, Administrative staff, etc.)
- **Blog System**: Integration with Caisy CMS for legal insights and news
- **Careers Portal**: Job listings management with application support
- **Gallery**: Showcase of firm activities and events
- **Contact & Consultation**: Client inquiry management with email notifications
- **WhatsApp Integration**: Direct messaging support for client queries
- **Real-time Updates**: Supabase integration for instant data synchronization

---

## Features

✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
✅ **Real-time Data** - Supabase integration for live updates
✅ **Team Categories** - Organized team member display by role
✅ **Service Management** - Dynamic service pages with detailed information
✅ **Blog Integration** - External blog powered by Caisy CMS
✅ **Career Listings** - Job postings with real-time management
✅ **Performance Optimized** - Lazy loading, caching, image optimization
✅ **Accessibility** - WCAG compliant with keyboard navigation
✅ **SEO Friendly** - Metadata optimization and structured data
✅ **Email Notifications** - Contact form emails via Supabase Functions

---

## Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library

### Backend & Services
- **Supabase** - PostgreSQL database + authentication + functions
- **Caisy CMS** - Blog content management
- **@tanstack/react-query** - Data fetching and caching

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

---

## Project Structure

```
SOKLAW/
├── src/                          # Main source code
│   ├── components/               # Reusable React components
│   │   ├── About.tsx            # Company information section
│   │   ├── Contact.tsx          # Contact form component
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Hero.tsx             # Hero banner
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── News.tsx             # Blog posts display
│   │   ├── Services.tsx         # Services overview
│   │   ├── Team.tsx             # Team members showcase
│   │   ├── TeamDirectory.tsx    # Team member details modal
│   │   ├── TrackRecord.tsx      # Statistics/achievements
│   │   ├── WhatsAppButton.tsx   # WhatsApp integration
│   │   └── NewsLoader.tsx       # Loading skeleton
│   │
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── ServicesPage.tsx     # All services listing
│   │   ├── ServiceDetailPage.tsx # Service details
│   │   ├── TeamPage.tsx         # Full team directory
│   │   ├── BlogPage.tsx         # Blog listing
│   │   ├── BlogPostDetailPage.tsx # Individual blog post
│   │   ├── CareersPage.tsx      # Job listings
│   │   ├── ContactPage.tsx      # Contact page
│   │   └── GalleryPage.tsx      # Photo gallery
│   │
│   ├── services/                 # API service layer
│   │   ├── caisyApi.ts          # Blog posts (Caisy CMS)
│   │   ├── categoriesApi.ts     # Team categories
│   │   ├── jobsApi.ts           # Career listings
│   │   ├── servicesApi.ts       # Legal services
│   │   └── teamApi.ts           # Team members
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSiteData.ts       # App data provider hook
│   │   ├── useServices.ts       # Services hook
│   │   ├── useTeamMembers.ts    # Team members hook
│   │   └── useCategories.ts     # Team categories hook
│   │
│   ├── context/                  # React context
│   │   └── AppDataContext.tsx   # Global app data context
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── supabase.ts          # Supabase client
│   │   └── cache.ts             # Caching utilities
│   │
│   ├── data/                     # Static data
│   │   ├── servicesData.ts      # Default services data
│   │   └── teamData.ts          # Default team data
│   │
│   ├── utils/                    # Utility functions
│   │   ├── accessibility.ts     # A11y features
│   │   ├── errorHandling.ts     # Error management
│   │   ├── imageOptimization.ts # Image optimization
│   │   ├── navigationUtils.ts   # Navigation helpers
│   │   ├── performanceOptimization.ts # Performance tuning
│   │   ├── seedDatabase.ts      # Database seeding
│   │   └── testing.ts           # Testing utilities
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
│
├── supabase/                      # Supabase configuration
│   ├── functions/                # Serverless functions
│   ├── migrations/               # Database migrations
│   └── types.ts                  # TypeScript types
│
├── public/                        # Static assets
│   ├── _redirects               # Netlify redirect rules
│   └── data/                    # Static data files
│
├── functions/                     # Supabase edge functions
│   └── send-contact-email/      # Contact form email sender
│
├── scripts/                       # Utility scripts
│   └── fetch-caisy.mjs          # Fetch blog posts from Caisy
│
├── index.html                     # HTML entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint config
├── package.json                  # Dependencies & scripts
└── README.md                      # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- Supabase project (for backend)
- Caisy CMS account (for blog posts)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/backupxelfmade/SOKLAWLL.git
   cd SOKLAWLL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Blog CMS (Caisy)
VITE_CAISY_BASE_URL=https://cloud.caisy.io
VITE_CAISY_PROJECT_ID=your_project_id
VITE_CAISY_API_KEY=your_api_key
```

**Note**: Vite environment variables should be prefixed with `VITE_` to be accessible in the browser.

### Running Locally

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Fetch latest blog posts from Caisy
npm run fetch-caisy
```

---

## Key Components

### Pages

| Page | Path | Purpose |
|------|------|---------|
| HomePage | `/` | Landing page with all sections |
| ServicesPage | `/services` | List all legal services |
| ServiceDetailPage | `/services/:serviceId` | Detailed service information |
| TeamPage | `/team` | Full team directory |
| BlogPage | `/blog` | Blog posts listing |
| BlogPostDetailPage | `/blog/:slug` | Individual blog post |
| CareersPage | `/careers` | Job listings |
| ContactPage | `/contact` | Contact form |
| GalleryPage | `/gallery` | Photo gallery |

### Components

| Component | Purpose |
|-----------|---------|
| Navbar | Navigation and mobile menu |
| Hero | Hero banner with CTA |
| About | Company information |
| Services | Services showcase |
| Team | Team members grid |
| TeamDirectory | Team member details modal |
| News | Featured blog posts carousel |
| TrackRecord | Statistics/achievements |
| Contact | Contact form section |
| WhatsAppButton | Floating WhatsApp button |
| Footer | Site footer |

---

## API & Services

### Data Flow

```
Components
    ↓
Hooks (useServices, useTeam, useCareers)
    ↓
AppDataContext (Global State)
    ↓
API Services (servicesApi, teamApi, etc.)
    ↓
Supabase & External APIs
```

### Service APIs

- **servicesApi** - Fetch legal services from `legal_services` table
- **teamApi** - Fetch team members from `team_members` table
- **categoriesApi** - Fetch team categories from `team_categories` table
- **jobsApi** - Fetch job positions from `job_positions` table
- **caisyApi** - Fetch blog posts from Caisy CMS

### Caching Strategy

- **Cache TTL**: 5 minutes for most data
- **Storage**: Browser localStorage
- **Key Pattern**: `sok_v1_<resource_name>`

---

## Database Schema

### Tables

#### legal_services
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `slug` (text, unique)
- `icon_name` (text)
- `header_image` (text)
- `overview` (text)
- `key_services` (text[])
- `why_choose_us` (text)
- `process` (text)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### team_members
- `id` (uuid, PK)
- `name` (text)
- `role` (text)
- `category` (text, FK to team_categories)
- `image` (text)
- `specialization` (text)
- `email` (text)
- `phone` (text)
- `linkedin` (text)
- `description` (text)
- `experience` (text)
- `expertise` (text[])
- `education` (text[])
- `achievements` (text[])
- `languages` (text[])
- `admissions` (text[])
- `qualifications` (text[])
- `display_order` (integer)
- `created_at` (timestamp)

#### team_categories
- `id` (uuid, PK)
- `name` (text)
- `display_order` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)

#### job_positions
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `department` (text)
- `location` (text)
- `type` (text)
- `experience` (text)
- `is_active` (boolean)
- `deadline` (timestamp)
- `created_at` (timestamp)

---

## Deployment

### Netlify Deployment

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables**: Add `.env` variables in Netlify settings
4. **Redirects**: Use `public/_redirects` for URL handling

### Supabase Edge Functions

Contact form submissions trigger the `send-contact-email` function:

```bash
# Deploy edge function
supabase functions deploy send-contact-email
```

---

## Performance Optimizations

✅ **Lazy Loading** - Images and components load on demand
✅ **Code Splitting** - Route-based code splitting with React Router
✅ **Image Optimization** - Responsive images with proper formats
✅ **Caching** - 5-minute data cache with localStorage
✅ **Minification** - Production bundle optimization
✅ **Tree Shaking** - Unused code removal

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## License

This project is the property of SOK Law Associates. All rights reserved.

---

## Contact & Support

**SOK Law Associates**
- 📧 Email: careers@soklaw.co.ke
- 🌐 Website: https://soklaw.co.ke
- 📍 Based in Kenya

For technical support or questions about this codebase, please reach out to the development team.
