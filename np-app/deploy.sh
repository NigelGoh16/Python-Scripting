echo "Switching to branch main"
git checkout main

echo "Building App..."
npm run Building

echo "Deploying files to server..."
scp -r build/* root@157.245.70.171:/var/www/157.245.70.171/

echo "Done!"