
///////////////////////////////////////////////////////////////////////////
function trak_add(pView,pSource,pField)
{
	//arrTrax=new Array('ViewId','TrackId', 'FieldId','Field','Source','Avatar','Legend','StopList','minX','maxX','minY','maxY','ampX','ampY');
	
	
	var FieldList=select_fields(pField);
	
	for (var i =0;i<arrViews.length;i++)
	{
		if (arrViews[i]['ViewId']==pView)
		{
			
			View_Index=i;
			break;
		}
	}
	var minX=Infinity;
	var minY=Infinity;
	var maxX=-Infinity;
	var maxY=-Infinity;
	for (var iField=0;iField<FieldList.length;iField++)
	{
		arrTrax=new Array('ViewId','TrackId', 'FieldId','Field','Source','Avatar','Legend','StopList','minX','maxX','minY','maxY','ampX','ampY');
		
		arrTrax['ViewId']=pView;
		arrTrax['FieldId']=arrViews[View_Index]['TrackList'].length;
		arrTrax['Field']=FieldList[iField]['f'];
		//console.log('addding to track-list this field : '+ FieldList[iField]['f'])
		arrTrax['Source']=pSource;
		arrTrax['Avatar']=arrColors[getRndInt()]['cName'];
		arrTrax['Legend']=FieldList[iField]['l'];
		
		
		
		trakInfos=trak_getStopList(View_Index,arrTrax['FieldId'],arrTrax['Field'],pSource);//pList[i]['l'];
			//	getStopList(pView,View_Index,pSource,FieldIndex,pField)
		
		arrTrax['StopList']=trakInfos[1];		
				
		arrTrax['minX']=trakInfos[0][0];
		arrTrax['maxX']=trakInfos[0][2];
		arrTrax['minY']=trakInfos[0][1];
		arrTrax['maxY']=trakInfos[0][3];
	//	console.log(arrTrax['Field'],trakInfos[0][3]);

		
		//test for change?
		if (parseInt(arrTrax['minX'])<minX) minX=arrTrax['minX']; 
		if (parseInt(arrTrax['maxX'])>maxX) maxX=arrTrax['maxX']; 
		console.log('Field:'+arrTrax['Field'] + ' MaxY;'+ trakInfos[0][3] + '<- minY:'+ minY + '<- and maxY compares to records '+arrTrax['maxY'] + '<-');
		if (parseInt(arrTrax['minY'])<minY) 
		{
			console.log("Change MinY from " + minY + ' to ' + arrTrax['minY']);
			minY=arrTrax['minY']; 
		}
			
		if (parseInt(arrTrax['maxY'])>maxY) maxY=arrTrax['maxY'];
		{
			console.log("Change MinY from " + minY + ' to ' + arrTrax['minY']);
			maxY=arrTrax['maxY']; 
		}
		arrTrax['minX']=minX;
		arrTrax['minY']=minY;
		arrTrax['maxX']=maxX;
		arrTrax['maxY']=maxY;
		arrTrax['ampX']=(maxX-minX);
		arrTrax['ampY']=(maxY-minY);
		view_UpdateProperties (pView,minX,minY,maxX,maxY);

		arrViews[View_Index]['TrackList'].push(arrTrax);
	}
}
////////////////////////////////////////////////////////
function view_UpdateProperties2(pView)
{
var minX=Infinity;
	var minY=Infinity;
	var maxX=-Infinity;
	var maxY=-Infinity;
		
		var trakList=arrViews[pView]['TrackList'];
		for (var i=0;i<trakList.length;i++)
		{
			if (parseFloat(trakList[i]['minX'])<minX) minX=trakList[i]['minX']; 
			if (parseFloat(trakList[i]['maxX'])>maxX) maxX=trakList[i]['maxX']; 
			if (parseFloat(trakList[i]['minY'])<minY) minY=trakList[i]['minY']; 
			if (parseFloat(trakList[i]['maxY'])>maxY) maxY=trakList[i]['maxY'];
		}
		arrViews[pView]['minX']=minX;
		arrViews[pView]['maxX']=maxX;
		arrViews[pView]['minY']=minY;
		arrViews[pView]['maxY']=maxY;
		arrViews[pView]['ampX']=maxX-minX;
		arrViews[pView]['ampY']=maxY-minY;
}
//////////////////////////////////////////////////////////////////////////////////////
function trak_getStopList(View_Index,pFieldIndex,pField,pSource)
{
	//fix here nov12
	var minX=Infinity;
	var minY=Infinity;
	var maxX=-Infinity;
	var maxY=-Infinity;
	var arrStops=[];
	for (var i = 0;i<arrPlans.length;i++)
	{
	//	console.log(arrPlans[i]['P_NAME'] + 'vs ' + pSeriesId);
		if (arrPlans[i]['P_NAME']==pSource)
		{
			
		xValue=arrPlans[i]['YEAR'];
		yValue=arrPlans[i][pField];
	
		if (parseFloat(xValue)<minX) minX=xValue; 
		if (parseFloat(xValue)>maxX) maxX=xValue; 
		if (parseFloat(yValue)<minY) minY=yValue; 
		if (parseFloat(yValue)>maxY) maxY=yValue;
		sId=pSource+'@'+pField+'@'+i;
		sId=View_Index+'@'+pFieldIndex+'@'+i;
			
		arrStops[arrStops.length]=new Array('StopId','xVal','yVal','Label');
		arrStops[arrStops.length-1]['StopId']=sId;
		arrStops[arrStops.length-1]['xVal']=xValue;
		arrStops[arrStops.length-1]['yVal']=yValue;
		arrStops[arrStops.length-1]['Label']='';
		}
	}
	
	return [[minX,minY,maxX,maxY],arrStops];
}
//////////////////////////////////////////////
function view_new()
{
	arrViews[arrViews.length]=new Array('ViewId','ViewTitle','TrackList','minX','maxX','minY','maxY','ampX','ampY');
	var vId=(arrViews.length-1);
	arrViews[arrViews.length-1]['ViewId']=vId;
	arrViews[arrViews.length-1]['ViewTitle']='View ' + vId;
	arrViews[arrViews.length-1]['TrackList']=[];
	arrViews[arrViews.length-1]['minX']=Infinity;
	arrViews[arrViews.length-1]['maxX']=-Infinity;
	arrViews[arrViews.length-1]['minY']=Infinity;
	arrViews[arrViews.length-1]['maxY']=-Infinity;
	arrViews[arrViews.length-1]['ampX']=1
	arrViews[arrViews.length-1]['ampY']=1;
	return vId;
}
///////////////////////////////////////////////////////
function view_UpdateProperties(pView,pMinX,pMinY,pMaxX,pMaxY)
{
	if (pMinX<arrViews[pView]['minX'])arrViews[pView]['minX']=pMinX;
	if (pMaxX>arrViews[pView]['maxX'])arrViews[pView]['maxX']=pMaxX;
	if (pMinY<arrViews[pView]['minY'])arrViews[pView]['minY'] =pMinY;
	if (pMaxY>arrViews[pView]['maxY'])arrViews[pView]['maxY'] =pMaxY;
	arrViews[pView]['ampY']=(arrViews[pView]['maxY']-arrViews[pView]['minY']);
	arrViews[pView]['ampX']=(arrViews[pView]['maxX']-arrViews[pView]['minX']);
}
///////////////////////////////////////////////////////
function view_create()
{
	var series=[];var sources=[];
	var viewId=view_new();
	document.getElementById('wk').innerHTML='';
	var lstSeriesSelected=document.getElementsByClassName('s_S'); // all field checkboxes
	var  lstFieldsSelected=document.getElementsByClassName('f_S'); // all field checkboxes=[];
	for (var i=0;i< lstFieldsSelected.length;i++)
	{
		fieldId=lstFieldsSelected[i].id;
		if (document.getElementById(fieldId).checked)
			series.push(fieldId.substring(4));
	}
	for (var iSelect=0;iSelect<lstSeriesSelected.length;iSelect++)
	{
		sS_id=lstSeriesSelected[iSelect].id;
		if (document.getElementById(sS_id).checked)
			sources.push(sS_id.substring(4));
	}
	for (var i=0;i<series.length;i++)
	{
		for (var j=0;j<sources.length;j++)
		{
			trak_add(viewId,sources[j],series[i]);
		}
	}
		//values=qualifyPreTrip(sS_id.substring(4));
return viewId;
	
}

//////////////////////////////////////////////////////////////////////////////////
function view_draw(pViewIndex,pMode,pContainer='bb')
{
	 // pMode : [Minus 1 =all, x=specific curve index x]
	/*document.getElementById(pContainer).style.top='0px';
	document.getElementById(pContainer).style.left='0px';
	document.getElementById(pContainer).style.height='10%';
	document.getElementById(pContainer).style.width='10%';
	
	*/
	document.getElementById(pContainer).style.backgroundColor='lightgrey';
	if (pMode==-1) document.getElementById(pContainer).innerHTML='';
	stop_draw(0,0,pViewIndex,pMode,pContainer);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function stop_draw(StopIndex,TrackIndex,ViewIndex,pMode,pContainer='bb')
{
	//p++;
	if (pMode>=0)if (TrackIndex==0 && StopIndex==0) TrackIndex=pMode;
	StopList_Values=arrViews[ViewIndex]['TrackList'][TrackIndex]['StopList'][StopIndex];
	
	stopId=StopList_Values['StopId'];
	/// positioning values
	x=parseFloat(StopList_Values['xVal']);
	y=parseFloat(StopList_Values['yVal']);
	minX=parseFloat(arrViews[ViewIndex]['minX']);//[minX,ampX,minY,ampY,color,legend]
	minY=parseFloat(arrViews[ViewIndex]['minY']);
	totalWidth=arrViews[ViewIndex]['ampX'];
	totalHeight=arrViews[ViewIndex]['ampY'];
	console.log(totalWidth,totalHeight);
	color=arrViews[ViewIndex]['TrackList'][TrackIndex]['Avatar'];
	left=(((x-minX)/totalWidth)*100);
	ltop=100-(((y-minY)/totalHeight)*100);
	if (ltop<0)
		console.log(StopIndex,TrackIndex,ltop,y,minY,totalHeight);
	
	modifiers=getModifier(left,ltop);
	if(modifiers) //i checked whether dot overlaps 
				//with another stop from another track on same graph
		{
			//console.log(left,ltop);
			ltop+=.51;
			left-=.51;
		}

	/// using template to implemtent values 
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
	nx.addEventListener('mouseover',pointShow);
	document.getElementById(pContainer).appendChild(nx);
	if (StopIndex<arrViews[ViewIndex]['TrackList'][TrackIndex]['StopList'].length-1)
	{
		StopIndex++;
		setTimeout(stop_draw,10,StopIndex,TrackIndex,ViewIndex,pMode,pContainer)
	}
	else //was the last stop on track
	{
		if (TrackIndex<arrViews[ViewIndex]['TrackList'].length-1)
		{
				StopIndex=0;
				
				if (pMode==-1)
				{	TrackIndex++;
					setTimeout(stop_draw,10,StopIndex,TrackIndex,ViewIndex,pMode,pContainer);
				}
				else
				{
					//only one track
					document.getElementById(pContainer).style.top=(document.getElementById('oput').getBoundingClientRect().bottom+20)+'px';
					document.getElementById(pContainer).style.left='20px';
					document.getElementById(pContainer).style.width='90%';
					document.getElementById(pContainer).style.height='90%';
					setTimeout(view_Legends,1000,ViewIndex,TrackIndex,pContainer);
					setTimeout(zjoiner,1000,0,[],pContainer);
					
				}
		}
		else
		{
			//done
			document.getElementById(pContainer).style.top=(document.getElementById('oput').getBoundingClientRect().bottom+20)+'px';
			document.getElementById(pContainer).style.left='20px';
			document.getElementById(pContainer).style.width='90%';
			document.getElementById(pContainer).style.height='90%';
			setTimeout(view_Legends,1000,ViewIndex,-1,pContainer);
			setTimeout(view_Scales,1100,ViewIndex,pContainer);
			setTimeout(zjoiner,1100,0,[],10,pContainer);
		}
	}
	
}
////////////////////
function getModifier(pleft,ptop)
{
	var found=false;
	var lstDots=document.getElementsByClassName('dot');
	for (var i =0;i<lstDots.length;i++)
	{
		id=lstDots[i].id;
		dleft=parseFloat(document.getElementById(id).style.left.substring(0,document.getElementById(id).style.left.length-1));
		dtop=parseFloat(document.getElementById(id).style.top.substring(0,document.getElementById(id).style.top.length-1));
		diffleft=dleft-pleft;
		if(diffleft<0)diffleft=diffleft*-1;
		difftop=dtop-ptop;
		if(difftop<0)difftop=difftop*-1;
		if (diffleft<1.4 && difftop <1.5)
		{
			found=true;
			break;
		}
	}
	return found;
}
//////////////////////////////////////////////////////////////////////////////////////
function view_Legends(pViewIndex,pTrackIndex,pContainer)
{
	
	var TrackList=arrViews[pViewIndex]['TrackList'];
	var lc='<table width=100%>';
	for (Track=0;Track<TrackList.length;Track++)
	{
		if (pTrackIndex==-1||pTrackIndex==Track)
		{
			Avatar=TrackList[Track]['Avatar'];
			Source=TrackList[Track]['Source'];
			Legend=TrackList[Track]['Legend'];
			lc+='<tr><td style="width:80%" >'+Legend+ ' ' + Source +'</td><td style="background-color:'+Avatar+';width:20%;"></td></tr>';
		}
	}
	lc+='</table>';
	var x=document.createElement('DIV');
	x.setAttribute("class","legendbox");
	x.setAttribute("id","legendbox");
	x.addEventListener("click",bye);
	x.innerHTML=lc;
	document.getElementById(pContainer).appendChild(x);
	//setTimeout(legendW,10,lc);			
}
/////////////////////////////////////////////////////////////////////
function bye(e)
{
	document.getElementById('bb').innerHTML='';
	setTimeout(function(){document.getElementById('bb').style.width='0';document.getElementById('bb').style.border='0px solid white';},12);
}
///////////////////////////////////////////////////////////
 function legendW(p)
 {
	 document.getElementById('legendbox').innerHTML=p;
 }	
 //////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////
/*function trak_getProperties(pView,pTrak)
{
	
	var minX=arrViews[pView]['TrackList'][pTrak]['minX'];
	var minY=arrViews[pView]['TrackList'][pTrak]['minY'];
	var maxX=arrViews[pView]['TrackList'][pTrak]['maxX'];
	var maxY=arrViews[pView]['TrackList'][pTrak]['maxY'];
	var ampx=maxX-minX;
	var ampy=maxY-minY;
//lc+='<tr><td>MinX</td><td>MinY</td><td>MaxX</td><td>>MaxY</td><td>Amp X</td><td>Amp Y</td></tr>';
	var lc='<tr><td>'+minX+'</td><td>'+ minY+'</td><td>'+ maxX+'</td><td>'+ maxY+'</td><td>'+ ampx+'</td><td>'+ ampy+'</td></tr>';
	return lc;
}
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
function view_Scales(pViewIndex,pContainer)
{
	var stops=arrViews[pViewIndex]['TrackList'][0]['StopList'].length-1; //assumes all trax have same number of stops, which they do at this point
	var minX=arrViews[pViewIndex]['minX'];
	var maxX=arrViews[pViewIndex]['maxX'];
	var minY=arrViews[pViewIndex]['minY'];
	var maxY=arrViews[pViewIndex]['maxY'];
	var increments =100/stops;
	for (var x=0;x<=stops;x++)
	{
		myLeft=(x*increments)+'%';
		//console.log(myLeft);
		myLabel=document.createElement("DIV");
		myLabel.setAttribute("class","XScaleLabel");
		myLabel.setAttribute("style","left:"+myLeft+";top:100%;");
		myLabel.innerHTML=minX+(x);
		document.getElementById(pContainer).appendChild(myLabel);
	}
	increments2 =(maxY-minY)/stops;
	for (var x=0;x<=stops;x++)
	{
		
		if (x%3==0)
		{
		myTop=100-(x*increments)+'%';
		myLabel=document.createElement("DIV");
		myLabel.setAttribute("class","YScaleLabel");
		myLabel.setAttribute("style","left:-40px;top:"+myTop+";");
		labelvalue=(minY+(increments2*x));
		if (parseInt(labelvalue)>100)
			labelvalue=parseInt(labelvalue);
		else
			labelvalue=labelvalue.toFixed(2);
		myLabel.innerHTML=labelvalue;
		document.getElementById(pContainer).appendChild(myLabel);
		}
	}
	document.getElementById(pContainer).style.border='40px solid white'
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function zjoiner(ii,joined,speed,pContainer)
{
	NoDot1=false;
	NoDot2=false;
	var allDone=false;
	//console.log(pContainer);
	var lst=document.getElementsByClassName('dot');
	if (ii==0)
	{
		Dot1=lst[0].id;
		joined=[];
	}
	else
	{
		if(ii<lst.length)
			Dot1=lst[ii].id;
		else
			NoDot1=true;
	}

	if(!(document.getElementById(Dot1)))
	{
		NoDot1=true;
	}
	DotInfo=Dot1.split('@');
	DotView=DotInfo[0];
	DotTrak=DotInfo[1];
	DotStop=DotInfo[2];
	NextStop=parseInt(DotStop)+1;
	Dot2=DotView+'@'+DotTrak+'@'+NextStop;
	//console.log(Dot2);
	if(!(document.getElementById(Dot2)))
		NoDot2=true;
	if((!NoDot1)&&(!NoDot2))
	{
		join2(Dot1,Dot2,pContainer);
		joined.push(Dot1,Dot2);
	}
	ii++;
	if(ii<lst.length)
		setTimeout(zjoiner,speed,ii,joined,speed,pContainer);
	else
		positionWk();
}
///////////////////////////////////////////
function join2(Dot1,dot2,pContainer)
{
	//console.log(pContainer);
	x2=(document.getElementById(Dot2).getBoundingClientRect().left);
	y2=(document.getElementById(Dot2).getBoundingClientRect().top);
	x1=(document.getElementById(Dot1).getBoundingClientRect().left);
	y1=(document.getElementById(Dot1).getBoundingClientRect().top);
	x2s=(document.getElementById(Dot2).style.left);
	y2s=(document.getElementById(Dot2).style.top);
	x1s=(document.getElementById(Dot1).style.left);
	y1s=(document.getElementById(Dot1).style.top);
	h=	Math.pow((Math.pow((x2-x1),2)+Math.pow((y2-y1),2)),.5);
	slope=-90+Math.atan((y2-y1) /(x2-x1)) * 180/Math.PI;
	color=document.getElementById(Dot2).style.backgroundColor;
	nx=document.createElement('DIV');
	nx.setAttribute("class",'joiner');
	nx.setAttribute("id",'joiner!' + Dot1+'!'+Dot2);
	nx.setAttribute("style",'background-color:'+color+';left:'+x1s+';top:'+y1s+';height:'+h.toFixed(2)+'px;transform:translateX(-2px) rotateZ('+(slope.toFixed(2))+'deg);');
	document.getElementById(pContainer).appendChild(nx);
}
////////////////////////////////////////////////

/////////////////
function see()
{
	
	document.getElementById('wk').style.top='500px';
	document.getElementById('wk').style.left='20px';
	document.getElementById('wk').style.width='80%';
	document.getElementById('wk').style.height='80%';
}
///////////////////////////////////
/*
function pointList(pView,pTrak)
{
	var lc='<table>';
	for (var i =0;i<arrViews[pView]['TrackList'][pTrak]['StopList'].length;i++)
	{
		vals=arrViews[pView]['TrackList'][pTrak]['StopList'][i];
		x=vals['xVal'];
		y=vals['yVal'];
		pId=vals['StopId'];
		lc+='<tr><td>'+pId+'</td><td>'+x+'</td><td>'+y+'</td></tr>';
	}
	lc+='</table>';
	return lc;
}
///////////////////////////////////////////////////////
*/
///////////////////////////////////////////////////////
function pointShow(e)
{
	console.log(this.id  ,e.clientX,e.clientY);
	offset=window.scrollY;
	ltop=e.clientY+offset;
	document.getElementById('txtLabel').innerHTML=getPointInfo(this.id);//;'('+ document.getElementById(this.id).style.left + ',' + document.getElementById(this.id).style.left + ')';
	document.getElementById('txtLabel').style.visibility='visible';
	document.getElementById('txtLabel').style.left=e.clientX+'px';
	document.getElementById('txtLabel').style.top=ltop+'px';
	document.getElementById('txtLabel').style.transform='translateY(-20px) translateX(-20px)';
	setTimeout(noShow,2000,document.getElementById('txtLabel').style.top)
}
/////////////////////////////////////////////////////////////
function noShow(y)
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
function getPointInfo(pId)
{
	pInfos=pId.split('@');
	var isource='no source';
	var ifield='no field';
	var x='unknown';
	var y='adunno';
	viewId=pInfos[0];
	fieldIdx=pInfos[1];
	pointSequence=pInfos[2];
	console.log('here--->'+pId,viewId,fieldIdx,pointSequence);
	for (var viewIndex=0;viewIndex<arrViews.length;viewIndex++)
	{
		if (parseInt(arrViews[viewIndex]['ViewId'])==parseInt(viewId) && parseInt(arrViews[viewIndex]['TrackList'][fieldIdx]['FieldId'])==parseInt(fieldIdx))
		{
			istopList=arrViews[viewIndex]['TrackList'][fieldIdx]['StopList'];
			x=istopList[pointSequence]['xVal'];
			y=istopList[pointSequence]['yVal'];
			ifield=arrViews[viewIndex]['TrackList'][fieldIdx]['Field'];	
		}	
	}
	return ifield +'<br>' + '(' + x + ','+ y + ')';
}
//////////////////////////////////////////