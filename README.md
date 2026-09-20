CleanSlate
CleanSlate is a web-based expungement intake and case management platform designed to streamline eligibility screening, intake collection, payment processing, and case tracking for record-clearing services.

Features
Multi-step client intake workflow
State-based eligibility screening
Secure information collection
Notion CRM integration
Stripe Checkout payment processing
Case and submission tracking
Automated intake storage
Responsive Next.js front end
Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Integrations
Notion API
Stripe Checkout
Railway-hosted Intake API
Deployment
Frontend: Vercel
Backend API: Railway
Intake Workflow



Plain Text
Client Intake Form
        ↓
Eligibility Screening
        ↓
Case Information Collection
        ↓
Notion Record Creation
        ↓
Stripe Checkout Session
        ↓
Payment Confirmation
Environment Variables
Create a .env.local file:




Plain Text
env isn’t fully supported. Syntax highlighting is based on Plain Text.

NEXT_PUBLIC_BASE_URL=
 
NOTION_API_KEY=
NOTION_DATABASE_ID=
 
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
Development
Install dependencies:




Shell
npm install
Run locally:




Shell
npm run dev
Build for production:




Shell
npm run build
Current Status
Implemented:

Intake form
Notion integration
Stripe Checkout integration
Confirmation page
Payment workflow
Production deployment preparation
Planned:

Stripe webhook status updates
Enhanced intake automation
Additional state-specific workflows
Administrative dashboard
License
Copyright (c) 2026 My Clean Slate LLC

All rights reserved.
This software and associated documentation files are the proprietary
and confidential property of My Clean Slate LLC.
No part of this software may be copied, modified, distributed,
published, sublicensed, sold, or used without the express written
permission of My Clean Slate LLC.
Unauthorized reproduction or distribution of this software, in whole
or in part, is strictly prohibited.
For licensing inquiries, contact:  My Clean Slate LLC
Copyright © My-Clean-Slate LLC

## License
Proprietary Software
Copyright © 2026 My-Clean-Slate LLC.
All rights reserved.
License
Proprietary Software

CleanSlate

CleanSlate is a cloud-based expungement intake and case management platform designed to streamline eligibility screening, intake collection, payment processing, and case tracking for record-clearing services.

Features

• Multi-step client intake workflow
 • State-based eligibility screening
 • Secure information collection
 • Notion CRM integration
 • Stripe Checkout payment processing
 • Case and submission tracking
 • Automated intake storage
 • Responsive user experience

Technology Stack

Frontend • Next.js
 • React
 • TypeScript
 • Tailwind CSS

Integrations • Notion API
 • Stripe Checkout
 • Railway-hosted Intake API

Infrastructure • Vercel
 • Railway
 • GitHub

Architecture

Client
 ↓
 CleanSlate Frontend (Vercel)
 ↓
 Intake Processing
 ↓
 Notion Workspace
 ↓
 Stripe Payments
 ↓
 Case Workflow

Business Description

CleanSlate is a cloud-based software platform that helps individuals complete expungement and record-clearing intake forms, organize case information, track submissions, and securely process filing-fee payments through an automated workflow.

License

Proprietary Software

Copyright © 2026 My Clean Slate LLC. All rights reserved.



