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
CASE_MASTER_API_URL=
SERVICE_TOKEN=

`NEXT_PUBLIC_BASE_URL` must be the absolute HTTPS origin used for Stripe return
URLs (for example, the production Vercel domain). Set all six variables in the
Vercel project and in `.env.local` for local development. Checkout is deliberately
unavailable unless Notion, Stripe, and the authenticated case-master API are
configured.

The Notion database must contain the properties used by the checkout API:
Name, Email, Phone, State, DOB, Case Number, County, Year, Charge, Disposition,
Service Type, Service Fee, Filing Fee, Waiver Available, Flags, Legal
Acknowledged (checkbox), Legal Acknowledged At (date), and Payment Status
(including the Pending and Paid select options). A payment is not created unless
the case-master API successfully creates the intake and filing for the selected
county. Configure county routing in that API before offering checkout for it.

Configure the Stripe webhook to POST to `/api/webhooks/stripe` and set its
signing secret as `STRIPE_WEBHOOK_SECRET`. The checkout API has a 10-second
Vercel function duration limit; its two case-master API calls each time out
after 2.5 seconds.
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
 
Enhanced intake automation
Additional state-specific workflows
Administrative dashboard

The Stripe webhook status update is implemented in `app/api/webhooks/stripe/route.ts`.
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


