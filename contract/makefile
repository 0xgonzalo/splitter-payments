MANTLE_SEPOLIA_ARGS := --rpc-url "https://rpc.sepolia.mantle.xyz" --account defaultKey --broadcast --verify --verifier blockscout --verifier-url 'https://explorer.sepolia.mantle.xyz:443/api/' -vvvv

deploy: 
	@echo "Deploying to mantle testnet"
	@forge script script/SplitterScript.s.sol:SplitterScript $(MANTLE_SEPOLIA_ARGS)