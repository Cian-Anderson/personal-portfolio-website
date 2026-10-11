# ArtVault

A full-stack art gallery application developed as a practical project to
demonstrate the integration of front-end, back-end, and database technologies.

Built with **React, Node.js, Express, and MongoDB** to explore client-server
communication, REST APIs, database design, authentication, and CRUD operations.

<img
  src="https://github.com/user-attachments/assets/eb0c1bfb-8cde-4a05-bc03-e1883cef0024"
  alt="Art Index landing page"
  width="100%"
/>

## Application Preview

<img
  src="https://github.com/user-attachments/assets/339231dd-4a64-4a72-aec8-a6365b397585"
  alt="Art Index gallery"
  width="100%"
/>

## About the Project

Art Index was developed to explore how the different layers of a full-stack
web application communicate with one another.

The React client communicates with a REST API built using Node.js and Express,
which handles application logic and communication with MongoDB.

**React → REST API → Node.js / Express → MongoDB**

### Request & Data Flow

To make the client-server communication visible, the application includes an
activity tracker that displays each request as it moves through the application,
from the initial UI action and AJAX request through backend processing,
MongoDB access, the JSON response, and the final React render.

<img
  src="https://github.com/user-attachments/assets/3d5ef2ed-a78b-4c78-b1ec-3d343405c78e"
  alt="Art Index API request activity showing the application data flow"
  width="100%"
/>

### Key Features

- Browse, search, filter, and sort artworks
- Create, update, and delete artwork records
- User registration and JWT authentication
- Save and manage favourite artworks
- Request and activity tracking
- MongoDB-backed artwork and user data

## Project Structure

```text

art-app/
   ├── client/
   │   ├── public/                  # Static public files for the React app
   │   ├── src/
   │   │   ├── components/
   │   │   │   ├── gallery/         # Artwork grid and gallery UI pieces
   │   │   │   ├── layout/          # Top-level layout and page utility UI
   │   │   │   ├── modals/          # Favorites, auth, activity, and profile modals
   │   │   │   ├── onboarding/      # Intro and landing-stage components
   │   │   │   ├── panels/          # Editor, preview, favorites, and request panels
   │   │   │   └── ui/              # Shared UI elements such as toast notifications
   │   │   ├── hooks/               # Client state and data hooks
   │   │   ├── services/            # Axios service layer for backend API calls
   │   │   ├── styles/              # Split CSS files imported by App.css
   │   │   ├── App.js               # Main client application component
   │   │   ├── App.css              # CSS entry file importing all style sections
   │   │   ├── App.test.js          # Basic React test
   │   │   ├── index.css            # Global DOM-level styling entry
   │   │   └── index.js             # React application bootstrap
   │   ├── package.json             # Client dependencies and scripts
   │   └── build/                   # Generated production build output
   ├── server/
   │     ├── controllers/             # Request handlers for each API area
   │     ├── data/                    # Source artwork JSON dataset
   │     ├── middleware/              # JWT auth, request ID, and error handling
   │     ├── models/                  # Mongoose models
   │     ├── public/                  # Backend-served static files, including about.html
   │     ├── routes/                  # Express route definitions
   │     ├── utils/                   # DB connection, import utility, query validation
   │     ├── app.js                   # Express application entry point
   │     ├── .env.example             # Example server configuration file
   │     └── package.json             # Server dependencies and scripts
   └── README.md                     # Main project documentation
```

## Understanding the Main Folders

### Client

- `art-app/client/src/components`: Presentational and feature components used by the React UI
- `art-app/client/src/hooks`: Reusable logic for artworks, authentication, favorites, and request activity
- `art-app/client/src/services`: API helper functions that send requests to the backend
- `art-app/client/src/styles`: Stylesheets split by feature area and imported through `App.css`

### Server

- `art-app/server/controllers`: Business logic for each route group
- `art-app/server/routes`: Express routers for artworks, auth, favorites, users, and activity
- `art-app/server/models`: MongoDB schema definitions using Mongoose
- `art-app/server/middleware`: Request processing helpers such as JWT verification and centralized error handling
- `art-app/server/utils/importData.js`: Utility to import the source artwork dataset into MongoDB
- `art-app/server/public/about.html`: Backend-served About page

## Requirements

Install the following before running the project:

- Node.js
- npm
- MongoDB running locally or an accessible MongoDB connection string

## Installation

Note: node_modules is not included in repository. Run npm install in both the server and client folders before starting the application.

### 1. Clone or extract the project

Open a terminal in the folder that contains `art-app/`:

```powershell
# If needed, change directory to the extracted project folder first.
# Then run commands from the location where `art-app/` is visible.
```

### 2. Install server dependencies

```powershell
cd art-app/server
npm install
```

### 3. Install client dependencies

Open a second terminal:

```powershell
cd art-app/client
npm install
```

## Configuration

The backend reads environment variables from `art-app/server/.env`.

Create a `.env` file inside `art-app/server/` using `art-app/server/.env.example` as the template:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/art-index
JWT_SECRET=replace-with-a-secure-random-string
```

### Environment Variables

- `PORT`: Backend port. Default is `5000`
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret used to sign and verify JWT tokens

## Importing the Artwork Dataset

Before using the app with data, import the artwork JSON into MongoDB.

From `art-app/server/` run:

```powershell
npm run import
```

Important:

- This script clears the current artworks collection before importing the dataset again.
- It imports data from `art-app/server/data/Artworks.json`.

## Running the Application

### Start the backend server

From `art-app/server/`:

```powershell
npm run dev
```

Or without nodemon:

```powershell
npm start
```

The backend runs on:

- `http://localhost:5000`

You can test that the backend is running by visiting:

- `http://localhost:5000`

The backend-served About page is available at:

- `http://localhost:5000/about`

### Start the frontend client

From `art-app/client/`:

```powershell
npm start
```

The frontend runs on:

- `http://localhost:3000`

## Execution Order

Use this order when starting the project from scratch:

1. Start MongoDB
2. Configure `art-app/server/.env`
3. Run `npm install` in both `art-app/server` and `art-app/client`
4. Run `npm run import` in `art-app/server` if you need to load the artwork dataset
5. Run `npm run dev` in `art-app/server`
6. Run `npm start` in `art-app/client`

## Available Scripts

### Server scripts

Defined in `art-app/server/package.json`:

- `npm start`: Starts the Express server with Node
- `npm run dev`: Starts the Express server with nodemon
- `npm run import`: Imports `Artworks.json` into MongoDB

### Client scripts

Defined in `art-app/client/package.json`:

- `npm start`: Starts the React development server
- `npm run build`: Builds the client for production
- `npm test`: Runs the React test suite

## Key Backend Routes

- `GET /`: API health message
- `GET /about`: Backend-served About page
- `GET /api/artworks`: List artworks with filtering, sorting, and pagination
- `GET /api/artworks/:id`: Get one artwork
- `POST /api/artworks`: Create artwork
- `PUT /api/artworks/:id`: Update artwork
- `DELETE /api/artworks/:id`: Delete artwork
- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login user
- `GET /api/favorites`: Get favorites for the logged-in user
- `POST /api/favorites`: Add favorite
- `DELETE /api/favorites/:artworkId`: Remove favorite

## Testing

Client test command:

```powershell
cd art-app/client
npm test
```

## Troubleshooting

- If the backend fails to start, check that MongoDB is running and that `MONGO_URI` is correct in `art-app/server/.env`.
- If the frontend cannot connect to the backend, make sure the backend is running on `http://localhost:5000`.
- If the gallery is empty, run `npm run import` from `art-app/server` to load the artwork dataset.



