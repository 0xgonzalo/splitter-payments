MANTLE_SEPOLIA_ARGS := --rpc-url "https://rpc.sepolia.mantle.xyz" --account defaultKey --broadcast --verify --verifier blockscout --verifier-url 'https://explorer.sepolia.mantle.xyz:443/api/' -vvvv

deploy: 
	@echo "Deploying to mantle testnet"
	@forge script script/SplitterScript.s.sol:SplitterScript $(MANTLE_SEPOLIA_ARGS)

unitTestSplitterDynamic:
	@echo "Running SplitterDynamic unit tests"
	@forge test --match-path test/SplitterDynamicUnitTest.t.sol --summary --detailed --gas-report -vvv --show-progress
