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
}

const array = [1, 5, 7, 3, 2, 4, 1, 2, 3, 4, 5, 1];
const tree = new Tree(array);
tree.insert(15);
tree.insert(6);
tree.insert(17);
tree.insert(14);

tree.prettyPrint(tree.root);
