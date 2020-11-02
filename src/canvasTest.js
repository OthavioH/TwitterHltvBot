const canvas = document.getElementById('canvas-container')
const ctx = canvas.getContext('2d');

var killerSide='TR';
var killedSide='CT';
var killerNameColor;
var killedNameColor;
start('de_mirage');
var previousY=25;

function start(mapName){
    let image = new Image()
    image.src = `${mapName}.jpg`
    image.onload = () => {
        ctx.drawImage(image, 0,0, 1920, 1080);
        for(var i = 0;i<=12;i++){
            killerNameColor = verifyKillerSide();
            killedNameColor = verifyKilledSide();
            console.log(killerNameColor);
            ctx.beginPath();
            ctx.rect(425, previousY, 1200, 50)
            ctx.quadraticCurveTo(425,previousY,1200,50);
            ctx.lineWidth =10;
            ctx.strokeStyle = 'rgba(191, 0, 0,0.8)';
            ctx.strokeRect(425,previousY,1200,50);
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.fill()
            ctx.closePath();
            ctx.beginPath();
            ctx.font = '25px Impact';
            ctx.fillStyle = 'rgba(255,255,255,1)'
            ctx.fillText(`                                       planted the bomb`,600,previousY+35);
            ctx.closePath();
            //Set Killer Side and color
            ctx.beginPath();
            ctx.font = '25px Impact';
            ctx.fillStyle = killerNameColor;
            ctx.fillText('Coldzerafodase123456',440,previousY+35);
            ctx.closePath();
            ctx.beginPath();
            ctx.font = '25px Impact';
            ctx.fillStyle = killedNameColor;
            ctx.fillText('Tacozerafodase123456',910,previousY+35);
            ctx.closePath();

            previousY = previousY + 80;
        }

    }
}

function verifyKillerSide(){
    if(killerSide == "TR"){
        return 'rgba(255, 157, 38,0.8)';
    }
    else if(killerSide == "CT"){
        return 'rgba(38, 121, 255,0.8)';
    }
}

function verifyKilledSide(){
    if(killedSide == "TR"){
        return 'rgba(255, 157, 38,0.8)';
    }
    else if(killedSide == "CT"){
        return 'rgba(38, 121, 255,0.8)';
    }
}