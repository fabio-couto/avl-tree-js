/*
* Árvore Binária AVL
* Autor: Fábio Couto
* Data: 15/05/2016
*/

AVLTree = (function () {

    //Classe para simulação de ponteiro
    function Pointer(setter, getter) {
        this.Set = setter;
        this.Get = getter;
    };

    //Nó da Árvore Binária
    function Node() {
        this.Value = null;
        this.Left = null;
        this.Right = null;
        this.Height = 0;
    };

    //Árvore Binária Balanceada pela Altura (AVL)
    function AVLTree() {
        this.Root = null;
    };

    //Calcula o fator de balanceamento do nó
    Node.prototype.GetBalanceFactor = function () {
        return (this.Left == null ? -1 : this.Left.Height) -
               (this.Right == null ? -1 : this.Right.Height);
    };

    //Efetua o balanceamento da árvore caso o nó informado esteja desbalanceado
    AVLTree.prototype.Balance = function (node) {
        var factor = node.GetBalanceFactor();
        if (factor == 2) {
            if (node.Left.GetBalanceFactor() == -1)
                this.RotateLeft(node.Left);

            this.RotateRight(node);
        } else if (factor == -2) {
            if (node.Right.GetBalanceFactor() == 1)
                this.RotateRight(node.Right);

            this.RotateLeft(node);
        }
    };

    //Recalcula a altura dos nós informados
    AVLTree.prototype.UpdateHeight = function () {
        for (var i = 0; i < arguments.length; i++) {
            var node = arguments[i];

            node.Height = Math.max(
                node.Left == null ? -1 : node.Left.Height,
                node.Right == null ? -1 : node.Right.Height
            ) + 1;
        }
    };

    //Efetua uma rotação simples à direita
    AVLTree.prototype.RotateRight = function (root) {
        var pivot = root.Left;

        var oldRootValue = root.Value;
        var oldRootRight = root.Right;

        //Pivot se torna o novo root
        root.Value = pivot.Value;
        root.Left = pivot.Left;
        root.Right = pivot;

        //Atualiza o pivot
        pivot.Value = oldRootValue;
        pivot.Left = pivot.Right;
        pivot.Right = oldRootRight;

        //Atualiza as alturas
        this.UpdateHeight(pivot, root);
    };

    //Efetua uma rotação simples a esquerda
    AVLTree.prototype.RotateLeft = function (root) {
        var pivot = root.Right;

        var oldRootValue = root.Value;
        var oldRootLeft = root.Left;

        //Pivot se torna o novo root
        root.Value = pivot.Value;
        root.Right = pivot.Right;
        root.Left = pivot;

        //Atualiza o pivot
        pivot.Value = oldRootValue;
        pivot.Right = pivot.Left;
        pivot.Left = oldRootLeft;

        //Atualiza as alturas
        this.UpdateHeight(pivot, root);
    };

    //Desenha a árvore binária no objeto canvas informado via parâmetro
    AVLTree.prototype.Draw = function (canvasId) {

        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        ctx.textAlign = "center";

        //Limpa o conteúdo já desenhado, caso exista, e define a fonte
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.Root == null)
            return;

        //Calcula o número máximo de folhas que a árvore possui
        var maxNodes = this.Root.Height == 0 ? 1 : Math.pow(2, this.Root.Height);

        //Largura em pixels da base da árvore
        var baseWidth = maxNodes * (this.Root.Height <= 3 ? 60 : 35);

        var counter = 0;
        var currentDepth = 0;
        var baseNodeWidth = baseWidth;
        var y = 55;
        var x = ((canvas.width - baseWidth) / 2) + (baseNodeWidth / 2);

        //Efetua uma busca em largura na árvore, para iniciar o desenho dos nós
        var queue = [this.Root];

        while (queue.length > 0) {
            var currentNode = queue.shift();
            counter++;

            if ((currentDepth + 1) <= this.Root.Height) {
                queue.push(currentNode == null ? null : currentNode.Left);
                queue.push(currentNode == null ? null : currentNode.Right);
            }

            if (currentNode != null) {
                //Desenha o círculo que representa o nó
                ctx.beginPath();
                ctx.arc(x, y - 5, 15, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#003300';
                ctx.stroke();

                //Desenha a linha de ligação Filho -> Pai
                if (currentDepth > 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - 20);

                    if (counter % 2 == 0)
                        ctx.lineTo(x - baseNodeWidth / 2, y - 45); //Nó direito
                    else
                        ctx.lineTo(x + baseNodeWidth / 2, y - 45); //Nó esquerdo

                    ctx.stroke();
                }

                //Escreve o valor do nó
                ctx.fillStyle = 'white';
                ctx.font = "14px Consolas";
                ctx.fillText(currentNode.Value, x, y);

                //Escreve a altura do nó
                ctx.font = "12px Consolas";
                ctx.fillStyle = 'black';
                ctx.fillText(currentNode.Height, x + 25, y - 11);
                ctx.fillStyle = 'red';
                ctx.fillText(currentNode.GetBalanceFactor(), x + 25, y + 2);
            }

            x += baseNodeWidth;

            //Calcula a quantidade de nós que o nível possui
            var levelNodes = currentDepth == 0 ? 1 : Math.pow(2, currentDepth);

            //Verifica se o nível da árvore chegou ao fim
            if (counter >= levelNodes) {
                counter = 0;
                currentDepth++;
                baseNodeWidth = baseWidth / Math.pow(2, currentDepth);
                y += 55;
                x = ((canvas.width - baseWidth) / 2) + (baseNodeWidth / 2);
            }
        }
    };

    //Procura um valor na árvore binária, partindo da raiz
    AVLTree.prototype.FindValue = function (value) {
        var node = this.Root;
        while (node != null) {
            if (node.Value == value)
                return true;
            else if (node.Value > value)
                node = node.Left;
            else
                node = node.Right;
        }
        return false;
    };

    //Insere um novo valor na árvore binária, partindo da raiz
    AVLTree.prototype.AddValue = function (value) {
        if (this.Root == null)
            this.Root = new Node();

        this.Add(this.Root, value);
    };

    //Insere o valor na árvore de forma recursiva
    AVLTree.prototype.Add = function (node, value) {

        if (node.Value == null) {
            node.Value = value;
            return 0;
        }

        if (node.Value > value) {
            if (node.Left == null)
                node.Left = new Node();
            node.Height = Math.max(this.Add(node.Left, value) + 1, node.Height);
        } else if (node.Value < value) {
            if (node.Right == null)
                node.Right = new Node();
            node.Height = Math.max(this.Add(node.Right, value) + 1, node.Height);
        }

        //Executa o balanceamento da árvore, caso necessário
        this.Balance(node);

        return node.Height;

    };

    //Remove um valor da árvore binária, partindo da raiz
    AVLTree.prototype.RemoveValue = function (value) {
        var $this = this;
        var ptr = new Pointer(
            function (v) { $this.Root = v; },
            function () { return $this.Root; }
        );

        return this.Remove(ptr, value);
    };

    //Remove o valor da árvore de forma recursiva
    AVLTree.prototype.Remove = function (ptr, value) {
        var node = ptr.Get();

        if (node == null)
            return -1;

        if (node.Value == value) {
            if (node.Left == null && node.Right == null) { //Nó folha
                ptr.Set(null);
                return -1;
            } else if (node.Left != null && node.Right != null) { //Possui dois filhos
                //Encontra o maior nó na sub-árvore esquerda (Nó mais a direita)
                var dirNode = node.Left;
                while (dirNode.Right != null) {
                    dirNode = dirNode.Right;
                }

                //Exclui o nó mais a direita e recalcula as alturas de forma recursiva
                this.RemoveValue(dirNode.Value);

                //Substitui o valor do nó
                node.Value = dirNode.Value;

                return node.Height;
            } else if (node.Left != null) { //Possui apenas o filho esquerdo
                ptr.Set(node.Left);
                return node.Left.Height;
            } else { //Possui apenas o filho direito
                ptr.Set(node.Right);
                return node.Right.Height;
            }
        }
        else if (node.Value > value) {

            //Cria o ponteiro
            var lPtr = new Pointer(
                function (v) { node.Left = v; },
                function () { return node.Left; }
            );

            var newHeight = this.Remove(lPtr, value);
            node.Height = Math.max(newHeight, node.Right == null ? -1 : node.Right.Height) + 1;
        }
        else {

            //Cria o ponteiro
            var rPtr = new Pointer(
                function (v) { node.Right = v; },
                function () { return node.Right; }
            );

            var newHeight = this.Remove(rPtr, value);
            node.Height = Math.max(newHeight, node.Left == null ? -1 : node.Left.Height) + 1;
        }

        //Executa o balanceamento da árvore, caso necessário
        this.Balance(node);

        return node.Height;
    };

    return AVLTree;

})();