#!/bin/bash
# ============================================
# IAAC Website - Ubuntu Server Deployment Script
# Domain: iaacasia.com
# ============================================

set -e  # Exit on error

echo "================================================"
echo "IAAC Website - Production Deployment"
echo "Domain: iaacasia.com"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Docker (if not installed)...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

echo -e "${YELLOW}Step 3: Installing Docker Compose (if not installed)...${NC}"
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}Docker Compose already installed${NC}"
fi

echo -e "${YELLOW}Step 4: Installing Certbot for SSL...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot
    echo -e "${GREEN}Certbot installed successfully${NC}"
else
    echo -e "${GREEN}Certbot already installed${NC}"
fi

echo -e "${YELLOW}Step 5: Creating Certbot directory...${NC}"
mkdir -p /var/www/certbot

echo -e "${YELLOW}Step 6: Stopping any existing containers...${NC}"
docker compose down 2>/dev/null || true

echo -e "${YELLOW}Step 7: Building and starting containers (HTTP only first)...${NC}"
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d

echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

echo -e "${YELLOW}Step 8: Checking if services are healthy...${NC}"
docker compose ps

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Initial deployment complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}Next steps for SSL:${NC}"
echo ""
echo "1. Make sure your domain (iaacasia.com) points to this server's IP"
echo ""
echo "2. Stop the containers temporarily:"
echo "   docker compose down"
echo ""
echo "3. Obtain SSL certificate:"
echo "   certbot certonly --standalone -d iaacasia.com -d www.iaacasia.com"
echo ""
echo "4. Start with SSL configuration:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "5. Set up auto-renewal (add to crontab):"
echo "   0 0 1 * * certbot renew --quiet && docker compose -f docker-compose.prod.yml restart frontend"
echo ""
echo -e "${GREEN}Your site should now be accessible at: http://iaacasia.com${NC}"
echo -e "${GREEN}After SSL setup: https://iaacasia.com${NC}"
