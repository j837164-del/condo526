////////////////////////////////////////////////////////////////////////////////////////////
function getBaseBudget()
{
	var LastBudgetedYear=getLastBudgetYear(); //
	var BUDGET=0;
	var BUFFER=0;
	
	for (var i =0;i<arrBudgets.length;i++)//('YEAR','BUDGETITEM','BUDGET','BUFFER');
	{
		if (arrBudgets[i]['YEAR']==LastBudgetedYear)
		{
			BUDGET+=arrBudgets[i]['BUDGET'];
			BUFFER+=arrBudgets[i]['BUFFER'];
		}
	}
	
	Operating=BUDGET+BUFFER;
	return [LastBudgetedYear,Operating];
}
//////////////////////////////////////////////////////
function InflateMe(base,rate,pyears)
{
	
	for (var i =0;i<pyears;i++)
	{
		
		Inflation=base*((rate/100));
		base+=Inflation;
		
	}
	return base;
}
/////////////////////////////////////////////////////
function getBudget(pYear,pInflation)
{
	var BudgetInfos=getBaseBudget();
	var StartYear=BudgetInfos[0];
	var StartingBudget=BudgetInfos[1];
	//console.log(pYear,pInflation,StartingBudget);
	var iYears=parseInt(pYear-StartYear);
	ThisBudget=InflateMe(StartingBudget,pInflation,iYears);
	return ThisBudget;
}
////////////////////////////////////////////////////////////////

/*
function project_EndingBalance(defer)
{
	//project ending balance according to current balance
	for (var i=0;i<arrReserve.length;i++)
	{
		StartBalance=arrReserve[i]['ACTUAL_START_BALANCE'];
		if (StartBalance<=0)
			StartBalance=arrReserve[i-1]['ProjectedEndingBalance'];
		if (i-1>=0)	Interests=arrReserve[i-1]['INTERESTS']; //from previous year
		else Interests=0;
		defered=arrReserve[i]['DEFERRED_SURPLUS'];//part of a surplus defered to a subsequent year
		Expenses=arrReserve[i]['EXPENSES'];
		EndingBalance=(StartBalance) - (Expenses);//+defered);// 
		// interests are factored in the balance once they are cashed only.
		// this has a consequence on the Required_Revenues field calculation
		Contribution=arrReserve[i]['EOY_REQUIRED_BAL']-EndingBalance;
		arrReserve[i]['RequiredContribution']=Contribution;//+defered;//eventually, minus interests
		
		if(Contribution<0)
		{
			arrReserve[i]['Surplus']=(Contribution*-1);
			for (var j=0;j<defer;j++)
				arrReserve[j+i]['DEFERRED_SURPLUS']+=parseFloat((Contribution*-1)/defer);
		}
		if (Contribution>0)
			arrReserve[i]['ProjectedEndingBalance']=EndingBalance+Contribution;
		else
			arrReserve[i]['ProjectedEndingBalance']=EndingBalance;
		//(if Contribution is negative, is a surplus;if positive, equals lowest contribution required (minus eventual interests)
		if(i<arrReserve.length-1 && arrReserve[i+1]['ACTUAL_START_BALANCE']==0)
		arrReserve[i+1]['ACTUAL_START_BALANCE']=arrReserve[i]['ProjectedEndingBalance'];
	}
}
*/
////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
function getCondoFactor(pCondoUnit)
{
	
	var factor=0; //Array('Unit','Factor');
	for (var i=0;i<arrCondos.length;i++)
	{
		//console.log(arrCondos[i]['Unit']+'<>'+pCondoUnit);
		if (arrCondos[i]['Unit']==pCondoUnit)
		{
			factor=arrCondos[i]['Factor'];
			break;
		}
	}
	return factor;
}
/////////////////////////////////////////////////
function byFactor(a,b)
{
	return a['Factor']-b['Factor'];
}
////////////////////////////////////////////////////
function getgroupCondos()
{
	arrCondos.sort(byFactor);
	var oldGroup=0;var arrGroups=[];
	for(var i=0;i<arrCondos.length;i++)
	{
		newGroup=arrCondos[i]['Factor'];
		if (oldGroup!=newGroup)
		{
			
			oldGroup=newGroup;
			arrGroups[arrGroups.length]=new Array('Factor','GroupList');
			arrGroups[arrGroups.length-1]['Factor']=oldGroup;
			arrGroups[arrGroups.length-1]['GroupList']=[];
			arrGroups[arrGroups.length-1]['GroupList'].push(arrCondos[i]['Unit']);
		}
		else
			arrGroups[arrGroups.length-1]['GroupList'].push(arrCondos[i]['Unit']);		
	}
	return arrGroups;
}
function getCondoFee(pYear,factor,appsf)
{	
//from 2017 to 2052 ONLY
	//factor=getCondoFactor(pUnit);
	price=(factor*appsf)/12; ///monthly
	return price;
}
//////////////////////////////////
function getAPPSF(pYear,ir)
{
	//only for past years
	var d=new Date();
	var price=0; //Annual Price Per Square Foot = APPSF
	if (pYear>2017 &&pYear<=2024)
	{ //past value
	for (var i =0;i<arrCondoFees.length;i++)
	{
		if (arrCondoFees[i]['Year']==pYear)
		{
			price=arrCondoFees[i]['APPSF'];
			break;
		}
	}
	}
	else
	{ price=-1;
	}
	
	return price;
}
/////////////////////////////////////////////////////////////////////////////////////
function preProject()
{
	var ir=document.getElementById('cfr').value;
	var extra=document.getElementById('dfry').value;
	var noDecrease=document.getElementById('chk_NoDecrease').checked;
	//var Smooth=document.getElementById('chk_Smooth').checked;
	condoFeeReport(ir,extra,noDecrease);
}
/////////////////////////////////////////////////////////////////////////////////
function projectionMenu(ir,extra,noDecrease)
{
	var projMenu=`<table style="border:1px solid blue;border-radius:10px;width:100%;"><tr><td style="width:50%;"><table style="border:1px solid blue;border-radius:10px;">
<tr>
	<TD>
		Factor inflation at<input type=text style="width:20px;" id="cfr" value="`+ir+`">%
	</td>
	<td style="border:1px solid blue;margin:20px;">	
		<input type=checkbox id='chk_NoDecrease' `+(noDecrease?'checked':'')+`> No decrease
	</td>
	<TD style="text-align:center;">
			<INPUT type=button value="Project" onclick="preProject()">
	</td>
	<TD style="text-align:center;">
			<INPUT style="border-radius:50%;padding:6px;color:blue;font-size:1.2em;" type=button value="C" onclick="clearCurves();//memorizeCurves();">
	</td>
</tr>
<tr>
	<td colspan=2>Maintain $<input type=text style="width:50px;" id="dfry" value="`+extra+`">surplus
	</td>	
	<TD style="text-align:center;">
			<INPUT type=button value="Graph" onclick="graphProjection();">
	</td>
	<TD style="text-align:center;">
			<INPUT type=button value="nothing" onclick="">
	</td>
</tr>
</table></td>
<td style="width:50%;"><table id="MCurves" style="border:1px solid blue;border-radius:10px;width:100%;"><tr><td ></td></tr></table></td></tr></table>`;
return projMenu;
}
////
function _condoFeeReport()
{
	condoFeeReport();
}
/////////////////////////////////////////////////////////////////////////////////////////
function condoFeeReport(ir=3,extra=30000,noDecrease=true)
{
	//ir=inflation rate
	var lc='';
	var condoFees=0;
	lc+='<table id="reportTable" style="border-spacing:10px 0px;font-size:1.1em;">';
	lc+='<tr><td colspan=13 style="border:1px solid green;">'+projectionMenu(ir,extra,noDecrease)+'</td></tr>';
	lc+='<tr><th>Year</th>';
	lc+='<TH  onclick="selectCol(1);">Starting Bal</th>';
	lc+='<th onclick="selectCol(2);">Avail. Res$</th>';
	lc+='<th onclick="selectCol(3);" id="myI">Based on AR<br>##mI@@##</th>';
	lc+='<th onclick="selectCol(4);" id="theirI">Based on RSF est.<br>##tI@@##</th>';
	lc+='<TH onclick="selectCol(5);"  >Budget</th>';
	lc+='<TH onclick="selectCol(6);"  >Exp.</th>';
	lc+='<th onclick="selectCol(7);" >Total required revenues</th>';
	lc+='<th onclick="selectCol(8);" >Required<br> ending<br> balance</th>';
	lc+='<th onclick="selectCol(9);"  >Actual ending bal</th>';
	lc+='<th >Surplus</th>';
	lc+='<th onclick="selectCol(11);" >APPSF</th>';
	lc+='<th onclick="selectCol(12);" >Increase</th>';
	var condoGroups=getgroupCondos();
	for (var col=0;col<condoGroups.length;col++)
	{	lc+='<th style="border-bottom:2px solid  black;"><table style="width:100%;height:100%;"><tr><td style="border:1px solid black;border-radius:50%;padding:4px;"onclick="selectCol('+(13+col)+');" >Unit';

		condoList=condoGroups[col]['GroupList'];
		if (condoList.length>1)
			lc+='s';
		lc+=' <br> ';
		for (iUnit=0;iUnit<condoList.length;iUnit++)
		{
			lc+=condoList[iUnit];	
			if (iUnit<condoList.length-1)
				lc+= ',';
		}
		lc+= '</td></tr></table></th>';
	}
	lc+='</tr>';
	Surplus=0;
	tavI=0;tavIES=0;
	BaseRevenue=10000*getAPPSF(2024,0);//this is what we get in 2024 
											//an onwards without any increase to condo fees	
	for (var y=2025;y<2053;y++)
	{
		if (y==2025)
		{
			//StartBalance=getReserveRecommendedValue(y,'ACTUAL_START_BALANCE');
			StartBalance=getAsset(y,'RA');
		}
		else
			StartBalance=ActualEndingBalance;
		
		Operations=getBudget(y,ir);// inflation rate = 3
		Expenses=getReserveRecommendedValue(y,'EXPENSES');
		av=StartBalance-Expenses;
		avI=av*.02;
		tavI+=avI;
		avIES=getReserveRecommendedValue(y,'INTERESTS');
		tavIES+=avIES;
		GoalEndBalance=getReserveRecommendedValue(y,'EOY_REQUIRED_BAL');
		Remainder=StartBalance-Expenses-Operations;
		RequiredContribution=GoalEndBalance-Remainder+parseInt(extra);//factors and includes 
		console.log(y,RequiredContribution,	Remainder,GoalEndBalance);														//interests earned (or not)
		if (!noDecrease&&RequiredContribution<0) //no contrib. req. and decrease allowed
			condoFees=Operations; 
		if (y>2025)
			OldAPPSF=condoFees/10000;
		else
			OldAPPSF=BaseRevenue/10000;
		if (RequiredContribution>BaseRevenue) // bals low - requires an increase
		{condoFees=RequiredContribution;console.log(' need to increase them  '+ y,BaseRevenue,condoFees);}
		else //base rev sufficient no increase required
			if (noDecrease)
			{condoFees=BaseRevenue;console.log(' no requirement to increase  '+ condoFees);}
			else// allow potential decrease
				{
					condoFees=Operations;
					BaseRevenue=condoFees; //increase base so now no longer 2024based
				}
		APPSF=condoFees/10000;
		if (APPSF<OldAPPSF && noDecrease)
		{
			condoFees=OldAPPSF*10000;
			APPSF=OldAPPSF;
		}
		Increase=((APPSF/OldAPPSF)-1)*100;
		ActualEndingBalance=parseInt(StartBalance-Expenses-Operations+condoFees);
		Surplus=ActualEndingBalance-GoalEndBalance;			
		lc+='<tr><td>'+y+'</td>';	
		lc+='<td style="background-color:lightgrey;text-align:right;">'+parseInt(StartBalance)+'</td>';
		lc+='<td  style="background-color:white;text-align:right;">'+parseInt(av)+'</td>';
		lc+='<td  style="background-color:lightgrey;text-align:right;">'+parseInt(avI)+'</td>';
		lc+='<td  style="background-color:white;text-align:right;">'+parseInt(avIES)+'</td>';
		lc+='<td  style="background-color:lightgrey;text-align:right;"t>'+parseInt(Operations)+'</td>';
		lc+='<td style="background-color:white;text-align:right;">'+parseInt(Expenses)+'</td>';
		lc+='<td style="background-color:lightgrey;color:red;text-align:right;">'+condoFees.toFixed(0)+'</td>';
		lc+='<td style="color:blue;text-align:right;">'+parseInt(GoalEndBalance)+'</td>';
		lc+='<td style="background-color:lightgrey;color:green;text-align:right;">'+parseInt(ActualEndingBalance)+'</td>';
		lc+='<td style="color:green;text-align:right;">'+(parseInt(Surplus)>0?parseInt(Surplus):'')+'</td>';
		lc+='<td style="background-color:lightgrey;color:blue;text-align:right;">'+APPSF.toFixed(2)+'</td>';
		lc+='<td align=right style="border-right:2px solid black;padding-right:12px;">'+Increase.toFixed(2)+'</td>';
		
			for (var condoGroup=0;condoGroup<condoGroups.length;condoGroup++)
				lc+='<td style="box-sizing:border-box;text-align:right;border:10px solid '+(condoGroup%2==0?'white':'lightgrey')+';background-color:'+(condoGroup%2==0?'white':'lightgrey')+'">'+ getCondoFee(y,condoGroups[condoGroup]['Factor'],APPSF).toFixed(2) + '</td>';
		lc+='</tr>'
	}
	
	lc+='</tr>';
	lc=lc.replace('##mI@@##',parseInt(tavI));
	lc=lc.replace('##tI@@##',parseInt(tavIES));
	document.getElementById('wk').innerHTML=lc;
populateViewMembers();	
positionWk();noSubMenu();
}