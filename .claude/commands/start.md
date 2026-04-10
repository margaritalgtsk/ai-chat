# Command: /start

## Description

Start the local development environment by running client and server in parallel.

## Usage

```
/start           # start both client and server
/start client    # start client only
/start server    # start server only
```

## Instructions

### 1. Handle arguments

- No argument → run both
- `client` → run client only
- `server` → run server only

### 2. Start the processes

**Both:**

```bash
npm run dev
```

**Client only:**

```bash
npm run dev:client
```

**Server only:**

```bash
npm run dev:server
```

### 3. Confirm to the user

After starting, report:

> "✅ Dev environment started:
>
> - Client running at http://localhost:5173
> - Server running at http://localhost:3000"

If a process fails to start, show the error and suggest a fix.

## Notes

- Relies on `concurrently` being installed (`npm install -D concurrently`)
- Individual scripts `dev:client` and `dev:server` are available for running separately
