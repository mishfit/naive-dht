# mock-dht

1. Design and implement a distributed hash table (DHT) that allows nodes to store and retrieve arbitrary binary data associated with unique keys.

The DHT API should provide following methods:

- Store(key, data)
- KeyExists(key) bool
- Retrieve(key) data

Address information required for routing between nodes on the network should be stored on the same table, newly arriving node should be able to bootstrap itself from any existing node address given as configuration. Individual nodes should use TCP to connect to each other, assuming that all ports in required range are open and no firewalls/NAT devices exist on any route.

Implement in Go or C++.
2. Implement solution to drinking philosophers problem in go or c++.
