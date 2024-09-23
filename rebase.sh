#!/bin/bash

# Check if in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: Current directory is not a git repository"
    exit 1
fi

# Get current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Ask user for confirmation
read -p "This will delete all commit history and create a new initial commit. Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Operation cancelled"
    exit 1
fi

# Perform squash operation
echo "Performing squash operation..."

# Create a new orphan branch
git checkout --orphan temp_branch

# Add all files
git add -A

# Create a new commit
commit_message="init"
git commit -m "$commit_message"

# Delete the original branch
git branch -D $current_branch

# Rename the current branch to the original branch name
git branch -m $current_branch

# Force update remote repository (if needed)
read -p "Do you want to force update the remote repository? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git push -f origin $current_branch
    echo "Remote repository updated"
else
    echo "Remote repository not updated. If needed, manually run: git push -f origin $current_branch"
fi

echo "Operation complete! All history has been compressed into a new initial commit"