"use strict"
let touched=false;
let grid=document.getElementById('grid_holder');
let block_holder=document.getElementById('block_holder');
let grid_back=document.getElementById("grid_background");

let black_and_white=document.getElementById('black_and_white');



//Смена цвета фона
grid_back.addEventListener('input',function () {

    document.getElementById('core').style.backgroundColor=grid_back.value
    let tmp=document.querySelectorAll('.grid_cell');
    for (let cell of tmp){
        cell.style.borderColor=invertColor(grid_back.value,black_and_white.checked);
    }



})

let rows={};
let columns={};
let layer=getCurrentLayer();
// генерация сетки
function GenerateGrid(rows_number,columns_number) {

    for (let i = 1; i <= rows_number; i++) {
        if (rows[i] == null) {
            rows[i] = [];
        }
        for (let j = 1; j <= columns_number; j++) {
            if (columns[j] == null) {
                columns[j] = [];
            }
            let cell = document.createElement('div');
            cell.classList.add('grid_cell');

            cell.style.gridArea = `${i}/${j}/${i}/${j}`;

            grid.appendChild(cell);

            rows[i].push(grid.lastChild);
            columns[j].push(grid.lastChild);

            cell.addEventListener('mousedown', function () {
                FirstTouch(this,getCurrentLayer())
            });
            cell.addEventListener('mouseover', function () {
                Enlarge(this);
            })
            cell.addEventListener('mouseup', function () {
                Finish(getCurrentLayer());
            });

        }
    }
}
GenerateGrid(10,10);


let rows_input=document.getElementById('rows');
let columns_input=document.getElementById('columns')

rows_input.addEventListener('input',function () {

    Regenerate_grid(rows_input.value,columns_input.value,grid);

})

columns_input.addEventListener('input',function () {

    Regenerate_grid(rows_input.value,columns_input.value,grid);

})

//изменение размеров сетки
function Regenerate_grid(rows,columns,grid,layer) {
    while(grid.firstChild){
       grid.removeChild(grid.lastChild);
    }
    grid.style.gridTemplateRows=`repeat(${rows}, 1fr)`;
    grid.style.gridTemplateColumns=`repeat(${columns}, 1fr)`;
    for (layer of block_holder.querySelectorAll('.layer')) {
        layer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        layer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }
    GenerateGrid(rows,columns)

}


let block;
let start_position;
function FirstTouch(cell,layer) {
    if (!touched) {
        touched = true;
        block = document.createElement('div');
        block.addEventListener('mouseup',Finish);
        block.style.zIndex=String(layer);
        block.style.gridArea=cell.style.gridArea;
        block.classList.add('block');
        block.style.backgroundColor=invertColor(grid_back.value,false);

        FindLayer(getCurrentLayer()).appendChild(block);

        start_position=cell.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g);
    }
}

function Enlarge(cell) {
    if (touched) {
        let tmp


        let row_end = Number(cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g)[0]);


        let column_end = Number(cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g)[1]);

        if (start_position[1] <= column_end) {

            block.style.gridArea = block.style.gridArea.replace(/^(\d+ \/ \d+)/, start_position.join(" / "));
            tmp = cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g).map(e => Number(e) + 1).join(" / ");

        } else {

            block.style.gridArea = block.style.gridArea.replace(/^(\d+ \/ \d+)/, start_position.map(e => Number(e) + 1).join(" / "));
            tmp = cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g).join(" / ");

        }
        block.style.gridArea = block.style.gridArea.replace(/(\d+ \/ \d+)$/, tmp);
    }
}

function Finish(layer) {
    touched=false;
    block.style.pointerEvents='auto';
}

//слои
//смена слоя
for (let button of document.getElementById('layers_list').querySelectorAll('li>input')){
    button.addEventListener('click',function () {
        if (button.checked){
            grid.style.zIndex=String(getCurrentLayer());
        }
    })
    }
document.getElementById('prev_layer').addEventListener('click',function () {

    let layer_block = document.createElement('div');
    let layer_li = document.createElement('li');
    let new_layer = String(Number(document.getElementById('layers_list').querySelectorAll('li>input')[0].value )-1);
    let layer_input=document.createElement('input');

    layer_input.setAttribute('type','radio');
    layer_input.setAttribute('name','layer');
    layer_input.setAttribute('value',`${new_layer}`);
    layer_input.setAttribute('id',`${new_layer}`);

    layer_input.addEventListener('click', function () {
        if (layer_input.checked) {

            if (block_holder.children > 0) {
                for (let layer of block_holder.children) {
                    if (layer.style.zIndex < getCurrentLayer()) {
                        for (let block of layer) {
                            block.style.pointerEvents = `none`;
                        }
                    }
                    else{
                        for (let block of layer) {
                            block.style.pointerEvents = `auto`;
                        }

                    }
                }
            }
        }
    })

    let layer_label=document.createElement("label");
    layer_label.setAttribute('for',`${new_layer}`)
    layer_label.textContent=`слой ${new_layer}`
    layer_li.appendChild(layer_input);
    layer_li.appendChild(layer_label);
    document.getElementById('layers_list').prepend(layer_li);
    layer_block.classList.add('layer');
    layer_block.classList.add(`l${new_layer}`);
    layer_block.style.zIndex = String(new_layer);
    block_holder.prepend(layer_block);


})
document.getElementById('next_layer').addEventListener('click',function () {

    let layer_block = document.createElement('div');
    let layer_li = document.createElement('li');
    let new_layer = String(Number(document.getElementById('layers_list').querySelectorAll('li>input')[document.getElementById('layers_list').querySelectorAll('li>input').length-1].value )+1);
    let layer_input=document.createElement('input');
    layer_input.setAttribute('type','radio');
    layer_input.setAttribute('name','layer');
    layer_input.setAttribute('value',`${new_layer}`);
    layer_input.setAttribute('id',`${new_layer}`);

    layer_input.addEventListener('click', function () {
        if (layer_input.checked) {

            if (block_holder.children > 0) {
                for (let layer of block_holder.children) {
                    if (layer.style.zIndex < getCurrentLayer()) {
                        for (let block of layer) {
                            block.style.pointerEvents = `none`;
                        }
                    }
                }
            }
        }
    })

    let layer_label=document.createElement("label");
    layer_label.setAttribute('for',`${new_layer}`)
    layer_label.textContent=`слой ${new_layer}`
    layer_li.appendChild(layer_input);
    layer_li.appendChild(layer_label);
    document.getElementById('layers_list').appendChild(layer_li);
    layer_block.classList.add('layer');
    layer_block.classList.add(`l${new_layer}`);
    layer_block.style.zIndex = String(new_layer);
    block_holder.append(layer_block);




    document.getElementById('layers_list').append(layer_li);

})
//получить текущий слой
function getCurrentLayer() {
    for (let button of document.getElementById('layers_list').querySelectorAll('li>input')){
        {
            if (button.checked) {
            return button.value;
            }
        }
    }
}
//получть блок текущего слоя;
function FindLayer(layer_num) {
    return block_holder.querySelector(`.layer.l${layer_num} `)
}




//функция для инвертирования цвета
function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {

        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str, len) {
    len = len || 2;
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}