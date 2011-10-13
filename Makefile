TESTS = $(shell find test -name '*.test.js')

test:
	@NODE_ENV=test ./node_modules/vows/bin/vows \
		$(TESTS) \
		--spec

.PHONY: test
