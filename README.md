# AVL Tree 

> [AVL Tree](https://en.wikipedia.org/wiki/AVL_tree) implementation with visualization

![AVL Tree Sample](/sample.png)

## Dependencies
> jQuery 2.2.3 or above

## Usage
```html
<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
<script src="AVLTree.js"></script>
```
```js
var tree = new AVLTree();
tree.AddValue(1); //Adds a value
tree.RemoveValue(3); //Removes a value
tree.FindValue(2); //Checks if a value exists 
tree.Draw("canvasId"); //Draws the current tree structure on screen
```