# Rhizome

Rhizome represents a new approach for Praxis, emphasizing seamless integration with existing systems while laying the groundwork for an autonomous, self-sustaining platform. The project aims to strike a balance between versatile utility and a standalone platform, with chat as the primary medium for collaborative decision-making (CDM) functionality.

By embracing both integration and the autonomy of a standalone platform, Rhizome opens the door to greater user adoption without compromising the security and reliability of it's core platform.

## Project goals

- **Rhizomatic design**: A more rhizomatic approach to the design of both features and architecture.
- **Hybrid platform/utility**: Strike a balance between versatile utility and a standalone platform.
- **Chat as the primary medium**: Use chat as the primary medium for CDM features & functionality.
- **REST and OpenAPI**: Simple REST API with OpenAPI so other systems can integrate with Praxis.
- **Vite and Express**: Embraces flexible, modular, unopinionated architecture.

## Installation and setup

Ensure that you have [Node.js](https://nodejs.org/en/download) v22.11.0 installed on your machine before proceeding.

```bash
# Install project dependencies
$ npm install

# Copy environment variables
$ cp .env.example .env
```

## Running the app

```bash
# Start server for development
$ npm run start

# Start client for development
$ npm run start:client
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view and interact with the UI.

## Docker

Install [Docker](https://docs.docker.com/engine/install) to use the following commands.

```bash
# Start app in a container
$ docker compose up -d

# Build and restart app after making changes
$ docker compose up -d --build
```

## Migrations

TypeORM is used to handle database interactions and migrations. [PostgreSQL](https://www.postgresql.org/download) is the primary database and can be run via Docker or installed locally.

If you're using a locally installed instance of PostgreSQL, ensure that connection details in your `.env` file are correct.

```bash
# Create a new migration
$ npm run typeorm:gen ./src/database/migrations/<migration-name>

# Run migrations
$ npm run typeorm:run
```

To run migrations in production, set `DB_MIGRATIONS` to `true` in your `.env` file. This will run migrations on startup via `start-prod.sh`.
