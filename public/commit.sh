#!/bin/bash

# Parse input arguments
if [ "$#" -ne 4 ]; then
  echo "Usage: $0 START_DATE NUM_DAYS REPO_PATH GITHUB_USERNAME"
  echo "Example: $0 2025-01-01 30 ./repos/art2025 your_github_username"
  exit 1
fi

START_DATE="$1"
NUM_DAYS="$2"
REPO_PATH="$3"
GITHUB_USERNAME="$4"

mkdir -p "$REPO_PATH"
cd "$REPO_PATH" || exit 1
git init
git branch -m main
git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$GITHUB_USERNAME@users.noreply.github.com"

increment_date() {
    # Use date command with different syntax for macOS and Linux
    if date -v1d &>/dev/null; then
        # macOS
        date -j -v+1d -f "%Y-%m-%d" "$1" "+%Y-%m-%d"
    else
        # Linux
        date -d "$1 + 1 day" "+%Y-%m-%d"
    fi
}

current_date="$START_DATE"
exit 0

# Generate commits
for ((i=0; i<NUM_DAYS; i++)); do
    # check if date is true in a file called "2025.json" using jq
    # json looks like this: { "2025-01-01": false, "2025-01-02": true, ... }
    # if date is true, commit, else skip
    to_commit=$(jq -r --arg date "$current_date" '.[$date] // false' ~/Desktop/2025.json)
    if [ "$to_commit" = true ]; then
      # Add README with current date
      printf "Commit for $current_date \n" >> README.md

      # Stage changes
      git add README.md

      # Set both author and committer dates to the current date
      export GIT_AUTHOR_DATE="$current_date 12:00:00"
      export GIT_COMMITTER_DATE="$current_date 12:00:00"

      # Commit with a consistent message
      git commit -m "Daily commit at $current_date"
    fi

    # Increment date
    current_date=$(increment_date "$current_date")
done

