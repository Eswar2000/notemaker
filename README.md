# Note Maker Web Application

A simple note making application built with MERN stack (MongoDB, Express.js, React, Node.js). Users can create, edit, delete, share and manage their notes easily.

## Features

- **Authentication and Authorization**: Use of jsonwebtoken and bcryptjs to securely manage user access
- **Create Notes and Checklists**: Add new notes or to-do lists
- **Edit Notes and Checklists**: Edit existing notes and to-do lists on the fly
- **Delete Notes and Checklists**: Delete unwanted or outdated notes and to-do lists
- **Collaborate with Users**: Share notes across users to collaborate and effectively have fun while managing notes

## Technology Stack

- **Frontend**: React, CSS and Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Planning to deploy on platforms like Heroku or Netlify

## Get Started

Follow these steps to setup your own version of notemaker locally.

### Prerequisites

- **Node.js** (version 16.x or higher is preferred)
- **MongoDB** (A local setup of MongoDB or cloud based Atlas is preferred)

### 1. Clone the repository
```bash
git clone https://github.com/Eswar2000/notemaker.git
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd portal
npm install
```
### 4. Update your environments for portal
```bash
cd portal
cp .env.sample .env
```
Update the .env file by modifying the placeholders with your actual instance entries

### 5. Update your environments for backend
```bash
cd backend
cp .env.sample .env
```
Update the .env file by modifying the placeholders with your actual instance entries

### 6. Start backend
```bash
npm start
```

### 7. Start frontend
```bash
cd notemaker
npm start
```

### 6. Visit the web application to begin your journey in organizing your notes
Visit http://localhost:3000/signin to login as an user and start working on managing your notes

## Roadmap (or let's say, just thinking out aloud)

- **Code refactor**: Work on the internal structure of codebase and accommadate best practices in coding (an ongoing task)
- **Management of secrets**: Like notes and checklists, include a module to manage secrets effectively
- **Import/Export of Notes and Checklists**: Support for users to download their notes as a standard format and upload notes in bulk from a standard file format
