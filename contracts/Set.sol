// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.2;

/// @dev Models a uint -> uint mapping where it is possible to iterate over all keys.
library Set {
  struct set {
    mapping(uint256 => IndexValue) data;
    KeyFlag[] keys;
    uint size;
  }
  struct IndexValue {
    uint256 keyIndex;
    uint256 value;
  }
  struct KeyFlag {
    uint256 key;
    bool deleted;
  }

  function insert(set storage self, uint256 key, uint256 value) public returns (bool replaced) {
    uint256 keyIndex = self.data[key].keyIndex;
    if (self.data[key].value > 0)
      replaced = true;

    keyIndex = self.keys.length;
    self.data[key].value = value;
    self.data[key].keyIndex = keyIndex;
    KeyFlag memory flag = KeyFlag(key, false);
    self.keys.push(flag);
    self.size++;
  }

  function remove(set storage self, uint256 key) public returns (bool success) {
    uint256 keyIndex = self.data[key].keyIndex;

    delete self.data[key];
    self.keys[keyIndex].deleted = true;
    self.size--;
    return true;
  }

  function contains(set storage self, uint256 key) public view returns (bool) {
    return self.data[key].value > 0;
  }

  function get(set storage self, uint256 key) public view returns (uint256 value) {
    if (!contains(self, key))
      return 0;
    uint256 keyIndex = self.data[key].keyIndex;
    if (self.keys[keyIndex].deleted)
      return 0;

    return self.data[key].value;
  }

  function itStart(set storage self) public view returns (uint256 keyIndex) {
    return itNext(self, uint256(-1));
  }

  function itValid(set storage self, uint256 keyIndex) public view returns (bool) {
    return keyIndex < self.keys.length;
  }

  function itNext(set storage self, uint256 keyIndex) public view returns (uint256 rKeyIndex) {
    keyIndex++;
    while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
      keyIndex++;
    return keyIndex;
  }

  function itGet(set storage self, uint256 keyIndex) public view returns (uint256 key, uint256 value) {
    key = self.keys[keyIndex].key;
    value = self.data[key].value;
  }
}
