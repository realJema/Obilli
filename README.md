# Obilli - Africa's Leading Classified Listings Platform

Welcome to **Obilli**, the online marketplace for buying, selling, and trading in Africa. Whether you're looking for products, services, or even job opportunities, **Obilli** connects you with a wide range of listings tailored for African communities.

[Visit Obilli](https://obilli.com)

## Features

- **Buy & Sell**: List and browse products and services within Africa's thriving local communities.
- **Categories**: A wide range of categories including electronics, fashion, vehicles, jobs, and real estate.
- **Search & Filters**: Easily search listings and apply filters to find exactly what you're looking for.
- **User Profiles**: Users can create profiles to manage their listings and interactions.
- **Secure Messaging**: Contact sellers directly through a secure messaging system.
- **Local Listings**: Targeted listings for different African countries and cities.
- **Responsive Design**: Optimized for mobile and desktop devices.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Supabase (for authentication, database, and storage)
- **Hosting**: Vercel
- **Authentication**: Supabase Auth (JWT-based authentication)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (for notifications, chat, etc.)

## Getting Started

To get a copy of the project running locally on your machine, follow these steps.

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn** (package manager)
- **Git** for version control
- **Supabase** account (for database and authentication)

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/realjema/obilli.git
    cd obilli
    ```

2. Install dependencies:

    If you're using **npm**:
    ```bash
    npm install
    ```

    Or if you're using **yarn**:
    ```bash
    yarn install
    ```

3. Set up environment variables:

    Copy the `.env.example` file to `.env` and update with your Supabase configuration and any other local settings:

    ```bash
    cp .env.example .env
    ```

    - Add your **Supabase URL** and **Supabase Anon Key** in the `.env` file.

4. Start the development server:

    If you're using **npm**:
    ```bash
    npm run dev
    ```

    Or if you're using **yarn**:
    ```bash
    yarn dev
    ```

    This will start the local development server at `http://localhost:3000`.

### Setting Up Supabase

1. Create an account on [Supabase](https://supabase.io).
2. Create a new project and note down the **API URL** and **Anon Key**.
3. Set up your database tables and authentication settings in the Supabase dashboard (you can import or create them from scratch).
4. Make sure to update your `.env` file with the correct details for Supabase.

### Database Setup

- If you're using Supabase (PostgreSQL), create the necessary tables for your listings, users, messages, etc., from the Supabase dashboard.
- Ensure that the **Supabase URL** and **API keys** are added correctly in the `.env` file.

## Contributing

We welcome contributions to Obilli! If you'd like to help improve the platform, please follow these guidelines:

1. **Fork the repository** and clone it to your machine.
2. Create a **new branch** for your changes:
    ```bash
    git checkout -b feature/your-feature
    ```
3. **Make your changes** and ensure that they work.
4. **Commit your changes**:
    ```bash
    git commit -m "Added feature X"
    ```
5. **Push to your forked repository**:
    ```bash
    git push origin feature/your-feature
    ```
6. **Create a pull request** against the main branch.

Please ensure that your code follows the existing coding style and includes any necessary documentation or tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Website URL**
[Obilli](https://obilli.com) – Your trusted platform for classifieds in Africa!

## **Contact**

For support or questions, feel free to reach out via:

- Email: support@obilli.com
- Twitter: [@ObilliClassified](https://twitter.com/ObilliClassified)
- Instagram: [@ObilliOfficial](https://instagram.com/ObilliOfficial)

---
