#!/bin/bash

# Qiankun Website Deployment Script
# Builds, commits, and pushes to GitHub → triggers AWS Amplify auto-deploy

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BRANCH="${BRANCH:-main}"
REMOTE="${REMOTE:-origin}"

# Functions
print_step() {
    echo -e "\n${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ] || [ ! -d "docs" ]; then
        print_error "Please run this script from the qiankun-website root directory"
        exit 1
    fi
}

# Build the site locally to catch errors before pushing
build_site() {
    print_step "Building site locally..."
    npm run docs:build
    print_success "Build completed successfully"
}

# Check for changes
check_changes() {
    if [ -z "$(git status --porcelain)" ]; then
        print_warning "No changes to commit"
        read -p "Push existing commits anyway? (y/N): " push_anyway
        if [[ ! "$push_anyway" =~ ^[Yy]$ ]]; then
            echo "Deployment cancelled"
            exit 0
        fi
        return 1  # No new commit needed
    fi
    return 0  # Changes exist
}

# Stage and commit changes
commit_changes() {
    print_step "Staging changes..."
    git add -A

    # Show what will be committed
    echo -e "\n${YELLOW}Changes to be committed:${NC}"
    git status --short
    echo ""

    # Get commit message
    if [ -n "$1" ]; then
        COMMIT_MSG="$1"
    else
        read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update website content - $(date '+%Y-%m-%d %H:%M')"
        fi
    fi

    git commit -m "$COMMIT_MSG"
    print_success "Changes committed"
}

# Push to remote
push_to_remote() {
    print_step "Pushing to ${REMOTE}/${BRANCH}..."
    git push "$REMOTE" "$BRANCH"
    print_success "Pushed to GitHub"
}

# Check Amplify status (if AWS CLI is available)
check_amplify_status() {
    if command -v aws &> /dev/null; then
        print_step "Checking AWS Amplify deployment status..."

        # Try to get app ID from Amplify
        APP_ID=$(aws amplify list-apps --query "apps[?name=='qiankun-website' || name=='Qiankun'].appId" --output text 2>/dev/null || true)

        if [ -n "$APP_ID" ] && [ "$APP_ID" != "None" ]; then
            echo -e "\n${YELLOW}Amplify App ID:${NC} $APP_ID"
            echo -e "${YELLOW}Console:${NC} https://console.aws.amazon.com/amplify/home#/$APP_ID"

            # Get latest job status
            LATEST_JOB=$(aws amplify list-jobs --app-id "$APP_ID" --branch-name "$BRANCH" --max-items 1 --query "jobSummaries[0]" --output json 2>/dev/null || true)

            if [ -n "$LATEST_JOB" ] && [ "$LATEST_JOB" != "null" ]; then
                STATUS=$(echo "$LATEST_JOB" | grep -o '"status": "[^"]*"' | head -1 | cut -d'"' -f4)
                echo -e "${YELLOW}Latest build status:${NC} $STATUS"
            fi
        else
            print_warning "Could not find Amplify app. Check AWS Console manually."
        fi
    else
        print_warning "AWS CLI not installed. Check Amplify Console for deployment status:"
        echo "  https://console.aws.amazon.com/amplify/"
    fi
}

# Main deployment flow
main() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════╗"
    echo "║     Qiankun Website Deployment        ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"

    check_directory

    # Parse arguments
    SKIP_BUILD=false
    COMMIT_MSG=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            -m|--message)
                COMMIT_MSG="$2"
                shift 2
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            -h|--help)
                echo "Usage: ./deploy.sh [options]"
                echo ""
                echo "Options:"
                echo "  -m, --message MSG   Commit message"
                echo "  --skip-build        Skip local build verification"
                echo "  -h, --help          Show this help"
                echo ""
                echo "Environment variables:"
                echo "  BRANCH              Git branch (default: main)"
                echo "  REMOTE              Git remote (default: origin)"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Build first to catch errors
    if [ "$SKIP_BUILD" = false ]; then
        build_site
    fi

    # Commit if there are changes
    if check_changes; then
        commit_changes "$COMMIT_MSG"
    fi

    # Push to trigger Amplify
    push_to_remote

    # Show Amplify status
    check_amplify_status

    echo -e "\n${GREEN}════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ Deployment initiated!${NC}"
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    echo ""
    echo "AWS Amplify will automatically build and deploy your site."
    echo "This typically takes 1-3 minutes."
    echo ""
    echo "Your site: https://qiankun.co.uk"
}

main "$@"
