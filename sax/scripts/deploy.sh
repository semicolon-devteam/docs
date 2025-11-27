#!/bin/bash

# SAX Package Deployment Script
# Usage: ./deploy.sh <package-name> <target-path> [--update]
#
# This script deploys SAX packages to target projects.
# SAX-Core is automatically included with all package deployments.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAX_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: $0 <package-name> <target-path> [--update]"
    echo ""
    echo "Available packages:"
    echo "  sax-core   - Core principles only"
    echo "  sax-po     - PO/Planner tools (includes sax-core)"
    echo "  sax-next   - Next.js developer tools (includes sax-core)"
    echo "  sax-spring - Spring developer tools (includes sax-core) [coming soon]"
    echo ""
    echo "Options:"
    echo "  --update   - Update existing installation"
    echo ""
    echo "Examples:"
    echo "  $0 sax-next /path/to/cm-template"
    echo "  $0 sax-next . --update"
}

check_version() {
    local target_path=$1
    local package_name=$2

    local source_version=$(cat "$SAX_ROOT/VERSION")

    # Check for existing sax-core version
    local target_core="$target_path/.claude/sax-core/PRINCIPLES.md"
    if [[ -f "$target_core" ]]; then
        echo -e "${YELLOW}Existing SAX-Core found in target${NC}"
    fi

    echo -e "${GREEN}Source SAX version: $source_version${NC}"
}

# Deploy SAX-Core (called by all package deployments)
deploy_core() {
    local target_path=$1

    echo -e "${BLUE}→ Deploying SAX-Core...${NC}"

    mkdir -p "$target_path/.claude/sax-core"
    cp -r "$SAX_ROOT/core/"* "$target_path/.claude/sax-core/"

    echo -e "${GREEN}  ✓ SAX-Core deployed to .claude/sax-core/${NC}"
}

deploy_po() {
    local target_path=$1
    local update_mode=$2

    echo -e "${GREEN}Deploying SAX-PO to $target_path${NC}"
    echo ""

    # Step 1: Deploy SAX-Core first
    deploy_core "$target_path"

    # Step 2: Deploy SAX-PO
    echo -e "${BLUE}→ Deploying SAX-PO package...${NC}"

    mkdir -p "$target_path/.claude/agents"
    mkdir -p "$target_path/.claude/skills"
    mkdir -p "$target_path/.claude/commands"
    mkdir -p "$target_path/.claude/templates"

    # Copy SAX-PO package CLAUDE.md to .claude/CLAUDE.md
    cp "$SAX_ROOT/packages/sax-po/CLAUDE.md" "$target_path/.claude/CLAUDE.md"

    # Copy agents
    if [[ -d "$SAX_ROOT/packages/sax-po/agents" ]]; then
        cp -r "$SAX_ROOT/packages/sax-po/agents/"* "$target_path/.claude/agents/"
    fi

    # Copy skills
    if [[ -d "$SAX_ROOT/packages/sax-po/skills" ]]; then
        cp -r "$SAX_ROOT/packages/sax-po/skills/"* "$target_path/.claude/skills/"
    fi

    # Copy commands
    if [[ -d "$SAX_ROOT/packages/sax-po/commands" ]]; then
        cp -r "$SAX_ROOT/packages/sax-po/commands/"* "$target_path/.claude/commands/"
    fi

    # Copy templates
    if [[ -d "$SAX_ROOT/packages/sax-po/templates" ]]; then
        cp -r "$SAX_ROOT/packages/sax-po/templates/"* "$target_path/.claude/templates/"
    fi

    echo -e "${GREEN}  ✓ SAX-PO deployed successfully!${NC}"
}

deploy_next() {
    local target_path=$1
    local update_mode=$2

    echo -e "${GREEN}Deploying SAX-Next to $target_path${NC}"
    echo ""

    # Step 1: Deploy SAX-Core first
    deploy_core "$target_path"

    # Step 2: Deploy SAX-Next
    echo -e "${BLUE}→ Deploying SAX-Next package...${NC}"

    mkdir -p "$target_path/.claude/agents"
    mkdir -p "$target_path/.claude/skills"
    mkdir -p "$target_path/.claude/commands"

    # Copy SAX-Next package CLAUDE.md to .claude/CLAUDE.md
    cp "$SAX_ROOT/packages/sax-next/CLAUDE.md" "$target_path/.claude/CLAUDE.md"

    # Copy agents
    if [[ -d "$SAX_ROOT/packages/sax-next/agents" ]]; then
        cp -r "$SAX_ROOT/packages/sax-next/agents/"* "$target_path/.claude/agents/"
    fi

    # Copy skills
    if [[ -d "$SAX_ROOT/packages/sax-next/skills" ]]; then
        cp -r "$SAX_ROOT/packages/sax-next/skills/"* "$target_path/.claude/skills/"
    fi

    # Copy commands
    if [[ -d "$SAX_ROOT/packages/sax-next/commands" ]]; then
        cp -r "$SAX_ROOT/packages/sax-next/commands/"* "$target_path/.claude/commands/"
    fi

    echo -e "${GREEN}  ✓ SAX-Next deployed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Run /SAX:health-check to verify installation"
}

deploy_spring() {
    echo -e "${RED}SAX-Spring is not yet available.${NC}"
    exit 1
}

# Main
if [[ $# -lt 2 ]]; then
    print_usage
    exit 1
fi

PACKAGE_NAME=$1
TARGET_PATH=$2
UPDATE_MODE=${3:-""}

# Resolve relative path
if [[ "$TARGET_PATH" == "." ]]; then
    TARGET_PATH="$(pwd)"
elif [[ ! "$TARGET_PATH" = /* ]]; then
    TARGET_PATH="$(pwd)/$TARGET_PATH"
fi

# Check if target exists
if [[ ! -d "$TARGET_PATH" ]]; then
    echo -e "${RED}Error: Target path does not exist: $TARGET_PATH${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       SAX Package Deployment           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check version if updating
if [[ "$UPDATE_MODE" == "--update" ]]; then
    check_version "$TARGET_PATH" "$PACKAGE_NAME"
    echo ""
fi

# Deploy based on package name
case $PACKAGE_NAME in
    sax-core)
        deploy_core "$TARGET_PATH"
        ;;
    sax-po)
        deploy_po "$TARGET_PATH" "$UPDATE_MODE"
        ;;
    sax-next)
        deploy_next "$TARGET_PATH" "$UPDATE_MODE"
        ;;
    sax-spring)
        deploy_spring "$TARGET_PATH" "$UPDATE_MODE"
        ;;
    *)
        echo -e "${RED}Error: Unknown package: $PACKAGE_NAME${NC}"
        print_usage
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "SAX Version: $(cat "$SAX_ROOT/VERSION")"
echo ""
echo -e "Deployed structure:"
echo -e "  .claude/"
echo -e "  ├── CLAUDE.md      ${BLUE}(Package config)${NC}"
echo -e "  ├── sax-core/      ${BLUE}(Core rules)${NC}"
if [[ "$PACKAGE_NAME" != "sax-core" ]]; then
    echo -e "  ├── agents/"
    echo -e "  └── skills/"
fi
echo ""
