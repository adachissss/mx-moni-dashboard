#!/bin/bash
cd "$(dirname "$0")"

echo "Starting backend..."
(cd backend && npm run dev) &
BACKEND_PID=$!

echo "Starting frontend..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "Done!"
echo "Backend -> http://localhost:3001"
echo "Frontend -> http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
