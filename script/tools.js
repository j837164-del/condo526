/////////////////////////////////////////////////////
function getItemNumber(pI)
{
myPost=arrData[pI]['POST'];
for (var i =0;i<arrItems.length;i++)
{
	if (arrItems[i]==myPost)
		{
		ItemNbr=i;
		break;
		}
}
console.log(ItemNbr);
return ItemNbr;
}
var ctt=3;
////////////////////////////////////////////////////////////////
function getBudgetItemNumber(p)
{
var ItemNbr=-1
for (var i =0;i<arrItems.length;i++)
{
	if (arrItems[i]['ITEMNAME']==p)
		{
		ItemNbr=i;
		break;
		}
}
return ItemNbr;
}
//////////////////////////////////////////
function positionWk()
{
	
	if(document.getElementById('oput').style.visibility=='visible')
		document.getElementById('wk').style.top=((document.getElementById('oput').getBoundingClientRect().bottom+20)+window.scrollY)+'px';
	else
		document.getElementById('wk').style.top=((document.getElementById('tblMenu').getBoundingClientRect().bottom+20)+window.scrollY)+'px';
	document.getElementById('wk').style.width='90%';
	//console.log(window.scrollY,document.getElementById('wk').style.top);
}
///////////////////////////////
function getDatasetLastUpdate(pSet)
{
	var iUpdate='never';
	for (var i=0;i<arrMaster.length;i++)
	{
		if(arrMaster[i]['ListName']==pSet)
		{
			iUpdate=arrMaster[i]['LastUpdate'];
			break;
		}
	}
	return iUpdate;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRequiredReserve(pYear) //('YEAR','EOY_REQUIRED_BAL','EXPENSES','RECOM_CONTRIB','INTERESTS');
{
	var values=[];
	for (var i =0;i<arrReserve.length;i++)
	{
		if (arrReserve[i]['YEAR']==pYear)
		{
			Amt=arrReserve[i]['EOY_REQUIRED_BAL'];
			Interests=arrReserve[i]['INTERESTS'];
			values.push(Amt);values.push(Interests);
		}
	}
	return values;
}
////////////////////////////////////////////////////////////////////////
function getStartingReserveBalance()
{
	//returns the last known balance for the reserve, in which year
	var values=[];
	for (var i =0;i<arrAssets.length;i++)
	{
		if (arrAssets[i]['RA']>0)
		{
			Year=arrAssets[i]['YEAR'];
			FUNDS=arrAssets[i]['RA'] + arrAssets[i]['GIC'];
		}	
	}
	values.push(Year);values.push(FUNDS);
	return values;
}
//////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
function getReserveRecommendedValue(pYear,whichValue)
{
	var iValue=0;
	for (var i =0;i<arrReserve.length;i++)
	{
		if (arrReserve[i]['YEAR']==pYear)
		{
			iValue=arrReserve[i][whichValue];
			break;
		}
		
	}
	return iValue;
}

/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function getLastBudgetYear()
{
		// find the last defined budget, so to base ourselves on it
	var MaxYear=0;
	for (var i =0;i<arrBudgets.length;i++)
	{
		if (arrBudgets[i]['YEAR']>MaxYear)
			MaxYear=arrBudgets[i]['YEAR'];
	}
	
return MaxYear;	
}
///////////////////////////////////////|
function getItemName(pNo)
{
	//console.log('lloking for ' + pNo);
	var ItemName='NOTHING';
	for (var i=0;i<arrItems.length;i++)
	{
		if (arrItems[i]['ITEMNO']==pNo)
		{
			ItemName=arrItems[i]['ITEMNAME'];
			break;
		}
		
	}
	
	return ItemName;
}
///////////////////////////////////////|
function SumItem(pBudgetItem)
{
var Summ=0;
var SummSpent=0;
var Budget=0;
var lc='<table border=1>';
lc+='<tr>';
lc+='<td><input type=button value="<-return" onclick="budgetsReport()";></td><td colspan=5 align=center>'+getItemName(pBudgetItem)+'</td></tr>';
lc+='<tr>';

lc+='<td>YEAR</TD>';
lc+='<td>Amt Budgeted</TD>';
lc+='<td>Amt Spent</TD>';
lc+='<td>Diff</TD>';
lc+='</tr>';
for (var i =0;i<arrData.length;i++)
{

	if (arrData[i]['BUDGETITEM']==pBudgetItem)
		{
		diff=(arrData[i]['BUDGET']-arrData[i]['SPENT']);
		Summ+=diff;
		SummSpent+=arrData[i]['SPENT'];
		Budget+=arrData[i]['BUDGET']
		lc+='<tr>';
		lc+='<td>'+arrData[i]['YEAR']+ '</td>';
		lc+='<td>'+arrData[i]['BUDGET']+ '</td>';
		lc+='<td>'+arrData[i]['SPENT']+ '</td>';
		lc+='<td>'+diff.toFixed(2)+ '</td>';
		lc+='</tr>';
		}
}
if (Summ>=0) color='green';else color='red';
lc+='<tr><td>SUMS</td><td>'+Budget.toFixed(2)+'</td><td>'+SummSpent.toFixed(2)+'</td><td style="color:'+color+'">'+Summ.toFixed(2)+'</td></tr>'

document.getElementById('wk').innerHTML=lc;
}
///////////////////////////////////////
///////////////////////////////////

function byDepartment(a,b)
{
	return a['DEPARTMENT']-b['DEPARTMENT'];
}
function byRecent(a,b)
{
	return b['YEAR']-a['YEAR'];
}
///////////////////////////////////////
function sumYear(pYear)
{
//	console.log(pYear)

if (parseInt(pYear)>2017)
	before='<INPUT TYPE=BUTTON VALUE="<--'+(pYear-1) +'" ONCLICK="sumYear('+(pYear-1)+')">';
else
	before='&nbsp;';
if (parseInt(pYear)<2024)
	after='<INPUT TYPE=BUTTON VALUE="'+(pYear+1) +'-->" ONCLICK="sumYear('+(pYear+1)+')">';
else
	after='&nbsp;';
var lc='<table border=1>';
lc+='<tr>';
lc+='<td align=center>'+before+'</td><td colspan=2>Balance sheet (Admin,OPS, Utils) for '+pYear+'</td><td align=center>'+after+'</td></tr>';
lc+='<tr bgcolor=lightgrey>';
lc+='<th>Budget item</Th>'
lc+='<th>Amt Budgeted</Th>';
lc+='<th>Amt Spent</Th>';
lc+='<th>Diff</Th>';
lc+='</tr>';
	var diff=0;Spent=0;
		Budgeted=0;
	for (var i =0;i<arrData.length;i++)
	{
		console.log(arrData[i]['YEAR'] + '<->' + pYear);
		
		if (parseInt(arrData[i]['YEAR'])==pYear)
		{
			Spent+=arrData[i]['SPENT'];
			Budgeted+=arrData[i]['BUDGET'];
			lc+='<tr>';
			lc+='<td align=left>' + getItemName(arrData[i]['BUDGETITEM']) + '</TD>';
			lc+='<td align=right>' + arrData[i]['BUDGET'] + '</TD>';
			lc+='<td align=right>' + arrData[i]['SPENT'] + '</TD>';
			lc+='<td align=right>' +arrData[i]['DIFF'] + '</TD></tr>';
			diff+=parseFloat(arrData[i]['DIFF']);
			
		}
		
	}

	lc+='<tr style="backgrouind-color:lightgrey;font-weight:bolder;"><td > Summary. </td><td>'+Budgeted.toFixed(2)+'</td><td>'+Spent.toFixed(2)+'</td><td>' + diff.toFixed(2) + '</td></tr></table>';
	
	document.getElementById('wk').innerHTML=lc;
	
}
////////////////////////////////////////////////
function UpdateExpense(pObjId)
{
	//Updates Journal of Expenses - can be updated only for current year
	var objInfos=pObjId.split('_');
	var found=false;
	thisYear=objInfos[1];
	thisItem=objInfos[2];
	
	for (var i=0;i<arrData.length;i++)
	{
		if (arrData[i]['YEAR']==thisYear && arrData[i]['BUDGETITEM']==thisItem)
		{
			found=true;
			arrData[i]['SPENT']=parseFloat(document.getElementById(pObjId).value);
			break;
		}
	}
}
///////////////////////////////////////////////////////////////////////////
function updateBudgetItem(pObjId)
{
	var objInfos=pObjId.split('_');
	var found=false;
	thisYear=objInfos[0];
	thisItem=objInfos[1];
	thisField=objInfos[2];
	for (var i=0;i<arrBudgets.length;i++)
	{
		if (arrBudgets[i]['YEAR']==thisYear && arrBudgets[i]['BUDGETITEM']==thisItem)
		{
			found=true;
			arrBudgets[i][thisField]=parseFloat(document.getElementById(pObjId).value);
			break;
		}
	}
	showBudget();
	console.log( found,document.getElementById(pObjId).value);
}

////////////////////////////////////////////////
function UpdateAsset(pObjId)
{
	var objInfos=pObjId.split('_');
	var found=false;
	thisYear=objInfos[0];
	thisItem=objInfos[1];
	
	for (var i=0;i<arrData.length;i++)
	{
		if (arrAssets[i]['YEAR']==thisYear)
		{
			found=true;
			arrAssets[i][thisItem]=parseFloat(document.getElementById(pObjId).value);
			break;
		}
	}
	console.log( found,document.getElementById(pObjId).value);
}
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
function getDollars(pYear,pMode,pItem=-1)
{
	//pMode: R=actual contribution to reserve, 
	//budget B, or spent S, or D=diff
	var TotalMe=0;
	
	if (pMode=='R')
	{
			
		TotalMe=getReserveRecommendedValue(pYear,'ActualContribution');
		/*
		for (var i = 0;i<arrReserve.length;i++)
		{
			if (parseInt(arrReserve[i]['YEAR'])==pYear)
			{
				TotalMe=arrReserve[i]['ActualContribution'];
				console.log(i,TotalMe);
				break;
			}
		}
		*/
	}
	else
	{
		if (pItem==-1)
		{
			for (var i =0;i<arrData.length;i++)
			{
				if (arrData[i]['YEAR']==pYear)
				{
					if (pMode=='S')
						TotalMe+=arrData[i]['SPENT'];
					if (pMode=='B')
						TotalMe+=arrData[i]['BUDGET'];
					if (pMode=='D')
						TotalMe+=(arrData[i]['BUDGET']-arrData[i]['SPENT']);
				}
			}
		}
		else
		{
			for (var i =0;i<arrData.length;i++)
			{
				if (arrData[i]['YEAR']==pYear && arrData[i]['BUDGETITEM']==pItem)
				{
					if (pMode=='S')
						TotalMe=arrData[i]['SPENT'];
					if (pMode=='B')
						TotalMe=arrData[i]['BUDGET'];
					if (pMode=='D')
						TotalMe+=(arrData[i]['BUDGET']-arrData[i]['SPENT']);
					break;
				}
			}
		}
	}
	return TotalMe.toFixed(2);
}
////////////////////////////
function getTotalDollars(pStart,pIncludedEndYear,pItem,pMode)
{
	var ltotal=0;
	for (var i=pStart;i<=pIncludedEndYear;i++)
		ltotal+=parseFloat(getDollars(i,pMode,pItem));
	return ltotal;
}
//////////////////////////////
function getAsset(pYear,pWhichAsset)
{
	var tAsset=0;
	for (var i =0;i<arrAssets.length;i++)
	{
		if (arrAssets[i]['YEAR']==pYear)
		{
			if (pWhichAsset=='TOTAL')
				tAsset=arrAssets[i]['OPA']+arrAssets[i]['RA']+arrAssets[i]['GIC'];
			else
				if (pWhichAsset=='RA')
				{console.log(arrAssets[i]['RA'],arrAssets[i]['GIC']);
					tAsset=parseInt(arrAssets[i]['RA'])+parseInt(arrAssets[i]['GIC']);
				}
				else
					if (pWhichAsset=='RANET')
						tAsset=arrAssets[i]['RA'];  // only the available money
					else
						tAsset=arrAssets[i][pWhichAsset];
			break;
		}
	}
	//console.log('asset ' + tAsset);
	if (tAsset>0)
		return tAsset.toFixed(2);
	else // return 2024 values 
	{
		//tAsset=getAsset(2024,pWhichAsset);
		return -1;
	}
		
}
///////////////////////////////////////////////////////////////
function getInterests(pYear)
{
	//arrRevs[arrRevs.length]=new Array('YEAR','PROJECTED','REALIZED_C','REALIZED_RF');
	var iOps=0;
	var iRes=0;
	var found=false;
	for (var i =0;i<arrRevs.length;i++)
	{
		if (arrRevs[i]['YEAR']==pYear)
		{
			iOps=arrRevs[i]['REALIZED_C'];
			iRes=arrRevs[i]['REALIZED_RF'];
			found=true;
			break;
		}
	}
	if (found)	return [iOps,iRes];
	else	return [-1,-1];
}
//////////////////////////////////////////////////////////////////
function balance_Sheet(pYear,pBudgetItem)
{
	//returns array of spent/budgeted amounts for a specific budgetItem over a specific Year
	var myValues=[];
	for (var i =0;i<arrData.length;i++)
{
	if (arrData[i]['YEAR']==pYear && arrData[i]['BUDGETITEM']==pBudgetItem)
	{
		
			diff=(arrData[i]['BUDGET']-arrData[i]['SPENT']);
			myValues.push(arrData[i]['BUDGET']);
			myValues.push(arrData[i]['SPENT']);
			myValues.push(diff);
			break;
	}
}
if (myValues.length==0) myValues=[0,0,0];
return myValues;
}
//////////////////////////////////////////////////////////////////////////
function getMenu(p)
{
	if (p==null ||p==undefined) p="--(Local)---";
	var myLocation=document.location;
	if (myLocation.href.substring(0,4)=='file')
		lcMenu=1;
	else
		lcMenu=2;
	container=document.getElementById('menu');
	menuTable=document.createElement("TABLE");
	menuTable.setAttribute('id','tblMenu');
	menuTable.setAttribute('style','border:2px solid black;background-color:white;background-color:white;border-collapse:separate;');
	container.appendChild(menuTable);
	newRow=menuTable.insertRow(0);
	c1=newRow.insertCell(0);
	c1.setAttribute('class','buttonb');
	c1.addEventListener('click',_budgetsReport);
	c1.innerHTML='Balance per year';
	c2=newRow.insertCell(1);
	c2.setAttribute('class','buttonb');
	c2.addEventListener('click',_RealOperatingBudgets);// links to wrapper function
	c2.innerHTML='Operating budgets (2017-2024)';
	c3=newRow.insertCell(2);
	c3.setAttribute('class','buttonb');
	c3.addEventListener('click',_condoFeeReport);
	c3.innerHTML='Condo fees Projection';
	if (lcMenu==1)
	{	
	c4=newRow.insertCell(3);
	c4.setAttribute('class','buttonb');
	c4.setAttribute('style','background-color:PaleGreen;color:blue;');
	c4.addEventListener('click',_assetsReport);
	c4.innerHTML='Assets report';
	
	c5=newRow.insertCell(4);
	c5.setAttribute('class','buttonb');
	c5.setAttribute('style','background-color:PaleGreen;color:blue;');
	c5.addEventListener('click',_RevenuesPerformance);
	c5.innerHTML='Revenues proj';
	}
	newRow=menuTable.insertRow(1);
	c1=newRow.insertCell(0);
	c1.setAttribute('class','buttonb');
	c1.addEventListener('click',_budgetItemsList);
	c1.innerHTML='Balance by Item';
	
	c2=newRow.insertCell(1);
	c2.setAttribute('class','buttonb');
	c2.addEventListener('click',_showBudget);
	c2.innerHTML='Projected 2025 Budget';
	
	c3=newRow.insertCell(2);
	c3.setAttribute('class','buttonb');
	c3.addEventListener('click',v_report);
	c3.innerHTML='Budget items evolution graph';
	
	c4=newRow.insertCell(3);
	c4.setAttribute('class','buttonb');
	c4.innerHTML='You are' + p;
	
	
	
}
////////////////////////////////////////////////
///////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
function getRndInt()
{
	return parseInt(Math.random()* (49));
}
/////////////////////////////////////////////////////////////////////////////////
function noSubMenu()
{
	document.getElementById('oput').innerHTML='';
}
///////////////////////////////////////////
function budgetTabs()
{
	
	var tabs=document.getElementsByClassName('YearTab');
	for (var i=0;i<tabs.length;i++)
	{
		if (document.getElementById(tabs[i].id).style.visibility=='visible')
		{
			nextA=tabs[i].id.split("_");
			next=(nextA[1]-1);
			prev=(nextA[1]+1);
			console.log(next);
			document.getElementById(tabs[i].id).style.visibility='hidden';
			break;
		}
	}
	if (document.getElementById('Tab_'+next))
		document.getElementById('Tab_'+next).style.visibility='visible';
	else	
		document.getElementById(tabs[0].id).style.visibility='visible';

}
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
///  ********
//////////////      bar  graph utilities below      ////////////

////////////////////////////////////////////////////////
function BudgetItems()
{
	var minX=Infinity;
	var minY=Infinity;
	var MaxX=-Infinity;
	var MaxY=-Infinity;
	var arrBI=[];
	for (var iYear=2017;iYear<=2024;iYear++)
	{
		for (var item=0;item<arrItems.length;item++)
			{
				BudgetItem=arrItems[item]['ITEMNO'];
				BudgetItemName=arrItems[item]['ITEMNAME'];
				S=getDollars(iYear,'S',BudgetItem);
				B=getDollars(iYear,'B',BudgetItem);
				arrBI[arrBI.length]=new Array('YEAR','BI','BIN','S','B');
				arrBI[arrBI.length-1]['YEAR']=iYear;
				arrBI[arrBI.length-1]['BI']=BudgetItem;
				arrBI[arrBI.length-1]['BIN']=BudgetItemName;
				arrBI[arrBI.length-1]['S']=S;
				arrBI[arrBI.length-1]['B']=B;
				
				if (parseFloat(S)>MaxY)MaxY=S;
			}	
	}
	return [MaxY,arrBI];
}
