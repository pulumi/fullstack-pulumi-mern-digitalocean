.PHONY: ensure
ensure:
	npm -C frontend install
	npm -C api install
	npm -C infra install

.PHONY: build
build:
	npm -C frontend run build
	npm -C api run build

.PHONY: clean
clean:
	rm -rf frontend/node_modules
	rm -rf api/node_modules
	rm -rf infra/node_modules

.PHONY: destroy
destroy:
	pulumi -C infra destroy --yes

.PHONY: deploy
deploy:
	pulumi -C infra up --refresh --skip-preview
