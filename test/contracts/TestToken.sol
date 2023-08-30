pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
  
  constructor() ERC20("TestToken", "TT") {
    _mint(msg.sender, 100**10);
  }

  function decimals() public view virtual override returns (uint8) {
    return 10;
  }
}
