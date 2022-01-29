.PHONY: ensure
ensure:
	npm -C frontend install
	npm -C backend install
	npm -C infra install

.PHONY: serve
serve:
	echo "nope"

.PHONY: build
build:
	npm -C frontend run build
	npm -C backend run build

.PHONY: clean
clean:
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf infra/node_modules

.PHONY: destroy
destroy:
	pulumi -C infra destroy --yes

.PHONY: deploy
deploy:
	pulumi -C infra up --skip-preview
