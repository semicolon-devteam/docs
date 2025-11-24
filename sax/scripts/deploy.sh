#!/bin/bash

# SAX Package Deployment Script
# Usage: ./deploy.sh <package-name> <target-path> [--update]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAX_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: $0 <package-name> <target-path> [--update]"
    echo ""
    echo "Available packages:"
    echo "  sax-core   - Core principles (for command-center)"
    echo "  sax-po     - PO/Planner tools (for docs)"
    echo "  sax-next   - Next.js developer tools (for cm-* projects)"
    echo "  sax-spring - Spring developer tools (for core-* projects) [coming soon]"
    echo ""
    echo "Options:"
    echo "  --update   - Update existing installation (preserves local customizations)"
    echo ""
    echo "Examples:"
    echo "  $0 sax-next /path/to/cm-template"
    echo "  $0 sax-next . --update"
}

check_version() {
    local target_path=$1
    local package_name=$2

    local source_version=$(cat "$SAX_ROOT/VERSION")
    local target_claude_md="$target_path/.claude/sax-next/CLAUDE.md"

    if [[ -f "$target_claude_md" ]]; then
        local target_version=$(grep -oP 'SAX-Next v\K[0-9.]+' "$target_claude_md" 2>/dev/null || echo "unknown")
        echo -e "${YELLOW}Current version in target: $target_version${NC}"
        echo -e "${GREEN}Source version: $source_version${NC}"
    fi
}

deploy_core() {
    local target_path=$1
    local update_mode=$2

    echo -e "${GREEN}Deploying SAX-Core to $target_path${NC}"

    mkdir -p "$target_path/.claude/sax-core"
    cp -r "$SAX_ROOT/core/"* "$target_path/.claude/sax-core/"

    echo -e "${GREEN}SAX-Core deployed successfully!${NC}"
}

deploy_po() {
    local target_path=$1
    local update_mode=$2

    echo -e "${GREEN}Deploying SAX-PO to $target_path${NC}"

    mkdir -p "$target_path/.claude"

    # Copy all SAX-PO contents
    cp -r "$SAX_ROOT/packages/sax-po/"* "$target_path/.claude/"

    echo -e "${GREEN}SAX-PO deployed successfully!${NC}"
}

deploy_next() {
    local target_path=$1
    local update_mode=$2

    echo -e "${GREEN}Deploying SAX-Next to $target_path${NC}"

    mkdir -p "$target_path/.claude/sax-next"
    mkdir -p "$target_path/.claude/agents"
    mkdir -p "$target_path/.claude/skills"

    # Copy SAX-Next package config
    cp "$SAX_ROOT/packages/sax-next/CLAUDE.md" "$target_path/.claude/sax-next/"

    # Copy agents
    if [[ -d "$SAX_ROOT/packages/sax-next/agents" ]]; then
        cp -r "$SAX_ROOT/packages/sax-next/agents/"* "$target_path/.claude/agents/"
    fi

    # Copy skills
    if [[ -d "$SAX_ROOT/packages/sax-next/skills" ]]; then
        cp -r "$SAX_ROOT/packages/sax-next/skills/"* "$target_path/.claude/skills/"
    fi

    echo -e "${GREEN}SAX-Next deployed successfully!${NC}"
    echo -e "${YELLOW}Note: Update your CLAUDE.md to reference SAX-Next package${NC}"
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

# Check version if updating
if [[ "$UPDATE_MODE" == "--update" ]]; then
    check_version "$TARGET_PATH" "$PACKAGE_NAME"
fi

# Deploy based on package name
case $PACKAGE_NAME in
    sax-core)
        deploy_core "$TARGET_PATH" "$UPDATE_MODE"
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
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "SAX Version: $(cat "$SAX_ROOT/VERSION")"
