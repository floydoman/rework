export default function() {

    window.addEventListener('load', function (e) {

        if (document.querySelectorAll('[data-tree]').length > 0) {
            document.querySelectorAll('[data-tree]').forEach(tree => {
                const treeToggle = tree.querySelectorAll('[data-tree-toggle]');
                const treeCheckBoxes = tree.querySelectorAll('[data-tree-check]');

                treeToggle.forEach(elem => {
                    elem.addEventListener('click', (event) => {
                        elem.closest('[data-tree-node]').classList.toggle('node-hidden');
                    })
                })
            })
        }
    })
}
