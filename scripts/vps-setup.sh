#!/bin/bash
# ============================================
# VPS Initial Setup Script
# Run this ONCE on first deployment
# ============================================

set -e

echo "================================================"
echo "IAAC Website - Initial VPS Setup"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

echo -e "${YELLOW}Step 3: Installing Docker Compose...${NC}"
if ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
fi

echo -e "${YELLOW}Step 4: Installing Git...${NC}"
apt install -y git

echo -e "${YELLOW}Step 5: Installing Certbot...${NC}"
apt install -y certbot

echo -e "${YELLOW}Step 6: Setting up app directory...${NC}"
mkdir -p /root/iaac-website
cd /root/iaac-website

echo -e "${YELLOW}Step 7: Generating SSH key for GitHub...${NC}"
if [ ! -f ~/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -C "iaacasia.com-deploy" -f ~/.ssh/id_ed25519 -N ""
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Initial setup complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Add this SSH public key to GitHub (Settings > Deploy Keys):"
echo ""
cat ~/.ssh/id_ed25519.pub
echo ""
echo "2. Clone the repository:"
echo "   git clone git@github.com:YOUR_USERNAME/IAAC-Website.git /root/iaac-website"
echo ""
echo "3. Copy your .env file to the backend folder"
echo ""
echo "4. Get SSL certificate (after DNS is pointed):"
echo "   certbot certonly --standalone -d iaacasia.com -d www.iaacasia.com"
echo ""
echo "5. Start the application:"
echo "   cd /root/iaac-website && docker compose -f docker-compose.prod.yml up -d"
