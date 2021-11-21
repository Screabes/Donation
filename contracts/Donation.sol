// SPDX-License-Identifier: Unlicense

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Donation is Ownable {

    mapping(address => uint256) public userBalance;

    address[] public depositors;

    event Deposit(address depositor, uint256 amount);
    event Withdraw(address account, uint256 amount);

    function deposit() external payable {
        require(msg.value >= 0.001 ether, "deposit: msg.value not good");
        userBalance[msg.sender] += msg.value;
        depositors.push(msg.sender);

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(address _to, uint256 _amount) external onlyOwner {
        uint256 balance = address(this).balance;
        uint256 withdrawalAmount = _amount > balance ? balance : _amount;
        payable(_to).transfer(withdrawalAmount);

        emit Withdraw(_to, withdrawalAmount);
    }

}