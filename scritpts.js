"use strict"
let touched=false;
let grid=document.getElementById('wrapper');

let grid_back=document.getElementById("grid_background");

let black_and_white=document.getElementById('black_and_white');

let menu_back=document.getElementById('menu');

grid_back.addEventListener('input',function () {

    document.querySelector('body').style.backgroundColor=grid_back.value

    let tmp=document.querySelectorAll('.grid_cell');
    for (let cell of tmp){
        cell.style.borderColor=invertColor(grid_back.value,black_and_white.checked);
    }

    let labels_tmp=document.querySelectorAll('label');
    for (let label of labels_tmp){
        label.style.color=invertColor(grid_back.value,black_and_white.checked);
    }

})
let block;
let start_position;
let first_time;
let prev_row;
let prev_colum;
// генерация сетки
for (let i=1;i<=10;i++){
    for (let j=1;j<=10;j++){
        let cell=document.createElement('div');
        cell.classList.add('grid_cell');
        cell.style.gridArea=`${i}/${j}/${i}/${j}`;

        grid.appendChild(cell);
        function FirstTouch() {
            if (!touched) {
                first_time=true;
                touched = true;
                block = document.createElement('div');
                block.addEventListener('mouseup',Finish);
                block.style.gridArea=cell.style.gridArea;
                block.style.zIndex=`-1`;
                block.style.backgroundColor=invertColor(grid_back.value,false);
                grid.appendChild(block);
                start_position=cell.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g);
            }
        }

        function Enlarge() {
            if (touched){
                let tmp

                if (first_time===true){
                    prev_colum=start_position[0];
                    prev_row=start_position[1];
                    first_time=false;
                }

                let row_start=Number(block.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g)[0]);
                let row_end=Number(cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g)[0]);

                let column_start=Number(block.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g)[1]);
                let column_end=Number(cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g)[1]);

                console.log(prev_colum,column_end)
                if ( column_start<column_end+1) {
                    block.style.gridArea=block.style.gridArea.replace(/^(\d+ \/ \d+)/,start_position.join(" / "));
                    tmp = cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g).map(e => Number(e) + 1).join(" / ");
                    block.style.gridArea=block.style.gridArea.replace(/(\d+ \/ \d+)$/,tmp);
                }
                else {

                    block.style.gridArea=block.style.gridArea.replace(/^(\d+ \/ \d+)/,start_position.map(e => Number(e) + 1).join(" / "));
                    tmp=cell.style.gridArea.match(/(\d+ \/ \d+)$/)[0].match(/\d+/g).join(" / ");
                    block.style.gridArea=block.style.gridArea.replace(/(\d+ \/ \d+)$/,tmp);
                }
                prev_row=cell.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g)[0];
                prev_colum=cell.style.gridArea.match(/^(\d+ \/ \d+)/)[0].match(/\d+/g)[1];

                // console.log(tmp);


                console.log(block.style.gridArea);
            }
        }

        cell.addEventListener('mousedown',FirstTouch);
        cell.addEventListener('mouseover',Enlarge);
        cell.addEventListener('mouseup',Finish);

    }
}
function Finish() {
    touched=false;
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