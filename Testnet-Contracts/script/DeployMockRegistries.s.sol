// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/contracts/nameService/MockEmailRegistry.sol";
import "../src/contracts/nameService/MockPhoneRegistry.sol";
import "../src/contracts/nameService/NameService.sol";

contract DeployMockRegistries is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nameServiceAddress = vm.envAddress("NAME_SERVICE_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Get NameService instance
        NameService nameService = NameService(nameServiceAddress);

        // Deploy mock registries
        MockEmailRegistry emailRegistry = new MockEmailRegistry();
        MockPhoneRegistry phoneRegistry = new MockPhoneRegistry();

        console.log("MockEmailRegistry deployed at:", address(emailRegistry));
        console.log("MockPhoneRegistry deployed at:", address(phoneRegistry));

        // Quick setup registries (bypasses time delay)
        nameService.quickSetupRegistries(address(emailRegistry), address(phoneRegistry));

        console.log("Registries set up successfully!");
        console.log("Email registry:", address(emailRegistry));
        console.log("Phone registry:", address(phoneRegistry));

        vm.stopBroadcast();
    }
}
