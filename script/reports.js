//////////////////////////////////////////////////////////
function aaaa_READ_ME()
{
	// THE underscore=>>> _FUNCTIONS  are there to supply the function call with args
}
function _budgetItemsList()
{budgetItemsList()}
//////////////////////////////////////////////////////////
function budgetItemsList(pMode=0)
{
	noSubMenu();
var lc='<table width=90% bordercolor=blue align=left style="border-spacing:10px;" >';
var maxTotal=0;
lc+='<tr>';
lc+='<td width=10% height="50px">'+reportOption()+'</td>';		
//lc+='<td width=90% style="font-family:Arial;font-size:1.2em;text-align:center;">';

if (pMode==1)
{
	lc+='<td width=90%><table border=1 bordercolor=red width=100%>';
	lc+='<tr>';
	for (var i=2024;i>2016;i--)
		lc+='<td class="btnY" id="btnY_'+i+'" onclick="setBarsPerYear('+i+');">'+i+'</td>';
	lc+='</tr><tr>';
	lc+='<td colspan=8 style="font-family:Arial;font-size:1.2em;text-align:center;" id="graphMessage"></td></table></td>';
}
else
{
	lc+='<td width=90% style="font-family:Arial;font-size:1.2em;text-align:center;">';	
	lc+='Amounts spent overall  (2017-2024).<BR> Bars length are proportional to the total sum alloted for the item </td>';
}
lc+='</tr>';

for (i=0;i<arrItems.length;i++)
{
	TotalSumSpent=getTotalDollars(2017,2024,arrItems[i]['ITEMNO'],'S');
	if(parseFloat(TotalSumSpent)>maxTotal)
		maxTotal=parseFloat(TotalSumSpent);
	//SpentThisYear=getDollars(iYear,'S',arrItems[i]['ITEMNO']);
	lc+='<tr>';
	lc+='<td width=10% style="border:1px solid black;height:20px;font-weight:bold;"><input id="g_'+arrItems[i]['ITEMNO']+'" type=hidden value="'+TotalSumSpent.toFixed(2)+'">'+arrItems[i]['ITEMNAME']+'</td>';
	lc+='<td width=90% ID="item_'+arrItems[i]['ITEMNO']+'">'+getBarDiv(parseInt(TotalSumSpent),arrItems[i]['ITEMNO'],'DodgerBlue')+'</td>';
	lc+='</tr>';
}
lc+='</table>';//
if(pMode==0)
	setTimeout(setBars,500,maxTotal);
if(pMode==1)
	setTimeout(setBarsPerYear,500,2024);

document.getElementById('wk').innerHTML=lc;
positionWk();

}
//////////////////////////////////////////////////////////
function getBarDiv(w,containerId,pColor)
{
	lc='<span id="label_'+containerId+'">'+w+'</span><div class="bar" id="bar_'+containerId+'" style=""></div>'
	return lc;
}
//////////////////////////////////////////////////////////
function setBars(pMax)
{
	var totalw=document.getElementById('item_0').getBoundingClientRect().width-50;
	var wunit=totalw/pMax;
	var lstBars=document.getElementsByClassName('bar');
	for (var i=0;i<lstBars.length;i++)
		
	{	w=document.getElementById('g_'+i).value;
		wStyle=(w*wunit)/totalw*100;
		document.getElementById(lstBars[i].id).style.width=wStyle+'%';
	}
}
/////////////////////////////////////////////////////////////////////
function reportOption()
{
	var lc='<table><tr><td style="border:2px solid black;background-color:lightgrey;border-radius:10px;pading:5px;"  onclick="budgetItemsList(0);">Global view</td>';
	lc+='<td style="border:2px solid black;background-color:lightgrey;border-radius:10px;pading:5px;" onclick="budgetItemsList(1);">Yearly view</td></tr></table>';
	return lc;
}
/////////////////////////////////////////////////////////////////////
function setBarsPerYear(pYear)
{
	var totalw=document.getElementById('item_0').getBoundingClientRect().width-50;
	var lstBars=document.getElementsByClassName('bar');
	var maxV=0;
	for (var i=0;i<lstBars.length;i++) //get max
	{
		ItemIdA=lstBars[i].id.split("_");
		ItemId=ItemIdA[1];
		w=getDollars(pYear,'S',ItemId);
		if (parseFloat(w)>maxV)maxV=w;
	}
	wunit=(totalw/maxV);
	for (var i=0;i<lstBars.length;i++)
	{
		ItemIdA=lstBars[i].id.split("_");
		ItemId=ItemIdA[1];
		w=getDollars(pYear,'S',ItemId);
		wStyle=(w*wunit)/totalw*100;
		document.getElementById(lstBars[i].id).style.width=wStyle+'%';
		document.getElementById(lstBars[i].id).style.backgroundColor='red';
		document.getElementById('label_'+ItemId).innerHTML=w;
	}
	for (var i =2017;i<2025;i++)
	{
		if (i==parseInt(pYear))
			document.getElementById('btnY_'+i).style.backgroundColor='aqua';
		else
			document.getElementById('btnY_'+i).style.backgroundColor='lightgrey';
	}
	document.getElementById('graphMessage').innerHTML='Showing ' + pYear+ '. Bars length are proportional to the total expenses for the year';
}
/////////////////////////
function _assetsReport()
{assetsReport()}
//////////////////////
function assetsReport()
{
	noSubMenu();
	var lc='<table id=id="reportTable" border=1>';
	var d=new Date();
	var Iupdated=new Date(getDatasetLastUpdate('arrAssets'));
	updated=(Iupdated.getMonth()+1)+'/'+Iupdated.getDate()+'/'+Iupdated.getFullYear();
	updateNowButton='<input type=button value="update" style="margin-left:10px;color:blue;font-size:1.2em;" onclick="exportAssets();">';
	lc+='<tr><th width=100% style="background-color:lightgrey;" colspan=10 align=left>Last updated :' + updated + updateNowButton+'</th></tr>'
	lc+='<tr><th width=8%>YEAR</th>';
	lc+='<th width=11%>OPERATING <br>ACCNT</th>';
	lc+='<th width=11%>Reserve<br> Accnt</th>';
	lc+='<th width=11%>GIC</th>';
	lc+='<TH width=11%>Total Actual Assets<br>(Reserve Fund)</TH>';
	lc+='<TH width=11%>Total Assets</TH><th>Recommended<br> Reserve Fund Balance<br>(EOY)</th>';
	lc+='<th width=11%>Recommended <br>Contribution</th>';
	lc+='<th width=11%>Planned expenses</th>';
	lc+='<th width=11%>Actual contribution</th></tr>';
	 for (i=0;i<arrAssets.length;i++)
	 {	 
		
		if (arrAssets[i]['RA']!=-1 && arrAssets[i]['GIC']!=-1)
		{
			console.log(arrAssets[i]['YEAR'],arrAssets[i]['RA'],arrAssets[i]['GIC']);
			totalReserve=parseFloat(arrAssets[i]['RA'])+parseFloat(arrAssets[i]['GIC']);
		}
		else
			totalReserve=0;
		if (arrAssets[i]['YEAR']==d.getFullYear())
		{	
			lc+='<tr style="background-color:PaleGreen;">';
			lc+='<td>'+arrAssets[i]['YEAR']+'</td>';
			lc+='<td  align=right><input type=text size=3 onchange="UpdateAsset(this.id);" id="'+arrAssets[i]['YEAR']+'_OPA" style="text-align:right;"  value="'+arrAssets[i]['OPA']+'"></td>';
			lc+='<td align=right><input type=text  size=3onchange="UpdateAsset(this.id);"  id="'+arrAssets[i]['YEAR']+'_RA" style="text-align:right;" value="'+arrAssets[i]['RA']+'"></td>';
			lc+='<td align=right><input type=text  size=3 onchange="UpdateAsset(this.id);" id="'+arrAssets[i]['YEAR']+'_GIC" style="text-align:right;" value="'+arrAssets[i]['GIC']+'"></td>';
		}
		else
		{
			if(arrAssets[i]['OPA']!=-1) OPA=arrAssets[i]['OPA'];else OPA=' - ';
			if(arrAssets[i]['RA']!=-1) RA=arrAssets[i]['RA'];else RA=' - ';
			if(arrAssets[i]['GIC']!=-1) GIC=arrAssets[i]['OPA'];else GIC=' - ';
		lc+='<tr>';
		lc+='<td>'+arrAssets[i]['YEAR']+'</td>';
		lc+='<td align=right>'+OPA+'</td>';
		lc+='<td align=right>'+	RA+'</td>';
		lc+='<td align=right>'+GIC+'</td>';
		}
		lc+='<td align=right style="font-weight:bold;">'+	totalReserve +'</td>'; //gic+ra
		lc+='<td align=right style="font-weight:bold;">'+	(totalReserve+parseFloat(arrAssets[i]['OPA'])) +'</td>'; //gic+ra+opa
		
		lc+='<td align=right>'+	getReserveRecommendedValue(arrAssets[i]['YEAR'],'EOY_REQUIRED_BAL')+'</td>';
		lc+='<td align=right>'+	getReserveRecommendedValue(arrAssets[i]['YEAR'],'RECOM_CONTRIB')+'</td>';
		lc+='<td align=right align=right >'+	getReserveRecommendedValue(arrAssets[i]['YEAR'],'EXPENSES')+'</td>';
		lc+='<td >'	+getReserveRecommendedValue(arrAssets[i]['YEAR'],'ActualContribution')+'</td>'
		lc+='</tr>';
	 }
	 lc+='</table>';
	 document.getElementById('wk').innerHTML=lc;
	 positionWk();
}
//////////////////////////////////////////////////////////////////
function _RevenuesPerformance()
{RevenuesPerformance()}
//////////////////////////////////////////////////////////////////
function RevenuesPerformance()
{
	
	//	arrReserve[arrReserve.length]=new Array('YEAR','ACTUAL_START_BALANCE','SOY_REQUIRED_BALANCE','EOY_REQUIRED_BAL','EXPENSES','RECOM_CONTRIB','INTERESTS','DEFERREDSURPLUS','ProjectedEndingBalance','InterestVariation','RequiredContribution');
	var totalI=0;
	var totalP=0;
	var lc='<table id="reportTable" border=0 cellspacing=4>';
	lc+='<tr style="background-color:lightgrey;font-size:1.1em;">';
	lc+='<th>Year</th>';
	lc+='<th>EOY Balance</th>';
	lc+='<th>Projected Ints</th>';
	lc+='<th>Total<br>cumulated<br>Projected</th>';
	lc+='<th>Year\'s<br> Op funds <br> interests</th>';
	lc+='<th>Year\'s<br> Reserve funds <br> interests</th>';
	lc+='<th>Total for year </th>';
	lc+='<th>Realized</th>';
	lc+='<th>Advance or <br><font color=blue>To be gained</font></th>';
	lc+='<th>Free capital<br> Total Assets<br>Minus<br>15 000$</th>';
	lc+='<th>Gained %</th>';
	lc+='</tr>';
	
	for (var i =0;i<arrReserve.length;i++)
	{
	
		iYear=arrReserve[i]['YEAR'];
		arrInterests=getInterests(iYear);
		if (arrInterests[0]>=0)
		{
			iOps=parseFloat(arrInterests[0]);
			iRes=parseFloat(arrInterests[1]);
		}
		else // future interests not earned yet
		{
			iOps=0;
			iRes=0;
		}
		totalI+=(iOps+iRes);
		totalP+=parseFloat(arrReserve[i]['INTERESTS']);
		assets=getAsset(iYear,'TOTAL');
		if (assets>0) assets-=15000;
		else
			assets=0;
		if (assets>0)
			gained=((iOps+iRes)/assets)*100;
		else
			gained=0;
		
		adv=(totalI-totalP);
		if(adv<0)
		{
			color='blue';
			adv='('+parseInt(adv*-1)+')';
		}
		else
		{
			color='black';
			adv=parseInt(adv);
		}
		lc+='<tr style="height:2em;border:1px solid red;">';
		lc+='<td>'+arrReserve[i]['YEAR']+'</TD>';
		lc+='<td align=right>'+arrReserve[i]['EOY_REQUIRED_BAL']+'</TD>';
		lc+='<td align=right>'+arrReserve[i]['INTERESTS']+'</TD>'
		lc+='<td align=right>'+parseInt(totalP)+'</TD>';
		lc+='<td align=right>'+iOps+'</TD>'
		lc+='<td align=right>'+iRes+'</TD>'
		lc+='<td align=right>'+parseInt(iOps+iRes)+'</TD>'
		lc+='<td align=right>'+parseInt(totalI)+'</TD>'
		lc+='<td align=right style="color:'+color+';">'+adv+'</TD>'
		lc+='<td align=right>'+parseInt(assets)+'</TD>'
		lc+='<td align=right>'+(gained).toFixed(2)+'</TD>'
		lc+='</tr>';
	}
	lc+='</table>';
	document.getElementById('wk').innerHTML=lc;
	noSubMenu();
	positionWk();
}
//////////////////////////////////////////////////////////////
function itemByYear_report(pItem)
{
	
	for (var i=2017;i<2025;i++)
	{
		S=getDollars(i,'S',pItem)
		
		
	}
	
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////
function graphBudgetItems()
{	
	pContainer='wk';
	//vertical bar graphic for each budget item
	// may then be sized for any year / by default displays 2024
	var gData=BudgetItems();
	var ampY=gData[0];
	var gValues=gData[1];
	
	document.getElementById(pContainer).style.left='20px';
	document.getElementById(pContainer).style.width='90%';
	document.getElementById(pContainer).style.height='90%';
	document.getElementById(pContainer).innerHTML='';
	for (var i = 0;i<arrItems.length;i++)
	{
		style='left:'+(10+(i*52)) + 'px;top:95%;height:100px;';
		newBar=document.createElement("DIV");
		newBar.setAttribute("class","barbar");
		newBar.setAttribute("id","bin_"+arrItems[i]['ITEMNO']);
		newBar.setAttribute("style",style);
		document.getElementById('wk').appendChild(newBar);
		
		style='left:'+(10+(i*52)) + 'px;top:95%;';
		newBar=document.createElement("DIV");
		newBar.setAttribute("class","barlabel");
		newBar.setAttribute("id","binlabel_"+arrItems[i]['ITEMNO']);
		newBar.setAttribute("style",style);
		newBar.innerHTML=arrItems[i]['ITEMNAME'];
		document.getElementById('wk').appendChild(newBar);
	
	}
	setTimeout(sizeVBars,400,2024,ampY);
}
//////////////////////////////////////////////////////////////////////////
function sizeVBars(pYear,amp)
{
	
	for (var i = 0;i<arrItems.length;i++)
	{
		thisBar='bin_'+i;
		h=getDollars(pYear,'S',arrItems[i]['ITEMNO']);
		console.log(h,amp,h/amp,((h/amp)*100).toFixed(2));
		document.getElementById(thisBar).style.height=((h/amp)*500)+'px';
	}
	positionWk();
}
///////////////////////////////
function _budgetsReport()
{var d=new Date(); y=d.getFullYear()-1;budgetsReport(y)}
/////////////////////////////////////////////////////////////
function budgetsReport(pYear)
{
	noSubMenu();
	var lc='<table id="reportTable"  border=1>';
	var totalB=0;
	var totalS=0;
	var totalD=0;
	var S=0;B=0;D=0;
	var updateButton='<input type=button value="update" style="margin-right:10px;color:blue;font-size:1.2em;" onclick="exportExpenses();">';
	Iupdated=new Date(getDatasetLastUpdate('arrData'));
	uy=Iupdated.getFullYear();
	um=Iupdated.getMonth()+1;
	ud=Iupdated.getDate();
	updated='<span style="position:float;float:right;font-style:italics;">'+ updateButton+' updated '+um+'/'+ud+'/'+uy + '</span>';
	
	lc+='<tr style="height:40px;background-color:pink;">';
	lc+='<th colspan=4 style="text-align:center;">'
	for (i=2024;i>2016;i--)
	{
		ycolor=(i==pYear?'aqua':'transparent');	
		lc+='<span style="border:4px solid grey;border-radius:12px;padding:7px;margin:5px;background-color:'+ycolor+';" onclick="budgetsReport('+i+');">'+i+'</span>';
	}
	ycolor=(pYear==-1?'aqua':'transparent');	
	lc+='<span style="border:4px solid grey;padding:4px;margin:5px;background-color:'+ycolor+';" onclick="budgetsReport(-1);">Overall</span>';
	lc+='</Th>';
	lc+='</tr>';
	lc+='<tr style="height:40px;background-color:white;font-size:1.3em;">';
	lc+='<th colspan=4 style="text-align:center;">Distribution of budget for year ' + pYear + '</th>';
	lc+='</tr>';
	lc+='<tr style="background-color:lightgrey;font-size:1.3em;">';
	lc+='<th>Budget item</Th>';
	lc+='<th>$ Budgeted</Th>';
	lc+='<th>$ Spent</Th>';
	lc+='<th>&Delta;</Th>';
	lc+='</tr>';
for (var i=0;i<arrItems.length;i++)
{
	B=0;S=0;D=0;
	
	
	if (pYear==-1)
	{
		for (var iy=2017;iy<2025;iy++)
		{
			iB=parseFloat(getDollars(iy,'B',arrItems[i]['ITEMNO']));//budgeted
			iS=parseFloat(getDollars(iy,'S',arrItems[i]['ITEMNO']));//spent
			iD=parseFloat(getDollars(iy,'D',arrItems[i]['ITEMNO']));//diff
			B+=iB;
			S+=iS;
			D+=iD;
		}
		totalB+=B;
		totalS+=S;
		totalD+=D;
	}
	else
	{
		B=parseFloat(getDollars(pYear,'B',arrItems[i]['ITEMNO']));
		S=parseFloat(getDollars(pYear,'S',arrItems[i]['ITEMNO']));
		D=parseFloat(getDollars(pYear,'D',arrItems[i]['ITEMNO']));
		totalB+=B;
		totalS+=S;
		totalD+=D;
	}
	lc+='<tr>';
	lc+='<td>'+arrItems[i]['ITEMNAME'] + '</TD>';
	lc+='<td align=right>'+B.toFixed(2) + '</TD>';
	if (new Date().getFullYear()==pYear)
		lc+='<td align=right><input type=text size=4 value="'+S + '"></TD>';
	else
		lc+='<td align=right> '+S.toFixed(2) + '</TD>';
	lc+='<td align=right>'+D.toFixed(2) + '</TD>';
	lc+='</tr>';
}
	lc+='<tr style="background-color:lightgrey;font-size:1.3em;">';
	lc+='<td >Totals</TD>';
	lc+='<td align=right>'+ totalB.toFixed(2) + '</TD>';
	lc+='<td align=right> '+totalS.toFixed(2) + '</TD>';
	lc+='<td align=right>'+totalD.toFixed(2) + '</TD>';
	lc+='</tr>';
lc+='</table>';
document.getElementById('wk').innerHTML=lc;
positionWk();
}
///////////////////////////////////////
function _RealOperatingBudgets()
{
	var aa=2017
	var dd=new Date();
	var bb=dd.getFullYear();
	RealOperatingBudgets(aa,bb);
}
//////////////////////////////////////////////////////////////////////////
function RealOperatingBudgets(a,b)
{
	/*
	from year 'a' to year 'b' (incl.)
	produces a report in this shape:
	Year		|	Year  	|	Year (...)
	Budgeted	|			|	
	Spent		|			|
	*/
	
	var lc='<table id="reportTable" border=1 cellspacing=0 cellpadding="3px">';
	lc+='<tr style="background-color:ligthgrey;font-weight:bolder;"><td>&nbsp;</td>';
	for (var i=a;i<=b;i++)
		lc+='<td align=right>'+i+'</td>';
	lc+='</tr>';
	lc+='<tr><td>Amount Budgeted</td>';
	for (var i=a;i<=b;i++)
		lc+='<td align=right>'+getDollars(i,'B')+'</td>';
	lc+='</tr>';
	lc+='<tr style="background-color:lightsteelblue"><td>Actually Spent</td>';
	lcReserve='<tr style="background-color:lightgrey"><td>Allocated to reserve</td>';
	for (var i=a;i<=b;i++)
	{	console.log(i);
		dols=(getDollars(i,'R'));
		lc+='<td align=right>'+getDollars(i,'S')+'</td>';
		lcReserve+='<td align=right>'+dols+'</td>';
	}
	lc+='</tr>';
	lc+='<tr><td>Difference</td>';
	for (var i=a;i<=b;i++)
		lc+='<td align=right>'+getDollars(i,'D')+'</td>';
	lc+='</tr>';
	lc+=lcReserve;
	lcLineAssets= '<tr><td  align=center colspan='+((b-a)+2)+ '>Assets</td></tr>';
	//console.log(lcLineAssets);
	lc+=lcLineAssets;
	//////////////////////
	/// displaying assets
	////////////////////////
	
	// Line 1: operations funds
	lc+='<tr><td>Operations Account</td>';
	for (var i=a;i<=b;i++)
		lc+='<td align=right>'+getAsset(i,'OPA')+'</td>';
	lc+='</tr>';
	// Line 2 : reserve fund (GIC+reserve)
	lc+='<tr><td>Reserve Fund (includes GICS when any)</td>';
	for (var i=a;i<=b;i++)
	{
		aa=getAsset(i,'RA');
		lc+='<td align=right>'+(aa==-1?'-':aa)+'</td>';
	}
	lc+='</tr>';
	// Line 3 : recommended reserve balane
	lc+='<tr><td>Recommended Reserve Balance at EOY</td>';
	for (var i=a;i<=b;i++)
	{
		rr=getReserveRecommendedValue(i,'EOY_REQUIRED_BAL');
		lc+='<td align=right>'+ (rr==0?'not set':rr) +'</td>';
	}
	lc+='</tr>';
	// Line 4 : total assets
	lc+='<tr><td>TOTAL assets <br>on Dec 31</td>';
	for (var i=a;i<=b;i++)
		lc+='<td align=right>'+getAsset(i,'TOTAL')+'</td>';
	lc+='</tr>';
	
	
	lc+='</table>';
	document.getElementById('wk').innerHTML=lc;
	noSubMenu();
	positionWk();
}
function ReserveReport()
{
	
	var titles=arrReserve[0].toString();
	var arrTitles=titles.split(',');
	var lc='<table border=1>';
	lc+='<tr>';
	for (var f=0;f<arrTitles.length;f++)
	{
		lcTitle='';
		if (arrTitles[f].indexOf('_')>=0)
		{
		arrN=arrTitles[f].split('_');
		for (k=0;k<arrN.length;k++)
			lcTitle+=arrN[k].substring(0,3);
		}
		else
			lcTitle=arrTitles[f].substring(0,3);
		
		lc+='<th>'+lcTitle+'</th>';
		
	}lc+='</tr>';
	for (var i =0;i<arrReserve.length;i++)
	{
		lc+='<tr>'
		for (var f=0;f<arrTitles.length;f++)
			lc+='<td>'+arrReserve[i][arrTitles[f]]+'</td>';
		lc+='</tr>';
	}
	lc+='</table>';
	document.getElementById('wk').innerHTML=lc;
	positionWk();
	noSubMenu();
}
////////////////////////
function _showBudget()
{showBudget();}
////////////////////////
function showBudget()
{
	pYear=(new Date().getFullYear());
	var BUDGET=0;
	var BUFFER=0;
	noSubMenu();
	
	document.getElementById('wk').style.width='70%';
	var buttonSave='<input type=button style="margin-left:10px;font-size:1.2em;" value="Save" onclick="exportBudgets();">'
	var lc='<table id="reportTable"  border=1 margin-left=50px width=100%><tr style="font-size:1.3em;background-color:lightgrey;"><td colspan=4 align=center>Budget for '+ pYear + buttonSave+ '</td></tr>';
	lc+='<tr style="background-color:lightgrey;font-size:1.2em;"><td></td><td>Spent in '+(pYear-1)+'</td><td>Budgeted</td><td>Buffer Amt</td></tr>';
	for (var i =0;i<arrBudgets.length;i++)//('YEAR','BUDGETITEM','BUDGET','BUFFER');
	{
		if (arrBudgets[i]['YEAR']==pYear)
		{
			BUDGET+=arrBudgets[i]['BUDGET'];
			BUFFER+=arrBudgets[i]['BUFFER'];
			HistoryAmt=getDollars((pYear-1),'S',arrBudgets[i]['BUDGETITEM']);
			lc+='<tr>';
			lc+='<td>' +getItemName(arrBudgets[i]['BUDGETITEM'])+ '</TD>';
			lc+='<td align=right>'+ HistoryAmt + '</TD>';	
			lc+='<td align=right><input id="'+pYear+'_'+ arrBudgets[i]['BUDGETITEM']+ '_'+ 'BUDGET" type=text size=4 style="text-align:right;" onchange="updateBudgetItem(this.id);" value="'+arrBudgets[i]['BUDGET']+ '"></TD>';	
			lc+='<td align=right><input id="'+pYear+'_'+ arrBudgets[i]['BUDGETITEM']+ '_'+ 'BUFFER" type=text size=4 style="text-align:right;" onchange="updateBudgetItem(this.id);" value="'+arrBudgets[i]['BUFFER']+ '"></TD>';
			lc+='</tr>';
		}
	}
	RequiredStanding=getAsset(pYear,'RRB');
	CurrentStanding = getAsset((pYear-1),'RA');
	ReserveAllocation=RequiredStanding-CurrentStanding;
	if(ReserveAllocation<0) ReserveAllocation=0;
	RequiredRevenues=(BUFFER+BUDGET)+ReserveAllocation;
	CFRevenues=(getAPPSF(2024,0)*10000);
	RFContrib=CFRevenues-RequiredRevenues;
	lc+='<tr bgcolor=blue><td colspan=4></td></tr>';
	lc+='<tr><td colspan=3>Total expected Expenses (not including bufffer) </td><td align=right ID="nextYearBudget">'+BUDGET.toFixed(2)+'</td></tr>';
	lc+='<tr><td colspan=3>Safety Buffer </td><td align=right ID="nextYearBuffer">'+BUFFER.toFixed(2)+'</td></tr>';
	lc+='<tr><td colspan=3>Total Required Operations Funds </td><td align=right ID="TROF">'+((BUFFER+BUDGET).toFixed(2))+'</td></tr>';
	lc+='<tr><td colspan=3>Required Reserve Fund Balance at EOY for '+ pYear +' </td><td align=right>'+getReserveRecommendedValue(pYear,'EOY_REQUIRED_BAL')+'</td></tr>';
	lc+='<tr><td colspan=3>Current Reserve Fund Balance (including GICs) </td><td align=right>'+getAsset((pYear-1),'RA')+'</td></tr>';
	lc+='<tr style="background-color:lightgrey;font-weight:bold;"><td colspan=3 >Total required revenues for the year (condo fees+interests)</td><td align=right id"TRQREV">'+RequiredRevenues.toFixed(2)+'</td></tr>';
	lc+='<tr style="background-color:lightgrey;font-weight:bold;"><td colspan=3 >Revenues  from condo fees (as per 2024 charges) </td><td align=right id"TRQREV">'+(CFRevenues).toFixed(2)+'</td></tr>';
	//lc+='<tr style="background-color:lightgrey;font-weight:bold;"><td colspan=3 >Excedent to Reserve fund </td><td align=right id"TRQREV">'+(RFContrib).toFixed(2)+'</td></tr>';
	document.getElementById('wk').innerHTML=lc;
	document.getElementById('wk').style.top=(document.getElementById('menu').getBoundingClientRect().bottom+20)+ window.scrollY+'px';
	document.getElementById('wk').style.left='20px';
	
}