var arrBudgetCurves=[];
function collectCurves()
{
	
	for (var i=0;i<arrItems.length;i++)
	{
		arrBudgetCurves[arrBudgetCurves.length]=new Array('View','ItemNo','ItemName','Money','MinY','MaxY','StopList');
		arrBudgetCurves[arrBudgetCurves.length-1]['View']=1;
		arrBudgetCurves[arrBudgetCurves.length-1]['ItemNo']=arrItems[i]['ITEMNO'];
		arrBudgetCurves[arrBudgetCurves.length-1]['ItemName']=arrItems[i]['ITEMNAME']
		statvars=getDollars2(arrItems[i]['ITEMNO']);
		arrBudgetCurves[arrBudgetCurves.length-1]['MinY']=statvars[0];
		arrBudgetCurves[arrBudgetCurves.length-1]['MaxY']=statvars[1];
		arrBudgetCurves[arrBudgetCurves.length-1]['Money']=statvars[3];
		arrBudgetCurves[arrBudgetCurves.length-1]['StopList']=statvars[2];
	}
	var Maxy=-Infinity;
	var curveList=[];
	for (var i=0;i<arrBudgetCurves.length;i++)
	{	
		if (arrBudgetCurves[i]['Money']>0)
		{
			if (arrBudgetCurves[i]['MaxY']>Maxy)
				Maxy=arrBudgetCurves[i]['MaxY'];
			//addBudgetCurve(pView,pItemNo,pItemName,pMaxY',pStopList);
			curveList.push(arrBudgetCurves[i]['ItemNo']);
		}	
	}	
	addBudgetCurve(1,curveList,Maxy);
	return arrBudgetCurves;
}
/////////////////////////////////////////////////////////
var arrBudgetViews=[];
function addBudgetCurve(pView,pItemList,pMaxY)
{
	arrBudgetViews[arrBudgetViews.length]=new Array('View','ItemList','MaxY')
	arrBudgetViews[arrBudgetViews.length-1]['View']=pView;
	arrBudgetViews[arrBudgetViews.length-1]['ItemList']=pItemList;
	arrBudgetViews[arrBudgetViews.length-1]['MaxY']=pMaxY;
}
/////////////////////////////////////////////////////////////////////////////
function getDollars2(pBudgetItem)
{
	var arr=[4];
	var maxS=-Infinity;
	var minS=Infinity;
	var arrBudgetStops=[];
	var totalDollarsSpent=0;
	foundItem=false;
	for (var i=0;i<arrData.length;i++)//arrData[arrData.length]=new Array('YEAR','BUDGETITEM','BUDGET','SPENT','DIFF');
	{

		if (arrData[i]['BUDGETITEM']==pBudgetItem)
		{
			foundItem=true;
			if(arrData[i]['SPENT']>maxS)
				maxS=arrData[i]['SPENT'];
			if(arrData[i]['SPENT']<minS)
				minS=arrData[i]['SPENT'];
			
			totalDollarsSpent+=arrData[i]['SPENT'];
			arrBudgetStops[arrBudgetStops.length]=new Array('bY','bS');
			arrBudgetStops[arrBudgetStops.length-1]['bY']=arrData[i]['YEAR'];
			arrBudgetStops[arrBudgetStops.length-1]['bS']=arrData[i]['SPENT'];
		}
		
	}
	if(!foundItem)
		{
			arrBudgetStops[arrBudgetStops.length]=new Array('bY','bS');
			arrBudgetStops[arrBudgetStops.length-1]['bY']=arrData[i]['YEAR'];
			arrBudgetStops[arrBudgetStops.length-1]['bS']=0;		
		}
	arr[0]=minS;
	arr[1]=maxS;
	arr[2]=arrBudgetStops;
	arr[3]=totalDollarsSpent;
	return arr;
}
function v_report()
{
	
	var a=collectCurves();
	var lc='<table border=1>';
	var a=arrBudgetViews;
	for (var line =0;line<a.length;line++)
	{
		lc+='<tr>';
		//for (var col=0;col<a[line].length;col++)
			lc+='<th width=10%><input type=button value="All" onclick="showStopList(this.id,-1);"></th>';
			lc+='<th>'+ a[line][1]+'</th>';
		lc+='</tr>';
		lc+='<tr>';
		for (var col=0;col<a[line].length;col++)
		{
			
			if (col==1)
			{ 
				aa=a[line][a[line][col]];//itemList in this view
				lc+='<td colspan=2>'
				//
				lc2='<table border=0>';
				for (var i=0;i<aa.length;i++)
				{
					if(i%3==0)
						lc2+='<tr>'
					//console.log(arrColors[i]['cCode'],i);
					lc2+='<td>';
					lc2+='<input id="b_'+i+'" type=button value="'+ getItemName(aa[i])+'" onclick="showStopList(this.id,'+aa[i]+');">'; 
					lc2+='</td><td id="c_'+i+ '" style="text-align:right;width:40px;background-Color:'+arrColors[i*2%arrColors.length]['cCode']+'">&nbsp;</td>';
					lc2+='<td>|</td>';
					if (i%3==2 || (i==(aa.length-1)))
						lc2+='</tr>'
				}
				lc2+='</table>';
				lc+=lc2;
				lc+='</td>';
			}
			//else
			//	lc+='<td>'+  a[line][a[line][col]]+'</td>';
		}
		lc+='</tr>';	
	}
	lc+='</TABLE><br><hr>';
	document.getElementById('oput').innerHTML=lc;
}
function wrapme(ItemTurn)
{
	var Items=arrBudgetViews[0]['ItemList'].length;	
	showStopList('b_'+ItemTurn,ItemTurn);	
	ItemTurn++;
	if (ItemTurn<Items)
	{	
		setTimeout(wrapme,1000,ItemTurn);
	}
	else
		document.getElementById('bb').addEventListener('click',function(){document.getElementById('bb').innerHTML='';document.getElementById('bb').style.width='0px';});
}
//////////////////////////////////////////////////////////
function showStopList(btnId,curveId)
{
	if (curveId==-1) {wrapme(0,0);return;}
	var ithisButton=btnId.split('_');
	var thisButton=ithisButton[1];
	thisColorCell='c_'+thisButton;
	thisColor=document.getElementById(thisColorCell).style.backgroundColor;
	//var lc='<table border=1>'
	for (var i =0;i<arrBudgetCurves.length;i++)
	{
		
		if (arrBudgetCurves[i]['ItemNo']==curveId)
		{
		//	lc+='<tr><th colspan=2>'+arrBudgetCurves[i]['ItemName'] +'</th>';
			stopList=arrBudgetCurves[i]['StopList'];	
			for (var stopi=stopList.length-1;stopi>=0;stopi--)
			{
				//lc+='<tr>'
				//lc+='<td>'+stopList[stopi]['bY']+'</td><td>'+stopList[stopi]['bS']+'</td>';
				//lc+='</tr>'
				
				y=parseFloat(stopList[stopi]['bS']);
				x=parseFloat(stopList[stopi]['bY']);
				stopId='1@'+curveId+'@'+((stopList.length-1)-stopi)//+'_'+x+'_'+y;
				minX=2017;
				minY=0;
				totalWidth=7;
				totalHeight=12000 ;
				color=thisColor;//'blue';
				left=(((x-minX)/totalWidth)*100);
				ltop=100-(((y-minY)/totalHeight)*100);/// using template to implemtent values 
				
				template='visibility:visible;background-color:C;';
				string2='left:X%;';
				string3='top:Y%;';
				styleString=template.replace(':C',":"+color);
				styleString2=string2.replace(':X',":"+left);
				styleString3=string3.replace(':Y',":"+ltop);
				styleString=styleString+styleString2+styleString3;
				///////////////////////////////////////
				/// add DOM element
				nx=document.createElement('DIV');
				nx.setAttribute("class",'dot');
				nx.setAttribute("id",stopId);
				nx.setAttribute("style",styleString);
				
				nx.addEventListener('mouseover',pointShowB);
				document.getElementById('bb').appendChild(nx);
				
				
			}
		}
	}
	//lc+='</table>';
	//document.getElementById('oput').innerHTML=lc;
	document.getElementById('bb').style.width='98%';
	document.getElementById('bb').style.height='400px';
	document.getElementById('bb').style.top=(document.getElementById('oput').getBoundingClientRect().bottom+40)+'px';
	document.getElementById('bb').style.backgroundColor='lightgrey';
	setTimeout(zjoiner,1210,0,[],10,'bb');
	//document.getElementById('bb').addEventListener('click',function(){console.log('v');document.getElementById('bb').innerHTML='';document.getElementById('bb').style.width='0px';});
}
/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
function pointShowB(e)
{
	//console.log(this.id  ,e.clientX,e.clientY);
	offset=window.scrollY;
	ltop=e.clientY+offset;
	document.getElementById('txtLabel').innerHTML=getPointInfoB(this.id);//;'('+ document.getElementById(this.id).style.left + ',' + document.getElementById(this.id).style.left + ')';
	document.getElementById('txtLabel').style.visibility='visible';
	document.getElementById('txtLabel').style.left=e.clientX+'px';
	document.getElementById('txtLabel').style.top=ltop+'px';
	document.getElementById('txtLabel').style.transform='translateY(-20px) translateX(-20px)';
	setTimeout(noShow,2000,document.getElementById('txtLabel').style.top)
}
/////////////////////////////////////////////////////////////
function noShow2(y)
{
	if (y==document.getElementById('txtLabel').style.top)
	{
		document.getElementById('txtLabel').style.visibility='hidden';
		document.getElementById('txtLabel').innerHTML='';
		document.getElementById('txtLabel').style.left='0px';
		document.getElementById('txtLabel').style.top='0px';
	}
}
//////////////////////////////
function getPointInfoB(pId)
{//redo
	pInfos=pId.split('@');
	var isource='';
	var ifield='';
	var x='';
	var y='';
	viewId=pInfos[0];
	fieldIdx=pInfos[1];
	pointSequence=pInfos[2];
	ifield=getItemName(fieldIdx);
	for (var i=0;i<arrBudgetCurves.length;i++)
	{
		
		
		if (parseInt(arrBudgetCurves[i]['ItemNo'])==parseInt(fieldIdx))
		{
			//istopList=arrViews[viewIndex]['TrackList'][fieldIdx]['StopList'];
			//console.log('entered');
			aStops=arrBudgetCurves[i]['StopList'];
			x=aStops[pointSequence]['bS'];
			y=aStops[pointSequence]['bY'];
			break;
		}	
	}
	return ifield +'<br>' + '(' + x + ','+ y + ')';
}
//////////////////////////////////////////