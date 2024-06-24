SAMPUL - 2024

Introduction

- SAMPUL is a digital estate planning platform that helps you manage and secure your digital assets and digital legacy. It allows you to create a comprehensive digital wasiat/will to ensure your online accounts and digital assets are managed according to your wishes.

Features

- List the main features of Sampul:

  Marketing
  Purpose: Act as a page to tell about the company and what the website does. Allows users to subscribe to the newsletter and includes a Q&A section.
  Visibility: Public (all users can access)
  Directory: public/html
  Pages: company.html, contact.html, index.html, policy.html, price.html, resources.html, solutions.html

  Documentation
  Purpose: Allow users to study all aspects of the website, including how to use every important feature.
  Visibility: Public (all users can access)
  Directory: pages/
  Pages: docs.js

  Managing Assets
  Purpose: Serve as the main purpose of the website, allowing users to manage their digital assets.
  Visibility: Private (only authenticated users can access)
  Directory: pages/
  Pages: dashboard.js, beloved.js, digital-assets.js, physical-assets.js, extra-wishes.js, will.js, view-will.js

  Authentication
  Purpose: Register users and enable them to use their accounts to manage their assets on the website.
  Visibility: Private (only authenticated users can access)
  Directory: pages/
  Pages: signin.js, signup.js, change-password.js

  Managing Account and Billing
  Purpose: Allow users to manage their accounts, change passwords, and delete their accounts.
  Visibility: Private (only authenticated users can access)
  Directory: pages/
  Pages: settings.js

  Billing
  Purpose: The website is free to use, but users can subscribe to a plan to enable additional features.
  Visibility: Private (only authenticated users can access)
  Directory: pages/
  Pages: settings.js

  Administrator
  Purpose: Allow administrators to view and manage website records.
  Visibility: Private (only admins can access)
  Directory: pages/
  Pages: admin.js

Technologies Used

    Frontend
    Next.js: A React framework for building fast and user-friendly web applications with server-side rendering and static site generation capabilities.
    React: A JavaScript library for building user interfaces.

    Backend
    Supabase: An open-source Firebase alternative that provides a backend as a service, including authentication, database management (PostgreSQL), and real-time subscriptions.

    Database:
    PostgreSQL: A powerful, open-source relational database system used in Supabase.

    Authentication
    Supabase Auth: Provides user authentication and authorization services.

    Deployment and Hosting:
    Vercel: A platform for frontend developers, providing hosting and serverless functions for Next.js applications.
    Supabase: For hosting the database and managing backend services.

    Version Control:
    GitHub: A platform for hosting and collaborating on Git repositories.

    Emailing:
    Resend: A service for sending transactional and marketing emails.

Installation

    Prerequisites
    Node.js (>=14.x)
    npm (>=6.x) or yarn (>=1.x)

    Steps
    1. Clone the repository.
    2. Navigate to the project directory.
    3. If you are using npm: npm install, If you are using yarn: yarn install.
    4. Configure environment variables:
       4.1 Create a .env.local file in the root directory of your project.
       4.2 Add the following environment variables to .env.local:

        NEXT_PUBLIC_SUPABASE_URL=
        NEXT_PUBLIC_SUPABASE_KEY=
        NEXT_PUBLIC_STRIPE_KEY=
        STRIPE_SECRET_KEY=
        STRIPE_SIGNING_SECRET=
        API_ROUTE_SECRET=
        SUPABASE_SERVICE_KEY=
        NEXT_PUBLIC_HOST=https://sampul.co
        NEXT_PUBLIC_GOOGLE_REDIRECT_URL=https://sampul.co/dashboard
        NEXT_PUBLIC_CHANGE_PASSWORD_REDIRECT_URL=https://sampul.co/change-password
        NEXT_PUBLIC_CDNUR_IMAGE=https://rfzblaianldrfwdqdijl.supabase.co/storage/v1/object/public/images
        NEXT_PUBLIC_CDNUR_IMAGE_WEBSITE=https://rfzblaianldrfwdqdijl.supabase.co/storage/v1/object/public/website
        NEXT_PUBLIC_CONTACT_EMAIL=hello@sampul.co
        FROM_EMAIL="Sampul" <team@sampul.co>
        RESEND_API_KEY=
        BASIC_PRODUCT_KEY=P0001
        NEXT_PUBLIC_FACEBOOK_URL='https://www.facebook.com/hellosampul'
        NEXT_PUBLIC_TWITTER_URL='https://sampul.co'
        NEXT_PUBLIC_INSTAGRAM_URL='https://sampul.co'
        SENTRY_KEY=

    5. Run the development server, If you are using npm: npm run dev, If you are using yarn: yarn dev.
