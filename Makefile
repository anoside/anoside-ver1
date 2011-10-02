TESTS = $(shell find test -name '*.test.js')

test:
	@NODE_ENV=test ./node_modules/.bin/vows \
		$(TESTS) \
		--spec

.PHONY: test
