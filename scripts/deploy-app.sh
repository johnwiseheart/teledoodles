REMOTE_URL=$(git config --get remote.origin.url)
USER_NAME=$(basename $(dirname $REMOTE_URL))
REPO_NAME=$(basename $REMOTE_URL)
GITHUB_URL="https://${GH_TOKEN}@github.com/${USER_NAME}/${REPO_NAME}"

git push -d $GITHUB_URL gh-pages

echo "teledoodles.jcaw.me" > app/dist/CNAME
cp app/404.html app/dist/404.html

git add app/dist -f
git commit --allow-empty -m "Commiting built assets for gh-pages"
git subtree push --prefix app/dist $GITHUB_URL gh-pages