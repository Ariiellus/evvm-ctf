// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockEmailRegistry
 * @notice Simple mock registry for CTF/testing purposes
 * @dev Always returns 50 (successful registration multiplier)
 */
contract MockEmailRegistry {
    /**
     * @notice Mock register function that always succeeds
     * @return uint256 Always returns 50 to indicate successful registration
     */
    function register(
        address,
        string memory,
        uint256,
        bytes memory,
        uint256,
        bytes memory
    ) external pure returns (uint256) {
        return 50; // Return success multiplier
    }
}
