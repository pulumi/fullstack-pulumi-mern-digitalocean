.PHONY: clean
clean:
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf infra/node_modules

.PHONY: ensure
ensure:
	npm -C frontend install
	npm -C backend install
	npm -C infra install

.PHONY: dev
dev:
	npm run dev

.PHONY: build
build:
	npm -C frontend run build
	npm -C backend run build

.PHONY: destroy
destroy:
	pulumi -C infra destroy --yes

.PHONY: deploy
deploy:
	pulumi -C infra up --skip-preview
