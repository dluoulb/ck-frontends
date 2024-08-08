# Credit Key Frontends
[![NextJS](https://img.shields.io/badge/docs-NextJS-orange)](https://nextjs.org/docs)
![Node Version](https://img.shields.io/badge/node-22.4.1-limegreen)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [SuperTokens User Management](#supertokens-user-management)
- [Screenshots](#screenshots)

## Introduction

CK Frontends is a version-controlled mono-repository that houses all Credit Key frontend UIs and shared components. It leverages the [SuperTokens](https://supertokens.com) framework for single sign-on (SSO) user authentication across all our frontend products.

### URLs

CK Frontends uses custom middleware to dynamically route users to the appropriate UI based on subdomains for the following URLs:

#### Production

TPS Reporting Dashboard: [https://reports.creditkey.com](https://reports.creditkey.com)  
Borrower Portal: [https://borrower.creditkey.com](https://borrower.creditkey.com)  
Internal Admin Dashboard: [https://admin.creditkey.com](https://admin.creditkey.com)  
Instore Order Portal: [https://merchant-instore.creditkey.com](https://merchant-instore.creditkey.com)

#### Staging

TPS Reporting Dashboard: [https://staging-reports.creditkey.com](https://staging-reports.creditkey.com)  
Borrower Portal: [https://staging-borrower.creditkey.com](https://staging-borrower.creditkey.com)  
Internal Admin Dashboard: [https://staging-admin.creditkey.com](https://staging-admin.creditkey.com)  
Instore Order Portal: [https://staging-merchant-instore.creditkey.com](https://staging-merchant-instore.creditkey.com)  
Demo Checkout Store: [https://demo.creditkey.tech/](https://demo.creditkey.tech/)

#### Development

TPS Reporting Dashboard: [http://reports.creditkey.localhost](http://reports.creditkey.localhost)  
Borrower Portal: [http://borrower.creditkey.localhost](http://borrower.creditkey.localhost)  
Internal Admin Dashboard: [http://admin.creditkey.localhost](http://admin.creditkey.localhost)  
Instore Order Portal: [http://merchant-instore.creditkey.localhost](http://merchant-instore.creditkey.localhost)  
Demo Checkout Store: [http://demo.creditkey.localhost/](http://demo.creditkey.localhost/)

## Installation

Before installing make sure you are using the recommended version of Node.

You can use `nvm` as a convenience.

```bash
# Clone the repository
git clone git@bitbucket.org:creditkey/ck-frontends.git

# Navigate to the project directory
cd ck-frontends

# Set Node version
nvm use

# Install dependencies
npm install
```

### Getting Started

For CK Frontends to operation effectively, the application along with the backend server and all other necessary services should be run via their Docker containers for SuperToken cookie storage across domains to avoid CORS issues.

```bash
# Run Clone ck-ecosystem directory and start dnsmasq and traefik
git clone git@bitbucket.org:creditkey/ck-ecosystem.git
cd ck-ecosystem
./ck-eco.sh up
```

```bash
# Clone ck-tps directory and start server
git clone git@bitbucket.org:creditkey/ck-tps.git
cd ck-tps
git checkout feature/ck-eco4
docker compose up -d
```

```bash
# Clone ck-web directory and start server
git clone git@bitbucket.org:creditkey/ck-web.git
cd ck-web
docker compose up -d
```

```bash
# Clone ck-auth directory and start auth server
git clone git@bitbucket.org:creditkey/ck-auth.git
cd ck-auth
git checkout feature/ck-eco4
docker compose up -d
```

```bash
# Clone ck-login directory and start
git clone git@bitbucket.org:creditkey/ck-login.git
cd ck-login
git checkout feature/ck-eco4
docker compose up -d
```

```bash
# Clone typesense directory and start
git clone git@bitbucket.org:creditkey/evenmoresql.git
cd evenmoresql
git checkout feature/ck-eco4
docker compose up -d
```

## Usage

### Start Application

```bash
docker compose up
```

This will start the application on `http://frontends.creditkey.localhost`.

Upon start, if user has not already been authenticated, the application will navigate to the SSO login page for two-step authentication. After authentication is complete, the auth server will automatically route user back to CK Frontends.

## SuperTokens User Management

Access the SuperTokens User Admin portal at: http://ck-auth.creditkey.localhost/dashboard/

> NOTE: Contact Credit Key engineering team for login credentials and assistance managing SuperTokens users and roles

To create a SuperTokens user via running Rails console

```bash
SuperTokens::User.create(user)
```

This should allow you to successfully login with a shared SSO cookie and access token and access approved UIs based on user permissions.

## Screenshots

The screenshot below shows the Frontends UI Home Page, illustrating the user interface and the various accessible frontend applications.

![Home Page](./shared/lib/images/home_page.png)
_UIs restricted based on user roles will not be visible to all users_
