export class Node {
  constructor(value) {
    this.value = value;
    this.leftChildren = null;
    this.rightChildren = null;
  }
}

class Tree {
  constructor(array = []) {
    this.array = array;
    this.root = this.buildTree(array);
  }

  buildTree(array, start = 0, end = null) {
    if (end === null) {
      array = [...new Set(array)].sort((a, b) => a - b); // Remove duplicates & sort
      end = array.length - 1;
    }

    if (start > end) return null;

    let mid = Math.floor((start + end) / 2);
    let node = new Node(array[mid]);

    node.leftChildren = this.buildTree(array, start, mid - 1);
    node.rightChildren = this.buildTree(array, mid + 1, end);

    return node;
  }
  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.rightChildren !== null) {
      this.prettyPrint(
        node.rightChildren,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.leftChildren !== null) {
      this.prettyPrint(
        node.leftChildren,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }
  insert(value, root = this.root) {
    if (root === null) return new Node(value);

    if (value < root.value)
      root.leftChildren = this.insert(value, root.leftChildren);
    else if (value > root.value)
      root.rightChildren = this.insert(value, root.rightChildren);
    return root;
  }
  delete(value, root = this.root) {
    if (root === null) return root;

    if (value < root.value) {
      root.leftChildren = this.delete(value, root.leftChildren);
    } else if (value > root.value) {
      root.rightChildren = this.delete(value, root.rightChildren);
    } else {
      // Node with one or no child
      if (root.leftChildren === null) return root.rightChildren;
      if (root.rightChildren === null) return root.leftChildren;

      // Node with two children: Get the in-order successor (smallest in the right subtree)
      let minNode = this.findMin(root.rightChildren);
      root.value = minNode.value;
      root.rightChildren = this.delete(minNode.value, root.rightChildren);
    }

    return root;
  }
  findMin(node) {
    while (node.leftChildren !== null) {
      node = node.leftChildren;
    }
    return node;
  }
  find(value, root = this.root) {
    if (root === null) return null;
    if (value === root.value) return root;

    if (value < root.value) return this.find(value, root.leftChildren);
    return this.find(value, root.rightChildren);
  }
  levelOrder(callback, queue = [this.root]) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (queue.length === 0) return;

    let node = queue.shift();
    callback(node);

    if (node.leftChildren) queue.push(node.leftChildren);
    if (node.rightChildren) queue.push(node.rightChildren);

    this.levelOrder(callback, queue);
  }
  inOrder(callback, root = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (root === null) return;

    this.inOrder(callback, root.leftChildren); // Left
    callback(root); // Root
    this.inOrder(callback, root.rightChildren); // Right
  }
  preOrder(callback, root = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (root === null) return;

    callback(root); // Root
    this.preOrder(callback, root.leftChildren); // Left
    this.preOrder(callback, root.rightChildren); // Right
  }
  postOrder(callback, root = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (root === null) return;

    this.postOrder(callback, root.leftChildren); // Left
    this.postOrder(callback, root.rightChildren); // Right
    callback(root); // Root
  }
  height(node) {
    if (node === null) return -1;
    if (node.leftChildren === null && node.rightChildren === null) return 0;

    return (
      1 +
      Math.max(this.height(node.leftChildren), this.height(node.rightChildren))
    );
  }
  depth(node, root = this.root, currentDepth = 0) {
    if (node === null || root === null) return -1;

    if (node === root) return currentDepth;

    let leftDepth = root.leftChildren
      ? this.depth(node, root.leftChildren, currentDepth + 1)
      : -1;

    if (leftDepth !== -1) return leftDepth;

    let rightDepth = root.rightChildren
      ? this.depth(node, root.rightChildren, currentDepth + 1)
      : -1;

    return rightDepth;
  }
  isBalanced(root = this.root) {
    const checkBalance = (node) => {
      if (node === null) return { balanced: true, height: -1 };

      const left = checkBalance(node.leftChildren);
      const right = checkBalance(node.rightChildren);

      if (!left.balanced || !right.balanced) {
        return { balanced: false, height: 0 };
      }

      const heightDifference = Math.abs(left.height - right.height);
      if (heightDifference > 1) {
        return { balanced: false, height: 0 };
      }

      return {
        balanced: true,
        height: 1 + Math.max(left.height, right.height),
      };
    };

    return checkBalance(root).balanced;
  }
  rebalance() {
    const sortedArray = [];
    this.inOrder((node) => sortedArray.push(node.value));
    this.root = this.buildTree(sortedArray);
  }
}

// Function to generate an array of random numbers
function generateRandomNumbers(numElements = 10, max = 100) {
  const randomNumbers = [];
  for (let i = 0; i < numElements; i++) {
    randomNumbers.push(Math.floor(Math.random() * max));
  }
  return randomNumbers;
}

function driver() {
  // Step 1: Create a binary search tree from random numbers
  const randomNumbers = generateRandomNumbers();
  const tree = new Tree(randomNumbers);
  console.log("Initial Tree (Balanced):");

  // Step 2: Confirm that the tree is balanced
  console.log("Is the tree balanced?", tree.isBalanced() ? "Yes" : "No");

  // Step 3: Print elements in level, pre, post, and in order
  const printNode = (node) => console.log(node.value);

  console.log("\nLevel Order Traversal:");
  tree.levelOrder(printNode);

  console.log("\nPre-Order Traversal:");
  tree.preOrder(printNode);

  console.log("\nPost-Order Traversal:");
  tree.postOrder(printNode);

  console.log("\nIn-Order Traversal:");
  tree.inOrder(printNode);

  // Step 4: Unbalance the tree by adding numbers > 100
  console.log("\nUnbalancing the tree by adding numbers > 100...");
  tree.insert(150);
  tree.insert(200);
  tree.insert(250);
  tree.insert(300);

  // Step 5: Confirm that the tree is unbalanced
  console.log(
    "Is the tree balanced after adding numbers > 100?",
    tree.isBalanced() ? "Yes" : "No"
  );

  // Step 6: Balance the tree
  console.log("\nBalancing the tree...");
  tree.rebalance();
  console.log(
    "Is the tree balanced after rebalancing?",
    tree.isBalanced() ? "Yes" : "No"
  );

  // Step 7: Print elements again after balancing
  console.log("\nLevel Order Traversal after balancing:");
  tree.levelOrder(printNode);

  console.log("\nPre-Order Traversal after balancing:");
  tree.preOrder(printNode);

  console.log("\nPost-Order Traversal after balancing:");
  tree.postOrder(printNode);

  console.log("\nIn-Order Traversal after balancing:");
  tree.inOrder(printNode);
}

driver();
