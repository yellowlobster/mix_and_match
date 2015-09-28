publish:
	git checkout gh-pages
	git merge master
	npm install
	npm run build
	git add .
	git commit -m "New site version"
	git push origin gh-pages
	git checkout master
