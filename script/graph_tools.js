function getTrack(pFieldName,pRecipe,ViewIndex)
{
	// returns whether this view has this track ( same recipe/field )
	
	var found=false;
	var thisView=arrViews[ViewIndex];
	for (var trak=0;trak<thisView['TrackList'].length;trak++)
	{
		thisTrak=thisView['TrackList'][trak];
		if (thisTrak['Field']==pFieldName && thisTrak['Source']==pRecipe)
		{
		found=true;
		break;
		}
	}
	return found;
}
////////////////////////////////////////////////////////
function graphProjection()
{
	var View_Index=arrViews.length==0?viewCreate():arrViews[0]['ViewId'];//arrViews.length;
	var curves=0;
	var isAllowed=document.getElementById('chk_NoDecrease').checked?'NO':'YES';
	var recipe='I_'+ document.getElementById('cfr').value+'%|R_'+document.getElementById('dfry').value + '$|'+isAllowed;
	var ltable=document.getElementById('reportTable');
	var lfields=ltable.getElementsByTagName("th");
	for (thisField=0;thisField<lfields.length;thisField++)
	{
		if (lfields[thisField].style.backgroundColor=='yellow')
		{
			curves++;
			if (!getTrack(lfields[thisField].innerText,recipe,View_Index))
				collectCol(thisField,View_Index,recipe);
		}
	}
	if (document.getElementById('MCurves').rows.length>1)
		curves++;
	if (curves==0) alert('select one or more columns for graphic');
	else 
	{
		lcTemp=document.getElementById('bb').innerHTML;
		//document.getElementById('wk').innerHTML=flipperHTML;
		//document.getElementById('flipperF').innerHTML=lcTemp;
		view_draw(View_Index,-1,'bb');
	}
}
///////////////////////////////////////////////////////////////////////////////////
function viewCreate()
{
	var viewId=view_new();
	return viewId;
}
///////////////////////////////////////////////////////////////////////////////////
function selectCol(colIndex)
{
	var isAllowed=document.getElementById('chk_NoDecrease').checked?'NO':'YES';
	var recipe='I_'+ document.getElementById('cfr').value+'%|R_'+document.getElementById('dfry').value + '$|'+isAllowed;
	var ltable=document.getElementById('reportTable');
	var lfields=ltable.getElementsByTagName("th");
	f=lfields[colIndex].innerText;
	if(lfields[colIndex].style.backgroundColor=='yellow')
	{
		lfields[colIndex].style.backgroundColor='initial';
		removeCurve(0,f,recipe);//where currentView=0
		
	}
	else
	{
	
	lfields[colIndex].style.backgroundColor='yellow';
	}
}
///////////////////////////////////////////////////////////////////////////////////
function collectCol(pFieldIndex,View_Index,pRecipe)
{	
	var minX=Infinity;
	var minY=Infinity;
	var maxX=-Infinity;
	var maxY=-Infinity;
	var arrStops=[];
	var stopC=0;
	var TrackIndex=arrViews[View_Index]['TrackList'].length;
	var ltable=document.getElementById('reportTable');
	var lfields=ltable.getElementsByTagName("th");
	f=lfields[pFieldIndex].innerText;
	for ( stop=1;stop<ltable.rows.length;stop++)
	{
		xValue=parseInt(ltable.rows[stop].cells[0].innerText);
		yValue=parseFloat(ltable.rows[stop].cells[pFieldIndex].innerText)
		if (!isNaN(xValue)&&!isNaN(yValue))
		{
			if (parseFloat(xValue)<minX) minX=xValue;
			if (parseFloat(xValue)>maxX) maxX=xValue; 
			if (parseFloat(yValue)<minY) minY=yValue; 
			if (parseFloat(yValue)>maxY) maxY=yValue;
			
			sId=View_Index+'@'+TrackIndex+'@'+stopC;
			stopC++;
			arrStops[arrStops.length]=new Array('StopId','xVal','yVal','Label');
			arrStops[arrStops.length-1]['StopId']=sId;
			arrStops[arrStops.length-1]['xVal']=xValue;
			arrStops[arrStops.length-1]['yVal']=yValue;
			arrStops[arrStops.length-1]['Label']=pRecipe;
		}
	}
	//lfields[p].style.backgroundColor='yellow';
	addCurve(View_Index,f,pFieldIndex,pRecipe,minX,minY,maxX,maxY,arrStops);
}
////////////////////////////////////////////////////////////////////////////////////3
function addCurve(pViewIndex,pColTitle,pColIndex,pRecipe,pMinX,pMinY,pMaxX,pMaxY,pArrStops)
{
	arrTrax=new Array('ViewId','TrackId', 'FieldId','Field','ColRank','Source','Avatar','Legend','StopList','minX','maxX','minY','maxY','ampX','ampY');
	arrTrax['ViewId']=pViewIndex;
	arrTrax['FieldId']=arrViews[pViewIndex]['TrackList'].length;
	arrTrax['ColRank']=pColIndex;
	arrTrax['Field']=pColTitle;
	arrTrax['Source']=pRecipe;
	arrTrax['Avatar']=getColor(pViewIndex);//arrColors[getRndInt()]['cName'];
	arrTrax['Legend']=pColTitle;
	arrTrax['StopList']=pArrStops;				
	arrTrax['minX']=pMinX;
	arrTrax['maxX']=pMaxX;
	arrTrax['minY']=pMinY;
	arrTrax['maxY']=pMaxY;
	arrTrax['ampX']=(pMaxX-pMinX);
	arrTrax['ampY']=(pMaxY-pMinY);
	view_UpdateProperties (pViewIndex,pMinX,pMinY,pMaxX,pMaxY);
	arrViews[pViewIndex]['TrackList'].push(arrTrax);
}
/////////////////////////////////////////////////////////////////////////
function removeCurve(pViewIndex,pField,pRecipe)
{
	if (!arrViews.length) return;
	console.log(pViewIndex,pField,pRecipe);
	var trackList=arrViews[pViewIndex]['TrackList'];
	for (var i=0;i<trackList.length;i++)
	{
		if (trackList[i]['Field']==pField && trackList[i]['Source']==pRecipe)
		{
			arrViews[pViewIndex]['TrackList'].splice(i,1);
			view_UpdateProperties2(pViewIndex);
			console.log('removed thafakar' );
			break;
		}
	}
}
///////////////////////////////////////////////////////////////ddd///
function views_view(pContainer)
{
	//arrViews[arrViews.length]=new Array('ViewId','ViewTitle','TrackList','minX','maxX','minY','maxY','ampX','ampY');
	var lc='';
	var lth='<table border=1><tr>';
	lth+='<th>View #</th>';
	lth+='<th>Title</th>';
	lth+='<th>Trax</th>';
	lth+='<th>minX</th>';
	lth+='<th>maxX</th>';
	lth+='<th>minY</th>';
	lth+='<th>maxY</th>';
	lth+='<th>ampX</th>';
	lth+='<th>ampY</th>';
	lth+='</tr>';
	for (var v=0;v<arrViews.length;v++)
	{
		console.log('view no. ' + v);
		lc+='<tr>';
		lc+='<td>'+v+'</td>';
		lc+='<td>'+arrViews[v]['ViewTitle']+'</td>';
		lc+='<td>'+arrViews[v]['TrackList'].length+'</td>';
		lc+='<td>'+arrViews[v]['minX']+'</td>';
		lc+='<td>'+arrViews[v]['maxX']+'</td>';
		lc+='<td>'+arrViews[v]['minY']+'</td>';
		lc+='<td>'+arrViews[v]['maxY']+'</td>';
		lc+='<td>'+arrViews[v]['ampX']+'</td>';
		lc+='<td>'+arrViews[v]['ampY']+'</td>';
		lc+='</tr>';
		
		lc+='<tr>'
			lc+='<td colspan=9>'
			lc+='<table style="width:100%;border:3px solid blue;">'
			lc+='<tr>';
			lc+='<th>Trak</th>';
			lc+='<th>Field name</th>';
			lc+='<th>Field recipe</th>';
			lc+='<th>Avatar</th>';
			lc+='<th>Stops</th>';
			lc+='<th>minX</th>';
			lc+='<th>maxX</th>';
			lc+='<th>minY</th>';
			lc+='<th>maxY</th>';
			lc+='<th>ampX</th>';
			lc+='<th>ampY</th>';
			lc+='</tr>';
		for (var t=0;t<arrViews[v]['TrackList'].length;t++)
		{
			
			trak=arrViews[v]['TrackList'][t];
			console.log('view no. ' + v + '  trak no' + t + ' --> ' + trak.length);
			lc+='<tr>';
			lc+='<td>'+t+'</td>';
			lc+='<td>'+trak['Field']+'</td>';
			lc+='<td>'+trak['Source']+'</td>';
			lc+='<td>'+trak['Avatar']+'</td>';
			lc+='<td>'+trak['StopList'].length+'</td>';
			lc+='<td>'+trak['minX']+'</td>';
			lc+='<td>'+trak['maxX']+'</td>';
			lc+='<td>'+trak['minY']+'</td>';
			lc+='<td>'+trak['maxY']+'</td>';
			lc+='<td>'+trak['ampX']+'</td>';
			lc+='<td>'+trak['ampY']+'</td>';
			lc+='</tr>';
		}
		lc+='</table>';//end table trak[t]
		lc+='</td>'
		lc+='</tr>';
	}
	lc+='</table>';
	lc=lth+lc;
	document.getElementById(pContainer).innerHTML=lc;
	//setTimeout(view_Legends,1000,ViewIndex,TrackIndex,pContainer);
	
}
////////////////////////////////////////////////////////////////////////////////////
function populateViewMembers(pView=0)
{
	//list all tracks from View , light up columns when current recipe
	if (arrViews.length==0) return;
	var myTrax=arrViews[pView]['TrackList'];
	var CurrentInflationDisplay=document.getElementById('cfr').value+'%';
	var CurrentReserveDisplay=document.getElementById('dfry').value+'$';
	var CurrentDecreaseAllow=document.getElementById('chk_NoDecrease').checked?'NO':'YES';
	var ltable=document.getElementById('reportTable');
	var lfields=ltable.getElementsByTagName("th");
	
	for (var trak=0;trak<myTrax.length;trak++)
	{
		trakRecipe=myTrax[trak]['Source'];
		console.log(trakRecipe);
		recipeValues=trakRecipe.split('|');
		inflation=recipeValues[0].split('_');
		reserve=recipeValues[1].split('_');
		noDecrease=recipeValues[2];
		inflationValue=inflation[1];
		reserveValue=reserve[1];
		fieldIndex=myTrax[trak]['ColRank'];
		console.log(inflationValue+' vs '+CurrentInflationDisplay +' and '+reserveValue+' vs  '+CurrentReserveDisplay)
		if (inflationValue==CurrentInflationDisplay && reserveValue==CurrentReserveDisplay  && noDecrease==CurrentDecreaseAllow)
			lfields[fieldIndex].style.backgroundColor='yellow';
		else
		{
			ltable=document.getElementById('MCurves');
			 r=ltable.insertRow(ltable.rows.length);
			 c1=r.insertCell(0);
			 c2=r.insertCell(1);
			 c3=r.insertCell(2);
			 c4=r.insertCell(3);
			c2.innerHTML=inflationValue;
			c3.innerHTML=reserveValue;
			c4.innerHTML=noDecrease;
			c1.innerHTML=myTrax[trak]['Field'];
		}
	}
	r=ltable.insertRow(0);
	 c1=r.insertCell(0);
	 c2=r.insertCell(1);
	 c3=r.insertCell(2);
	 c4=r.insertCell(3);
	 c2.innerHTML='Inflation';
	c3.innerHTML='Reserve Xtra';
	c4.innerHTML='Allow decrease?';
	c1.innerHTML='Field';
}
///////////////////////////////////////////////////////////////////////////////////