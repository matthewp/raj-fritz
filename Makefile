ROLLUP=node_modules/.bin/rollup

SOURCE=src/index.js \
	node_modules/raj/runtime.js \
	node_modules/fritz/worker.js

all: raj-fritz.js raj-fritz.umd.js
.PHONY: all

raj-fritz.js: $(SOURCE)
	$(ROLLUP) -o $@ -c rollup.config.js -f es src/index.js

raj-fritz.umd.js: $(SOURCE)
	$(ROLLUP) -o $@ -c rollup.config.js -f umd -n fritzProgram src/umd.js

clean:
	@rm raj-fritz.js raj-fritz.umd.js
.PHONY: clean

# Serve the current directory (port 8009)
serve:
	http-server -p 8009
.PHONY: serve

# Watch for file changes and rerun `worker` and `window`
watch:
	find src -name "*.js" | entr make all
.PHONY: watch

# Run `serve` and `watch`
dev:
	make serve & make watch
.PHONY: dev
