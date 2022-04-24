$('.example').click(function(){     
    $('#txt').val($(this).text());
    $('#txt').trigger('input');
    return false;
});

function displayTree(tree) {
    if (!tree.subtrees || tree.subtrees.length == 0) {
        return '<li><a href="#">' + tree.root + '</a></li>';
    }
    var builder = [];
    builder.push('<li><a href="#">');
    builder.push(tree.root);
    builder.push('</a>')
    builder.push('<ul>')
    for (var i in tree.subtrees) {
        builder.push(displayTree(tree.subtrees[i]))
    }
    builder.push('</ul>')
    builder.push('</li>')
    return builder.join('');
}

function displayRow(obj) {
    let row = JSON.parse(JSON.stringify(obj))
    row.rhs.splice(row.dot, 0, '.')
    return row.lhs + ' -> ' + row.rhs.join(' ') + ', ' + row.left
}

$('#txt').bind('input', function() {
    var s = $(this).val();

    var tokenStream = s.trim().split(' ');

    var rules = $('#grm').val().trim().split('\n')

    var grammar = new tinynlp.Grammar(rules);

    var rootProduction = 'S';
    var chart = tinynlp.parse(tokenStream, grammar, rootProduction);
    $('#dv').empty();
    for (var i = 0; i < chart.chart.length; i++) {
    		$('#dv').append('Bảng T' + i + ': <br>')
        for (var j = 0; j < chart.chart[i].length; j++) {
        		if (chart.chart[i][j].lhs === chart.chart[i][j].lhs.toUpperCase()) {
                $('#dv').append('- ' + displayRow(chart.chart[i][j]) + '<br>')
            }
        }
    }
    
    var state = chart.getFinishedRoot(rootProduction);
    if (state) {
        var trees = state.traverse();
        for (var i in trees) {
            console.log(JSON.stringify(trees[i]))
            $('#dv').append('<div class="tree" id="displayTree"><ul>' + displayTree(trees[i]) + '</ul></div></br>');
        }
    }
});
