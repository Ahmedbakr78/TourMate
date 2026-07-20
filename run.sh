#!/usr/bin/env bash
set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"
CLIENT_DIR="$PROJECT_DIR/client"
MONGO_DB_PATH="/tmp/mongodb_data"
MONGO_LOG="/tmp/mongod.log"
SERVER_LOG="/tmp/tourmate_server.log"
CLIENT_LOG="/tmp/tourmate_client.log"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
BOLD='\033[1m'

SERVER_PID=""; CLIENT_PID=""

cleanup() {
  echo -e "\n${YELLOW}[run] shutting down...${NC}"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null && echo -e "  ${GREEN}✔ server stopped${NC}" || true
  [ -n "$CLIENT_PID" ] && kill "$CLIENT_PID" 2>/dev/null && echo -e "  ${GREEN}✔ client stopped${NC}" || true
  sleep 1
  # Force kill survivors
  kill -9 "$SERVER_PID" 2>/dev/null || true
  kill -9 "$CLIENT_PID" 2>/dev/null || true
  echo -e "${GREEN}[run] all stopped${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM

die() { echo -e "${RED}✖ $*${NC}" >&2; exit 1; }

echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           TourMate — Full Launch             ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"

# ── Prerequisites ──────────────────────────────────────────
echo -e "\n${YELLOW}[0/6] checking prerequisites...${NC}"
command -v node  >/dev/null 2>&1 || die "Node.js is required (node not found)"
command -v npm   >/dev/null 2>&1 || die "npm is required (npm not found)"
command -v mongod >/dev/null 2>&1 || die "MongoDB is required (mongod not found)"
echo -e "  ${GREEN}✔ node $(node -v)${NC}"
echo -e "  ${GREEN}✔ npm  $(npm -v)${NC}"

# ── Kill leftover processes on our ports ────────────────────
for port in 4000 4200; do
  pid=$(lsof -ti :$port 2>/dev/null) && kill "$pid" 2>/dev/null && echo -e "  ${YELLOW}ℹ freed port $port (was PID $pid)${NC}" || true
done

# ── 1. MongoDB ─────────────────────────────────────────────
echo -e "\n${YELLOW}[1/6] starting MongoDB...${NC}"
mkdir -p "$MONGO_DB_PATH"
if pgrep -x mongod >/dev/null 2>&1; then
  echo -e "  ${GREEN}✔ MongoDB already running${NC}"
else
  mongod --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG" --fork
  echo -e "  ${GREEN}✔ MongoDB started (PID $(pgrep -x mongod))${NC}"
fi

# ── 2. Dependencies ────────────────────────────────────────
echo -e "\n${YELLOW}[2/6] installing dependencies...${NC}"
[ ! -d "$SERVER_DIR/node_modules" ] && (cd "$SERVER_DIR" && npm install --silent) 2>&1
echo -e "  ${GREEN}✔ server dependencies${NC}"
[ ! -d "$CLIENT_DIR/node_modules" ] && (cd "$CLIENT_DIR" && npm install --silent) 2>&1
echo -e "  ${GREEN}✔ client dependencies${NC}"

# ── 3. Seed ────────────────────────────────────────────────
echo -e "\n${YELLOW}[3/6] seeding database...${NC}"
(cd "$SERVER_DIR" && node seed.cjs 2>/dev/null)
echo -e "  ${GREEN}✔ database seeded${NC}"

# ── 4. Build client (production) ──────────────────────────
echo -e "\n${YELLOW}[4/6] building frontend...${NC}"
(cd "$CLIENT_DIR" && npx ng build 2>/tmp/ngbuild_err.log) || die "frontend build failed\n$(cat /tmp/ngbuild_err.log)"
echo -e "  ${GREEN}✔ frontend built → $CLIENT_DIR/dist/tourmate-client${NC}"

# ── 5. Start server ────────────────────────────────────────
echo -e "\n${YELLOW}[5/6] starting backend (port 4000)...${NC}"
cd "$SERVER_DIR"
node src/index.js > "$SERVER_LOG" 2>&1 &
SERVER_PID=$!
cd "$PROJECT_DIR"

for i in $(seq 1 10); do
  if curl -sf http://localhost:4000/health >/dev/null 2>&1; then
    echo -e "  ${GREEN}✔ backend running → http://localhost:4000 (PID $SERVER_PID)${NC}"
    break
  fi
  [ "$i" -eq 10 ] && die "backend failed to start in 10s\n$(tail -5 $SERVER_LOG)"
  sleep 1
done

# ── 6. Serve client (dev server, for HMR) ──────────────────
echo -e "\n${YELLOW}[6/6] starting frontend dev server (port 4200)...${NC}"
cd "$CLIENT_DIR"
npx ng serve --host 0.0.0.0 --poll 2000 > "$CLIENT_LOG" 2>&1 &
CLIENT_PID=$!
cd "$PROJECT_DIR"

# Wait up to 60s for the client to compile
for i in $(seq 1 60); do
  if curl -sf http://localhost:4200 >/dev/null 2>&1; then
    echo -e "  ${GREEN}✔ frontend running → http://localhost:4200 (PID $CLIENT_PID)${NC}"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo -e "  ${YELLOW}⚠ frontend still compiling (check $CLIENT_LOG)${NC}"
  fi
  sleep 1
done

# ── Banner ─────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                 TourMate is running!                     ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Frontend:  ${BOLD}http://localhost:4200${NC}${CYAN}                    ║${NC}"
echo -e "${CYAN}║  Backend:   ${BOLD}http://localhost:4000${NC}${CYAN}                    ║${NC}"
echo -e "${CYAN}║  Health:    ${BOLD}http://localhost:4000/health${NC}${CYAN}               ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  All accounts — password: ${BOLD}password123${NC}${CYAN}                  ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║  ${BOLD}admin@tourmate.com${NC}${CYAN}     Admin                         ║${NC}"
echo -e "${CYAN}║  ${BOLD}tourist@tourmate.com${NC}${CYAN}   Tourist                        ║${NC}"
echo -e "${CYAN}║  ${BOLD}driver@tourmate.com${NC}${CYAN}    Driver                         ║${NC}"
echo -e "${CYAN}║  ${BOLD}guide@tourmate.com${NC}${CYAN}     Guide                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}Quick links:${NC}"
echo -e "  Login:   ${CYAN}http://localhost:4200/login${NC}"
echo -e "  App:     ${CYAN}http://localhost:4200/app${NC}"
echo -e "  API:     ${CYAN}http://localhost:4000${NC}"
echo ""

# ── Launch Postman ─────────────────────────────────────────
if command -v flatpak &>/dev/null && flatpak list 2>/dev/null | grep -qi postman; then
  (flatpak run com.getpostman.Postman &>/dev/null &) && echo -e "${GREEN}  ✔ Postman launched${NC}"
elif command -v postman &>/dev/null; then
  (postman &>/dev/null &) && echo -e "${GREEN}  ✔ Postman launched${NC}"
else
  echo -e "  ${YELLOW}ℹ Postman not found — install via: flatpak install flathub com.getpostman.Postman${NC}"
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

wait
