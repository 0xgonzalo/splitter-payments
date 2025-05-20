MANTLE_SEPOLIA_ARGS := --rpc-url "https://rpc.sepolia.mantle.xyz" --account defaultKey --broadcast --verify --verifier blockscout --verifier-url 'https://explorer.sepolia.mantle.xyz:443/api/' -vvvv

deployStatic: 
	@forge clean
	@echo "Deploying SplitterStaticFactory to mantle testnet"
	@forge script script/SplitterStaticFactory.s.sol:SplitterStaticFactoryScript $(MANTLE_SEPOLIA_ARGS)

deployDynamic: 
	@forge clean
	@echo "Deploying SplitterDynamicFactory to mantle testnet"
	@forge script script/SplitterDynamicFactory.s.sol:SplitterDynamicFactoryScript $(MANTLE_SEPOLIA_ARGS)

verifyDynamic: 
	@echo "Verifying SplitterDynamicFactory on mantle testnet"
	@forge verify-contract --rpc-url https://rpc.sepolia.mantle.xyz --verifier blockscout --verifier-url 'https://explorer.sepolia.mantle.xyz:443/api/' 0xDf81d8bBB2A7127C61C35304fBdd595143df08E0 src/SplitterDynamic.sol:SplitterDynamic --compiler-version v0.8.20

verifyStatic:
	@echo "Verifying SplitterStaticFactory on mantle testnet"
	@forge verify-contract --rpc-url https://rpc.sepolia.mantle.xyz --verifier blockscout --verifier-url 'https://explorer.sepolia.mantle.xyz:443/api/' 0xE3Af48694B2766d2D5F0A284784DcE95D0E2597C src/SplitterStatic.sol:SplitterStatic --compiler-version v0.8.20

unitTestSplitterDynamic:
	@echo "Running SplitterDynamic unit tests"
	@forge test --match-path test/SplitterDynamicUnitTest.t.sol --summary --detailed --gas-report -vvv --show-progress

unitTestSplitterStatic:
	@echo "Running SplitterStatic unit tests"
	@forge test --match-path test/SplitterStaticUnitTest.t.sol --summary --detailed --gas-report -vvv --show-progress