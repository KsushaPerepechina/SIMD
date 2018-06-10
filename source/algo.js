/* @author: Ксения Перепечина
   @date:   26.05.2018       */
/*google.charts.load('current', {'packages':['corechart']});
var kYFromN = [], kYFromR = [], eFromN = [], eFromR = [], dFromN = [], dFromR = []*/;

var consistentTime=0;
var parallelTime=0;
var avgLength=0;

var absAmount=0;
var minusAmount=0;
var lessAmount=0;
var squareAmount=0;
var multiAmount=0;
var plusAmount=0;

var ifExecution=0;
var elseExecution=0;

function createMatrix(rows,columns){
    var matrix=[];
    for(var i=0;i<rows;i++){
        matrix.push([]);
        for(var j=0;j<columns;j++){
            matrix[i].push((Math.random()*2+(-1)).toFixed(4));
        }
    }
    return matrix;
}

function absMatrix(matrix,absTime,n){
    var absMatrix=[];
    var count=0;
    for (var i=0;i<matrix.length;i++){
        absMatrix.push([]);
        for (var j=0;j<matrix[0].length;j++){
            absMatrix[i].push(Math.abs(matrix[i][j]));
            count++;
            absAmount++;
        }
    }
    consistentTime+=count*absTime;
    parallelTime+=absTime*Math.ceil(count/n);
    return absMatrix;
}

function minusMatrix(A, B, m, p, q, minusTime, n){
    var minusMatrix=[];
    var count=0;
    for (var k=0;k<m;k++){
        minusMatrix.push([]);
        for (var i=0;i<p;i++){
            minusMatrix[k].push([]);
            for (var j=0;j<q;j++){
                minusMatrix[k][i].push(A[i][k]-B[k][j]);
                count++;
                minusAmount++;
            }
        }
    }
    consistentTime+=minusTime*count;
    parallelTime+=minusTime*Math.ceil(count/n);
    return minusMatrix;
}

function absMatrix3D(matrix,absTime,n){
    var absMatrix=[];
    var count=0;
    for (var i=0;i<matrix.length;i++){
        absMatrix.push([]);
        for(var j=0;j<matrix[i].length;j++){
            absMatrix[i].push([]);
            for (var k=0;k<matrix[i][j].length;k++){
                absMatrix[i][j].push(Math.abs(matrix[i][j][k]));
                count++;
                absAmount++;
            }
        }
    }
    consistentTime+=count*absTime;
    parallelTime+=absTime*Math.ceil(count/n);
    return absMatrix;
}

function squareMatrix(matrix, squareTime, n){
    var squareMatrix=[];
    var count=0;
    for (var i=0;i<matrix.length;i++){
        squareMatrix.push([]);
        for(var j=0;j<matrix[0].length;j++){
            squareMatrix[i].push(Math.round(matrix[i][j]*matrix[i][j]*10000)/10000);
            count++;
            squareAmount++;
        }
    }
    consistentTime+=squareTime*count;
    parallelTime+=squareTime*Math.ceil(count/n);
    return squareMatrix;
}

function calculateD(absAminusB,E,squareA,B,multiTime,lessTime,n){
    var multiCount=0;
    var lessCount=0;
    var D=[];
    for (var k=0;k<B.length;k++){
        D.push([]);
        for(var i=0;i<squareA.length;i++){
            D[k].push([]);
            for (var j=0;j<B[0].length;j++){
                if(absAminusB[k][i][j]<E[0][k]){
                    D[k][i].push(squareA[i][k]);
                    ifExecution++;
                }
                else{
                    D[k][i].push(Math.round(squareA[i][k]*B[k][j]*10000)/10000);
                    multiCount++;
                    multiAmount++;
                    elseExecution++;
                }
                lessCount++;
                lessAmount++;
            }
        }
    }
    consistentTime+=multiCount*multiTime;
    consistentTime+=lessCount*lessTime;
    parallelTime+=multiTime*Math.ceil(multiCount/n);
    parallelTime+=lessTime*Math.ceil(lessCount/n);
    return D;
}

function calculateCElem(i,j,D,sumTime,n){
    var Dk=[];
    for (k=0;k<D.length;k++){
        Dk.push(D[k][i][j]);
    }
    return sumArray(Dk,sumTime,n);
}

function sumArray(array,plusTime,n){
    if(array.length==1){
        var res=array[0];
        avgLength+=Math.ceil(Math.log2(array.length));
        return res;
    }
    else{
        var res=[];
        if(2*n<array.length){
            for(var i=0;i<2*n;i+=2){
                res.push(array[i]+array[i+1]);
                plusAmount++;
                consistentTime+=plusTime;
            }
            for(var i=2*n;i<array.length;i++){
                res.push(array[i]);
            }
            parallelTime+=plusTime;
        }
        else{
            if(array.length%2==1){
                res.push(array[array.length-1]);
            }
            for (var i=0;i<(array.length-array.length%2);i+=2){
                res.push(array[i]+array[i+1]);
                consistentTime+=plusTime;
                plusAmount++;
            }
            parallelTime+=plusTime;
        }
        return(sumArray(res,plusTime,n));
    }
}

function createTable(matrix, parent){
    var table=document.createElement("table");
    var tableRow="";
    var tableData="";
    var height=60;
    table.setAttribute("width",250);
    table.setAttribute("border","1px")
    table.setAttribute("bordercolor","black");
    table.setAttribute("align","left");
    for (var i=0;i<matrix.length;i++){
        tableRow=document.createElement("tr");
        for(var j=0;j<matrix[0].length;j++){
            tableData=document.createElement("td");
            tableData.innerHTML+=""+matrix[i][j];
            tableRow.appendChild(tableData);
            tableData.setAttribute("height",height);
        }
        table.appendChild(tableRow);
    }
    return parent.appendChild(table);
}

var elem=document.createElement("p");

function main(){
    elem.innerHTML="";
    var m=parseInt(document.getElementById("m").value);
    var p=parseInt(document.getElementById("p").value);
    var q=parseInt(document.getElementById("q").value);
    var n=parseInt(document.getElementById("n").value);
    if(isNaN(m)||m<=0||isNaN(p)||q<=0||isNaN(q)||q<=0||n<=0){
        alert("Параметры некорректно заданы!");
        return;
    }
    var operatorLengths=[];
    operatorLengths.push(parseInt(document.getElementById("plus").value));
    operatorLengths.push(parseInt(document.getElementById("minus").value));
    operatorLengths.push(parseInt(document.getElementById("multi").value));
    operatorLengths.push(parseInt(document.getElementById("square").value));
    operatorLengths.push(parseInt(document.getElementById("abs").value));
    operatorLengths.push(parseInt(document.getElementById("less").value));
    for (var i=0;i<operatorLengths.length;i++){
        if(isNaN(operatorLengths[i])||operatorLengths[i]<=0){
            alert("Параметры некорректно заданы!");
            return;
        }
    }
    var operators=["оператор ' + '","оператор ' - '","оператор ' * '","оператор ' ^2 '","оператор '| |'","оператор ' < '"];
    /* 1.Генерирование матрицы А, В и Е */
    var matrixA=createMatrix(p,m);
    var matrixB=createMatrix(m,q);
    var matrixE=createMatrix(1,m);

    var table=document.createElement("table");
    table.setAttribute("align","left");
    var tableRow=document.createElement("tr");
    var tableData=document.createElement("td");
    tableData.innerHTML+="<p align='center'>A=</p>";
    tableRow.appendChild(tableData);
    tableData=document.createElement("td");
    tableData.innerHTML+="<p align='center'>B=</p>";
    tableRow.appendChild(tableData);
    tableData=document.createElement("td");
    tableData.innerHTML+="<p align='center'>E=</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);

    tableRow=document.createElement("tr");
    tableData=document.createElement("td");

    createTable(matrixA,tableData);
    tableRow.appendChild(tableData);
    tableData=document.createElement("td");
    createTable(matrixB,tableData);
    tableRow.appendChild(tableData);
    tableData=document.createElement("td");
    createTable(matrixE,tableData);
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);
    /* 2. Получение матриц, состоящих из элементов матриц А и В, взятых по модулю */
    var absA=absMatrix(matrixA,operatorLengths[4],n);
    var absB=absMatrix(matrixB,operatorLengths[4],n);
    /* 3. Получение матрицы, состоящей из |aik|-|bkj| */
    var AminusB=minusMatrix(absA,absB,m,p,q,operatorLengths[1],n);
    /* 4. Получение матрицы, состоящей из ||aik|-|bkj|| */
    var absAminusB=absMatrix3D(AminusB,operatorLengths[4],n);
    /* 5. Получение матрицы, состоящей из (aij)^2 */
    var squareA=squareMatrix(matrixA,operatorLengths[3],n);
    /* 6. Получение матрицы Dk */
    var matrixD=calculateD(absAminusB,matrixE,squareA,matrixB,operatorLengths[2],operatorLengths[5],n);

    body=document.querySelector("body");
    elem.appendChild(table);

    table=document.createElement("table");
    table.setAttribute("align","left");
    tableRow=document.createElement("tr");
    for (var k=0;k<m;k++){
        tableData=document.createElement("td");
        tableData.innerHTML+="<p align='center'>D["+(k+1)+"]=</p>";
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    tableRow=document.createElement("tr");
    for (var k=0;k<m;k++){
        tableData=document.createElement("td");
        createTable(matrixD[k],tableData);
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    elem.appendChild(table);
    /* 7. Получение матрицы С */
    var matrixC=[];
    for (var i=0;i<p;i++){
        matrixC.push([]);
        for (var j=0;j<q;j++){
            matrixC[i][j]=Math.round(calculateCElem(i,j,matrixD,operatorLengths[0],n)*1000)/1000;
        }
    }
    /* 8. Расчёт парамеров */
    var Ky=consistentTime/parallelTime;
    var e=Ky/n;
    var totalRang=2*m*p*q;
    var avgLength=(2*minusAmount*operatorLengths[1]+2*multiAmount*operatorLengths[2]+squareAmount*operatorLengths[3]+absAmount*operatorLengths[4]+2*lessAmount*operatorLengths[5]+2*p*q*Math.ceil(Math.log2(m)))/totalRang;
    var D=parallelTime/(avgLength);

    elem.innerHTML+="<p align='right'>C=</p>";
    createTable(matrixC,elem);

    var operatorAmounts=[];
    operatorAmounts.push(plusAmount);
    operatorAmounts.push(minusAmount);
    operatorAmounts.push(multiAmount);
    operatorAmounts.push(squareAmount);
    operatorAmounts.push(absAmount);
    operatorAmounts.push(lessAmount);
    table=document.createElement("table");
    table.setAttribute("bordercolor","black");
    table.setAttribute("border","1px");
    table.setAttribute("align","left");
    tableRow=document.createElement("tr");
    var tableHeader=document.createElement("th");
    tableRow.appendChild(tableHeader);
    for (var i=0;i<operators.length;i++){
        tableHeader=document.createElement("th");
        var text=document.createTextNode(operators[i]);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader)
    }
    tableHeader=document.createElement("th");
    var text=document.createTextNode("Т1");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);

    tableHeader=document.createElement("th");
    var text=document.createTextNode("Тn");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader=document.createElement("th");
    var text=document.createTextNode("Ky");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader=document.createElement("th");
    var text=document.createTextNode("e");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader=document.createElement("th");
    var text=document.createTextNode("r");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader=document.createElement("th");
    var text=document.createTextNode("D");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableRow=document.createElement("tr");
    tableData=document.createElement("td");
    tableData.innerHTML+="<p align='center'>Время операции</p>";
    tableRow.appendChild(tableData);
    for (var i=0;i<operatorLengths.length;i++){
        tableData=document.createElement("td");
        tableData.innerHTML+="<p align='center'>"+operatorLengths[i]+"</p>";
        tableRow.appendChild(tableData);
    }
    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+consistentTime+"</p>";
    tableRow.appendChild(tableData);

    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+parallelTime+"</p>";
    tableRow.appendChild(tableData);

    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+Ky.toFixed(4)+"</p>";
    tableRow.appendChild(tableData);

    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+e.toFixed(4)+"</p>";
    tableRow.appendChild(tableData);

    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+totalRang+"</p>";
    tableRow.appendChild(tableData);

    tableData=document.createElement("td");
    tableData.setAttribute("rowspan","2");
    tableData.innerHTML+="<p align='center'>"+D.toFixed(4)+"</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);

    tableRow=document.createElement("tr");
    tableData=document.createElement("td");
    tableData.innerHTML+="<p align='center'>Количество вызовов</p>";
    tableRow.appendChild(tableData);
    for (var i=0;i<operatorAmounts.length;i++){
        tableData=document.createElement("td");
        tableData.innerHTML+="<p align='center'>"+operatorAmounts[i]+"</p>";
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    elem.appendChild(table);
    body.appendChild(elem);

    /*configureFirstChart(p,q,r,matrixA,matrixB,matrixE,operatorLengths);
    co9nfigureFirstChart(p,q,m,less,minus,multi,plus,abs,generatedA,generatedB,generatedE,operatorLengths,num);
    configureFirstChart(p,q,m,less,minus,multi,plus,abs,generatedA,generatedB,generatedE,operatorLengths,num);
    configureFirstChart(p,q,m,less,minus,multi,plus,abs,generatedA,generatedB,generatedE,operatorLengths,num);
    configureFirstChart(p,q,m,less,minus,multi,plus,abs,generatedA,generatedB,generatedE,operatorLengths,num);

    google.charts.setOnLoadCallback(drawFirstChart);
    google.charts.setOnLoadCallback(drawSecondChart);
    google.charts.setOnLoadCallback(drawThirdChart);
    google.charts.setOnLoadCallback(drawForthChart);
    google.charts.setOnLoadCallback(drawFifthChart);
    google.charts.setOnLoadCallback(drawSixthChart);*/
}

/*function configureFirstChart(p,q,r,matrixA,matrixB,matrixE,operatorLengths){
    var temporaryArray = [];
    var Ky = 0;
    for(var n = 1; n <= 40; n++){
        temporaryArray = [];
        temporaryArray.push(n);
        for(var m = 1; m <= 30; m++){
            absAmount=0,minusAmount=0,lessAmount=0,squareAmount=0,multiAmount=0,plusAmount=0;
            ifExecution=0,elseExecution=0;
            Ky=0;
            consistentTime=0,parallelTime=0;
            var matrixA=createMatrix(p,m);
            var matrixB=createMatrix(m,q);
            var matrixE=createMatrix(1,m);

            var absA=absMatrix(matrixA,operatorLengths[4],n);
            var absB=absMatrix(matrixB,operatorLengths[4],n);
            var AminusB=minusMatrix(absA,absB,m,p,q,operatorLengths[1],n);
            var absAminusB=absMatrix3D(AminusB,operatorLengths[4],n);
            var squareA=squareMatrix(matrixA,operatorLengths[3],n);

            var matrixD=calculateD(absAminusB,matrixE,squareA,matrixB,operatorLengths[2],operatorLengths[5],n);

            var matrixC=[];
            for (var i=0;i<p;i++){
                matrixC.push([]);
                for (var j=0;j<q;j++){
                    matrixC[i][j]=Math.round(calculateCElem(i,j,matrixD,operatorLengths[0],n)*1000)/1000;
                }
            }
            Ky = consistentTime/parallelTime;
            temporaryArray.push(Ky);
        }
        kYFromN.push(temporaryArray);
    }
}

function drawFirstChart() {
    var data = new google.visualization.DataTable();
    data.addColumn("number", "n");
    for(var counter = 1; counter <= 30; counter++){
        data.addColumn("number", "r="+counter);
    }
    data.addRows(kYFromN);

    var options = {
        chart: {
            title: 'Коэффициент ускорения Ky',
            subtitle: 'от количества процессорных элементов n'
        },
        width: 1200,
        height: 700
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}*/
