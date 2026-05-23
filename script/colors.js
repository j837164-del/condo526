var arrColors=[];
function addColor(a,b)
{	arrColors[arrColors.length]=new Array('cName','cCode');
	arrColors[arrColors.length-1]['cName']=a;
	arrColors[arrColors.length-1]['cCode']=b;
}
function getColor(pView)
{
	var InAlready=[];
	var trax=arrViews[pView]['TrackList'];
	for (var t=0;t<trax.length;t++)
		InAlready.push(trax[t]['Avatar']);
	var success=false;var i =0;
	while(!success &&i<1000)
	{
		col=arrColors[getRndInt()]['cName'];
		if (!InAlready.includes(col))
			success=true;
		else
			i++;
	}
	if (!success) col='black';
	return col;	
}
addColor('RosyBrown','#BC8F8F');
addColor('SandyBrown','#F4A460');
addColor('GoldenRod','#DAA520');
addColor('DarkGoldenRod','#B8860B');
addColor('Peru','#CD853F');
addColor('Chocolate','#D2691E');
addColor('Olive','#808000');
addColor('SaddleBrown','#8B4513');
addColor('Sienna','#A0522D');
addColor('Brown','#A52A2A');
addColor('CadetBlue','#5F9EA0');
addColor('SteelBlue','#4682B4');
addColor('LightSteelBlue','#B0C4DE');
addColor('LightBlue','#ADD8E6');
addColor('SkyBlue','#87CEEB');
addColor('CornflowerBlue','#6495ED');
addColor('DeepSkyBlue','#00BFFF');
addColor('DodgerBlue','#1E90FF');
addColor('RoyalBlue','#4169E1');
addColor('Blue','#0000FF');
addColor('MediumBlue','#0000CD');
addColor('Navy','#000080');
addColor('Cyan','#00FFFF');
addColor('PaleGreen','#98FB98');
addColor('SpringGreen','#00FF7F');
addColor('MediumSeaGreen','#3CB371');
addColor('SeaGreen','#2E8B57');
addColor('Green','#008000');
addColor('DarkGreen','#006400');
addColor('YellowGreen','#9ACD32');
addColor('Gold','#FFD700');
addColor('Yellow','#FFFF00');
addColor('IndianRed','#CD5C5C');
addColor('Crimson','#DC143C');
addColor('Red','#FF0000');
addColor('FireBrick','#B22222');
addColor('DarkRed','#8B0000');
addColor('Orange','#FFA500');
addColor('DarkOrange','#FF8C00');
addColor('Tomato','#FF6347');
addColor('OrangeRed','#FF4500');
addColor('Pink','#FFC0CB');
addColor('HotPink','#FF69B4');
addColor('DeepPink','#FF1493');
addColor('PaleVioletRed','#DB7093');
addColor('MediumVioletRed','#C71585');
addColor('Plum','#DDA0DD');
addColor('Orchid','#DA70D6');
addColor('Violet','#EE82EE');
addColor('BlueViolet','#8A2BE2');
addColor('Purple','#800080');
