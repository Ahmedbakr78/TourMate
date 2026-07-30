#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/TourMate-backend_node.js (2)/TourMate-backend_node.js"
FRONTEND_DIR="$ROOT_DIR/tourmate_frontend/tourmate-frontend"
DIST_DIR="$FRONTEND_DIR/dist/tourmate-frontend"
MONGO_LOG=/tmp/mongod.log
SERVER_LOG=/tmp/tourmate-server.log
PORT=3000

TUNNEL=false
SEED=false
for arg in "$@"; do
    case "$arg" in
        --tunnel|--cloudflare) TUNNEL=true ;;
        --seed) SEED=true ;;
    esac
done
if $TUNNEL && ! command -v cloudflared >/dev/null 2>&1; then
    echo "  --tunnel requires cloudflared. Install it first."
    exit 1
fi

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

cleanup() {
    echo -e "\n${YELLOW}Shutting down...${NC}"
    kill $CLOUDFLARE_PID 2>/dev/null || true
    kill $SSH_PID 2>/dev/null || true
    kill $SERVER_PID 2>/dev/null || true
    kill $MONGO_PID 2>/dev/null || true
    wait 2>/dev/null
    echo -e "${GREEN}Stopped.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

echo -e "${CYAN}${BOLD}${NC}"
echo -e "${CYAN}${BOLD}      TourMate — Full App Launcher     ${NC}"
echo -e "${CYAN}${BOLD}${NC}\n"

#  1. Check prerequisites 
echo -e "${BOLD}[1/5] Checking prerequisites...${NC}"

command -v node >/dev/null 2>&1 || { echo -e "${RED} Node.js not found${NC}"; exit 1; }
echo -e "  ${GREEN}${NC} Node.js $(node -v)"

#  Kill stale process on port 3000
OLD_PID=$(lsof -ti :$PORT 2>/dev/null || true)
if [ -n "$OLD_PID" ]; then
    echo -e "  ${YELLOW} Port $PORT in use — killing PID $OLD_PID...${NC}"
    kill -9 "$OLD_PID" 2>/dev/null || true
    sleep 1
fi

MONGO_PID=""
if command -v mongod >/dev/null 2>&1; then
    if pgrep mongod >/dev/null 2>&1; then
        echo -e "  ${GREEN}${NC} MongoDB already running"
    else
        echo -e "  ${YELLOW} Starting MongoDB...${NC}"
        mkdir -p "$HOME/data/db"
        mongod --fork --logpath "$MONGO_LOG" --dbpath "$HOME/data/db" >/dev/null 2>&1
        MONGO_PID=$(pgrep mongod)
        echo -e "  ${GREEN}${NC} MongoDB started (PID $MONGO_PID)"
    fi
else
    echo -e "  ${YELLOW} mongod not found — assuming remote MongoDB${NC}"
fi

#  2. Check dependencies 
echo -e "\n${BOLD}[2/5] Checking dependencies...${NC}"

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "  ${YELLOW} Installing backend deps...${NC}"
    npm install --silent --prefix "$BACKEND_DIR" 2>&1 | tail -1
fi
echo -e "  ${GREEN}${NC} Backend deps ready"

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "  ${YELLOW} Installing frontend deps...${NC}"
    npm install --silent --prefix "$FRONTEND_DIR" 2>&1 | tail -1
fi
echo -e "  ${GREEN}${NC} Frontend deps ready"

#  3. Build Angular (if not already built) 
echo -e "\n${BOLD}[3/5] Building Angular frontend...${NC}"

if [ ! -f "$DIST_DIR/index.html" ] || $SEED; then
    echo -e "  ${YELLOW} Running ng build...${NC}"
    (cd "$FRONTEND_DIR" && npm run build --silent 2>&1 | tail -3)
else
    echo -e "  ${YELLOW} Using existing build (delete dist/ to rebuild)${NC}"
fi
echo -e "  ${GREEN}${NC} Frontend built at $DIST_DIR"

#  Seed database 
if $SEED; then
    echo -e "\n  ${BOLD}[Seed] Populating database...${NC}"
    BACKEND_NM="$BACKEND_DIR/node_modules"
    TSX="$BACKEND_NM/.bin/tsx"
    if [ -f "$TSX" ]; then
        SEED_OUTPUT=$(NODE_PATH="$BACKEND_NM" "$TSX" "$ROOT_DIR/seed/seed.ts" 2>&1)
        echo "$SEED_OUTPUT" | while IFS= read -r line; do echo "  $line"; done
        echo -e "  ${GREEN}${NC} Database seeded"
    else
        echo -e "  ${YELLOW} tsx not found — skipping seed${NC}"
    fi
fi

#  4. Start backend server 
echo -e "\n${BOLD}[4/5] Starting server...${NC}"

(cd "$BACKEND_DIR" && npx tsx src/index.ts) > "$SERVER_LOG" 2>&1 &
SERVER_PID=$!

for i in $(seq 1 15); do
    if curl -s -o /dev/null -w "" http://localhost:$PORT/ 2>/dev/null; then
        break
    fi
    sleep 1
done

if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "  ${RED} Server failed to start. Check $SERVER_LOG${NC}"
    cat "$SERVER_LOG"
    exit 1
fi
echo -e "  ${GREEN}${NC} Server running on port $PORT (PID $SERVER_PID)"

#  5. Run tests 
echo -e "\n${BOLD}[5/5] Testing endpoints...${NC}"

FAIL=0
TOKEN=""
test_endpoint() {
    local label=$1 method=$2 url=$3 expect=$4
    local code
    code=$(curl -s -o /tmp/tourmate_test.txt -w "%{http_code}" -X "$method" "http://localhost:$PORT$url" 2>/dev/null)
    if [ "$code" = "$expect" ]; then
        echo -e "  ${GREEN}${NC} $label → $code"
    else
        echo -e "  ${RED}${NC} $label → $code (expected $expect)"
        FAIL=1
    fi
}
test_endpoint_body() {
    local label=$1 method=$2 url=$3 expect=$4 body=$5
    local code
    code=$(curl -s -o /tmp/tourmate_test.txt -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$body" "http://localhost:$PORT$url" 2>/dev/null)
    if [ "$code" = "$expect" ]; then
        echo -e "  ${GREEN}${NC} $label → $code"
        if [ "$url" = "/auth/signin" ]; then
            TOKEN=$(grep -o '"accessToken":"[^"]*"' /tmp/tourmate_test.txt | head -1 | cut -d'"' -f4)
        fi
    else
        echo -e "  ${RED}${NC} $label → $code (expected $expect)"
        local resp=$(cat /tmp/tourmate_test.txt 2>/dev/null | head -c 200)
        echo -e "  Response: $resp"
        FAIL=1
    fi
}

test_endpoint_auth() {
    local label=$1 method=$2 url=$3 expect=$4
    local code
    code=$(curl -s -o /tmp/tourmate_test.txt -w "%{http_code}" -X "$method" -H "Authorization: Bearer $TOKEN" "http://localhost:$PORT$url" 2>/dev/null)
    if [ "$code" = "$expect" ]; then
        echo -e "  ${GREEN}${NC} $label → $code"
    else
        echo -e "  ${RED}${NC} $label → $code (expected $expect)"
        local resp=$(cat /tmp/tourmate_test.txt 2>/dev/null | head -c 200)
        echo -e "  Response: $resp"
        FAIL=1
    fi
}

test_endpoint "GET  /                    " GET  "/"                         200
test_endpoint "GET  /login (SPA)         " GET  "/login"                    200
test_endpoint "GET  /place (SPA)         " GET  "/place"                    200
test_endpoint "GET  /trip (SPA)          " GET  "/trip"                     200
test_endpoint "GET  /random (SPA)        " GET  "/some-random-page"         200
test_endpoint "GET  /static JS           " GET  "/main.d63312167694cba5.js" 200
test_endpoint_body "POST /auth/signin         " POST "/auth/signin"              200 '{"email":"admin@tourmate.com","password":"123456"}'
test_endpoint_body "POST /auth/signup         " POST "/auth/signup"              200 '{"name":"Test","email":"test-new@tourmate.com","password":"123456","phone":"01099999999","gender":"male"}'
test_endpoint "GET  /place/all           " GET  "/place/all"                401
test_endpoint "GET  /place/popular       " GET  "/place/popular"            200
test_endpoint "GET  /place/filter        " GET  "/place/filter"             200
test_endpoint "POST /auth/verify_code    " POST "/auth/verify_reset_code"   500
test_endpoint "GET  /auth/me             " GET  "/auth/me"                  401
test_endpoint "GET  /admin/users         " GET  "/admin/users"              401

if [ -n "$TOKEN" ]; then
    test_endpoint_auth "GET  /auth/me             " GET  "/auth/me"                  200
    test_endpoint_auth "GET  /admin/users         " GET  "/admin/users"              200
    test_endpoint_auth "GET  /admin/reports       " GET  "/admin/reports"            200
    test_endpoint_auth "GET  /trip/shared         " GET  "/trip/shared"              200
    test_endpoint_auth "GET  /notif/unread        " GET  "/notifications/unread-count" 200
    test_endpoint_auth "GET  /place/all           " GET  "/place/all"                200
else
    echo -e "  ${YELLOW}  No token — skipping authenticated tests${NC}"
fi

echo ""
echo -e "${CYAN}${BOLD}${NC}"
echo -e "${CYAN}${BOLD}    App is running!                                        ${NC}"
echo -e "${CYAN}${BOLD}${NC}"
echo -e ""

echo -e "  ${BOLD}  Frontend (Angular SPA)  →  http://localhost:$PORT${NC}"
echo -e "  ${BOLD}  Backend API             →  http://localhost:$PORT (same server)${NC}"
echo -e "  ${BOLD}  Checklist               →  $ROOT_DIR/FEATURES_CHECKLIST.md${NC}"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Ahmed Abo Bakr  —  Guide + Driver + Vehicle${NC}"
echo -e "${BOLD}${NC}"
echo -e "  ${BOLD}GUIDE${NC}"
echo -e "    POST   /guide/create_guide                   Create guide"
echo -e "    PATCH  /guide/update/:id                     Update guide"
echo -e "    DELETE /guide/delete/:id                     Delete guide"
echo -e "    GET    /guide/get/:id                        Get guide"
echo -e "    GET    /guide/all                            All guides"
echo -e "    GET    /guide/search                         Search guides"
echo -e "    PATCH  /guide/update-availability/:id        Update availability"
echo -e "    POST   /guide/upload-certificate/:id         Upload certificate"
echo -e "    DELETE /guide/delete-certificate/:id         Delete certificate"
echo -e "  ${BOLD}DRIVER${NC}"
echo -e "    POST   /driver/create_driver                 Create driver"
echo -e "    PATCH  /driver/update/:id                    Update driver"
echo -e "    DELETE /driver/delete/:id                    Delete driver"
echo -e "    GET    /driver/get/:id                       Get driver"
echo -e "    GET    /driver/all                           All drivers"
echo -e "    POST   /driver/search                        Search drivers"
echo -e "    PATCH  /driver/update-availability/:id       Update availability"
echo -e "  ${BOLD}VEHICLE${NC}"
echo -e "    POST   /vehicle/create_vehicle               Create vehicle"
echo -e "    PATCH  /vehicle/update/:id                   Update vehicle"
echo -e "    DELETE /vehicle/delete/:id                   Delete vehicle"
echo -e "    GET    /vehicle/get/:id                      Get vehicle"
echo -e "    GET    /vehicle/all                          All vehicles"
echo -e "    GET    /vehicle/search                       Search vehicles"
echo -e "    GET    /vehicle/driver/:driverId             Driver vehicles"
echo -e "    POST   /vehicle/upload-images/:id            Upload images"
echo -e "    DELETE /vehicle/delete-image/:id             Delete image"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Jamal  —  Auth + User + Admin${NC}"
echo -e "${BOLD}${NC}"
echo -e "  ${BOLD}AUTH${NC}"
echo -e "    POST   /auth/signup                          Register"
echo -e "    POST   /auth/signin                          Login"
echo -e "    POST   /auth/confirm_email                   Verify email"
echo -e "    POST   /auth/send_otp_again                  Resend OTP"
echo -e "    POST   /auth/forgot_password                 Forgot password"
echo -e "    POST   /auth/verify_reset_code               Verify reset code"
echo -e "    PATCH  /auth/reset_password                  Reset password"
echo -e "    POST   /auth/refresh_token                   Refresh token"
echo -e "    PATCH  /auth/change_password                 Change password"
echo -e "    POST   /auth/logout                          Logout"
echo -e "    GET    /auth/me                              Get logged-in user"
echo -e "  ${BOLD}USER${NC}"
echo -e "    GET    /user/current_user_id                 Get profile"
echo -e "    GET    /user/:id                             Get user by ID"
echo -e "    PUT    /user/update_user                     Update profile"
echo -e "    POST   /user/profile_image                   Upload avatar"
echo -e "    DELETE /user/delete_image                    Delete avatar"
echo -e "    DELETE /user/delete_account                  Delete account"
echo -e "  ${BOLD}ADMIN${NC}"
echo -e "    GET    /admin/dashboard                      Dashboard stats"
echo -e "    GET    /admin/system-statistics              System stats"
echo -e "    GET    /admin/users                          All users"
echo -e "    GET    /admin/pending-guides                 Pending guides"
echo -e "    GET    /admin/pending-drivers                Pending drivers"
echo -e "    GET    /admin/reports                        Reports"
echo -e "    PATCH  /admin/:id/role                       Change role"
echo -e "    PATCH  /admin/:id/status                     Block/unblock"
echo -e "    DELETE /admin/:id/delete                     Delete user"
echo -e "    DELETE /admin/trip/:id/delete                Delete trip"
echo -e "    PATCH  /admin/driver/:id/verification-status  Verify driver"
echo -e "    PATCH  /admin/guide/:id/verification-status   Verify guide"
echo -e "    PATCH  /admin/trip/:id/assign-resources       Assign resources"
echo -e "    PATCH  /admin/trip/:id/status                 Update trip status"
echo -e "    PATCH  /admin/trip/:id/confirm-payment        Confirm payment"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Bavly  —  Trip + Vote${NC}"
echo -e "${BOLD}${NC}"
echo -e "  ${BOLD}TRIP${NC}"
echo -e "    POST   /trip/create_trip                     Create trip"
echo -e "    GET    /trip/all                             All trips"
echo -e "    GET    /trip/get/:id                         Get trip"
echo -e "    GET    /trip/my_trips                        My trips"
echo -e "    GET    /trip/shared                          Shared trips"
echo -e "    PATCH  /trip/:id/update                      Update trip"
echo -e "    PATCH  /trip/:id/cancel                      Cancel trip"
echo -e "    PATCH  /trip/:id/join                        Join shared trip"
echo -e "    PATCH  /trip/:id/share                       Share trip"
echo -e "    POST   /trip/:id/duplicate                   Duplicate trip"
echo -e "    DELETE /trip/:id/delete                      Delete trip"
echo -e "    PATCH  /trip/:id/assign-guide                Assign guide"
echo -e "    PATCH  /trip/:id/assign-driver               Assign driver"
echo -e "    PATCH  /trip/:id/assign-vehicle              Assign vehicle"
echo -e "    PATCH  /trip/:id/start                       Start trip"
echo -e "    PATCH  /trip/:id/complete                    Complete trip"
echo -e "    POST   /trip/calculate-price                 Calculate price"
echo -e "    GET    /trip/:id/route                       Get route"
echo -e "  ${BOLD}VOTE${NC}"
echo -e "    POST   /vote/create_vote                     Create vote"
echo -e "    PATCH  /vote/:id/update                      Update vote"
echo -e "    DELETE /vote/:id/delete                      Delete vote"
echo -e "    GET    /vote/:tripId/place/:placeId          Place votes"
echo -e "    GET    /vote/user                            My votes"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Mai  —  Notification + Lost Item${NC}"
echo -e "${BOLD}${NC}"
echo -e "  ${BOLD}NOTIFICATION${NC}"
echo -e "    GET    /notifications/notifications           List notifications"
echo -e "    GET    /notifications/get/:id                 Get notification"
echo -e "    GET    /notifications/unread-count            Unread count"
echo -e "    POST   /notifications/create                  Create notification"
echo -e "    PATCH  /notifications/:id/mark-as-read        Mark read"
echo -e "    PATCH  /notifications/mark-all-as-read        Mark all read"
echo -e "    DELETE /notifications/:id/delete              Delete notification"
echo -e "    DELETE /notifications/delete-all              Delete all"
echo -e "  ${BOLD}LOST ITEM${NC}"
echo -e "    POST   /lost_item/create_lost_item            Report lost item"
echo -e "    GET    /lost_item/get/:id                     Get lost item"
echo -e "    GET    /lost_item/:tripId/trip_lost_items     Trip lost items"
echo -e "    GET    /lost_item/my_lost_items               My lost items"
echo -e "    PATCH  /lost_item/:id/update                  Update lost item"
echo -e "    PATCH  /lost_item/:id/status                  Update status"
echo -e "    DELETE /lost_item/:id/delete                  Delete lost item"
echo -e "    PATCH  /lost_item/:id/report-found            Report found"
echo -e "    PATCH  /lost_item/:id/close                   Close lost item"
echo -e "    PATCH  /lost_item/:id/reopen                  Reopen lost item"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Ramadan  —  Place + Review${NC}"
echo -e "${BOLD}${NC}"
echo -e "  ${BOLD}PLACE${NC}"
echo -e "    POST   /place/create_place                   Create place"
echo -e "    GET    /place/all                            All places"
echo -e "    GET    /place/get/:id                        Get place"
echo -e "    PUT    /place/update/:id                     Update place"
echo -e "    DELETE /place/places/:id                     Delete place"
echo -e "    GET    /place/search                         Search places"
echo -e "    GET    /place/filter                         Filter places"
echo -e "    GET    /place/nearby                         Nearby places"
echo -e "    GET    /place/popular                        Popular places"
echo -e "    POST   /place/save/:id                       Save place"
echo -e "    DELETE /place/save/:id                       Unsave place"
echo -e "  ${BOLD}REVIEW${NC}"
echo -e "    POST   /review/create_review                 Create review"
echo -e "    GET    /review/all                           All reviews"
echo -e "    GET    /review/get/:id                       Get review"
echo -e "    PATCH  /review/:id/update                    Update review"
echo -e "    DELETE /review/:id/delete                    Delete review"
echo -e "    GET    /review/:tripId/reviews               Trip reviews"
echo -e "    GET    /review/:placeId/place_reviews        Place reviews"
echo -e "    GET    /review/guide/:guideId                Guide reviews"
echo -e "    GET    /review/driver/:driverId              Driver reviews"
echo -e "    GET    /review/my-reviews                    My reviews"
echo -e ""

echo -e "${BOLD}${NC}"
echo -e "${BOLD}  Legend${NC}"
echo -e "${BOLD}${NC}"
echo -e "   = Public (no auth required)"
echo -e "   = JWT required"
echo -e "   = Full checklist at FEATURES_CHECKLIST.md"
echo -e ""

echo -e "  ${BOLD}  Files:${NC}"
echo -e "    Server log   → ${SERVER_LOG}"
echo -e "    MongoDB log  → ${MONGO_LOG}"
echo -e ""

if $TUNNEL; then
    echo ""
    echo -e "  ${BOLD}${CYAN}╔══════════════════════════════════════════════╗${NC}"
    echo -e "  ${BOLD}${CYAN}║       TourMate is NOW LIVE on Cloudflare     ║${NC}"
    echo -e "  ${BOLD}${CYAN}╠══════════════════════════════════════════════╣${NC}"
    echo -e "  ${BOLD}${CYAN}║  Look for the URL below →                    ║${NC}"
    echo -e "  ${BOLD}${CYAN}║  https://xxxxx.trycloudflare.com             ║${NC}"
    echo -e "  ${BOLD}${CYAN}║                                              ║${NC}"
    echo -e "  ${BOLD}${CYAN}║  Send that link to your users!               ║${NC}"
    echo -e "  ${BOLD}${CYAN}║  Press Ctrl+C to stop                        ║${NC}"
    echo -e "  ${BOLD}${CYAN}╚══════════════════════════════════════════════╝${NC}"
    echo ""
    if command -v cloudflared >/dev/null 2>&1; then
        CLOUDFLARE_LOG=/tmp/cloudflare-tunnel.log
        URL=""
        for attempt in 1 2 3; do
            kill $CLOUDFLARE_PID 2>/dev/null || true
            cloudflared tunnel --url http://localhost:$PORT > "$CLOUDFLARE_LOG" 2>&1 &
            CLOUDFLARE_PID=$!
            for i in $(seq 1 15); do
                URL=$(grep -oP 'https?://[a-zA-Z0-9.-]+\.trycloudflare\.com' "$CLOUDFLARE_LOG" 2>/dev/null | head -1)
                if [ -n "$URL" ]; then break; fi
                sleep 1
            done
            if [ -n "$URL" ]; then
                HOST=$(echo "$URL" | sed 's|https://||')
                DNS_OK=false
                for d in $(seq 1 6); do
                    if nslookup "$HOST" 2>/dev/null | grep -q "Name:"; then DNS_OK=true; break; fi
                    sleep 5
                done
                if $DNS_OK; then
                    echo -e "  ${GREEN}  Cloudflare tunnel: ${BOLD}$URL${NC}"; echo ""; break
                fi
                echo -e "  ${YELLOW}  DNS not ready yet — retrying...${NC}"
            fi
            if grep -q "429\|Too Many" "$CLOUDFLARE_LOG" 2>/dev/null; then
                echo -e "  ${YELLOW}  Cloudflare rate limited, trying SSH tunnel...${NC}"; URL=""; break
            fi
            sleep 2
        done
    fi
    if [ -z "$URL" ] || ! nslookup "$(echo "$URL" | sed 's|https://||')" 2>/dev/null | grep -q "Name:"; then
        echo -e "  ${YELLOW}  Using localhost.run tunnel (SSH)...${NC}"
        kill $SSH_PID 2>/dev/null || true
        SSH_LOG=/tmp/ssh-tunnel.log
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:$PORT nokey@localhost.run > "$SSH_LOG" 2>&1 &
        SSH_PID=$!
        for i in $(seq 1 30); do
            URL=$(grep -oP 'https?://[a-zA-Z0-9-]+\.lhr\.life' "$SSH_LOG" 2>/dev/null | head -1)
            if [ -n "$URL" ]; then break; fi
            sleep 1
        done
        echo -e "  ${GREEN}  localhost.run: ${BOLD}$URL${NC}"
        echo ""
    fi
fi

echo -e "  ${YELLOW}Press Ctrl+C to stop${NC}"
echo -e ""

wait $SERVER_PID
