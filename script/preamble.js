var arrData=[];  // list of summed balance sheet, per item, per year
var arrItems=[];  // list of global bugetized items for any budget
var arrValues=[];  // temporary container for transposing values into fields, at a later time;
var arrBudgets=[]; // budget list
var arrProjection=[];  // map of one projection
var arrPlans=[];		// map of created projections for later use
var arrAssets=[];  // map of assets, reserve balances,contributions, and reserve xpenses
var arrReserve=[];
var arrCondos=[];
var arrCondoFees=[];
var stopList=[];///d
var arrStops=[];
var arrViews=[];
var arrTrips=[];//d
var arrRevs=[];
var arrCategories=[];
var arrMaster=[];
var d=new Date();
var gProjectionFields='';
///////////////////////////////////////////////////////////////////////
function updateListProperty(ListName,pDate)
{
	for(var i=0;i<arrMaster.length;i++)
	{
		if(arrMaster[i]['ListName']==ListName)
		{
			arrMaster[i]['LastUpdate']=pDate;
		}
	}
	
}
//////////////////////////////////////////////////
function DataProperties(ListName,ListLabel)
{
	arrMaster[arrMaster.length]=new Array('ListName','ListLabel','LastUpdate');
	arrMaster[arrMaster.length-1]['ListName']=ListName;
	arrMaster[arrMaster.length-1]['ListLabel']=ListLabel;
	arrMaster[arrMaster.length-1]['LastUpdate']=new Date();
}
//////////////////////////////////////////
function addCondo(pUnit,pFactor)
{
	arrCondos[arrCondos.length]=new Array('Unit','Factor');
	arrCondos[arrCondos.length-1]['Unit']=pUnit;
	arrCondos[arrCondos.length-1]['Factor']=pFactor;	
}
function addCondoFees(pYear,pAPPSF)
{
	arrCondoFees[arrCondoFees.length]=new Array('Year','APPSF');
	arrCondoFees[arrCondoFees.length-1]['Year']=pYear;
	arrCondoFees[arrCondoFees.length-1]['APPSF']=pAPPSF;
}
///////////////////////////////////////////////////////////////////////////////////
function addBudgetItem(ItemNo,Department,ItemName)
{
	
	arrItems[arrItems.length]=new Array('DEPARTMENT','ITEMNO', 'ITEMNAME');
	arrItems[arrItems.length-1]['DEPARTMENT']=Department;
	arrItems[arrItems.length-1]['ITEMNO']=ItemNo;
	arrItems[arrItems.length-1]['ITEMNAME']=ItemName;
	
}
///////////////////////////////////////////////////////////////////////////////////
function addExpense(pYear,pAccount, pBudget,pSpent)
{

	arrData[arrData.length]=new Array('YEAR','BUDGETITEM','BUDGET','SPENT','DIFF');
	arrData[arrData.length-1]['YEAR']=pYear;
	arrData[arrData.length-1]['BUDGETITEM']=pAccount;
	arrData[arrData.length-1]['BUDGET']=pBudget;
	arrData[arrData.length-1]['SPENT']=pSpent;
	arrData[arrData.length-1]['DIFF']=(pBudget-pSpent).toFixed(2);
	
}
function exportExpenses()
{
	var lc='';
	for (var i =0;i<arrData.length;i++)
		lc+='addExpense('+arrData[i]['YEAR'] + ','+arrData[i]['BUDGETITEM'] + ','+arrData[i]['BUDGET'] + ','+arrData[i]['SPENT'] + ');\r\n'
	var dd=new Date();
	lc+='updateListProperty("arrData","'+dd+'");';
	console.clear();
	console.log(lc);
}
///////////////////////////////////////////////////////////////////////////////////
function Budget(pYear,pBudgetItem,pBudget,pBuffer)
{
	arrBudgets[arrBudgets.length]=new Array('YEAR','BUDGETITEM','BUDGET','BUFFER');
	arrBudgets[arrBudgets.length-1]['YEAR']=pYear;
	arrBudgets[arrBudgets.length-1]['BUDGETITEM']=pBudgetItem;
	arrBudgets[arrBudgets.length-1]['BUDGET']=pBudget;
	arrBudgets[arrBudgets.length-1]['BUFFER']=pBuffer;
}
///////////////////////////////////////////////////////////////////////////////////
function StatementOfAssets(pYear,pOPA,pRA,pGIC,pRRB,pRC,pX)
{
	/*
	OPA : operating account balance
	RA  : reserve account balance (ACTUAL)
	GIC : gics total 
	
	these fields were moved to arrReserve
	RRB : recommended balance at EOY for Reserve Fund
	RC 	: Recommended contribution for current Year
	AC : Actual contribution / may differ from RC if there was a surplus
	X 	: Estimated, planned xpense for current Year
	*/
	// NB :  MINUS ONE means no value set (like for an account balance in the future, or an unset value from the past).
	arrAssets[arrAssets.length]=new Array('YEAR','OPA','RA','GIC');//,'RCB','RC','AC','X');
	arrAssets[arrAssets.length-1]['YEAR']=pYear;
	arrAssets[arrAssets.length-1]['OPA']=pOPA;;
	arrAssets[arrAssets.length-1]['RA']=pRA; 
	arrAssets[arrAssets.length-1]['GIC']=pGIC;
	/*
	arrAssets[arrAssets.length-1]['RRB']=pRRB;
	arrAssets[arrAssets.length-1]['RC']=pRC;
	arrAssets[arrAssets.length-1]['X']=pX;
	arrAssets[arrAssets.length-1]['AC']=-1;
	*/

}
//////////////////
function exportBudgets()
{
	var lc='';
	for (var i =0;i<arrBudgets.length;i++)
		lc+=' Budget('+ arrBudgets[i]['YEAR']+','+ arrBudgets[i]['BUDGETITEM'] + ','+arrBudgets[i]['BUDGET']+','+arrBudgets[i]['BUFFER']+')\r\n';
	

	var dd=new Date();
	lc+='updateListProperty("arrBudgets","'+dd+'");';
	console.clear();
	console.log(lc);
}
/////////////////////////
function exportAssets()
{
	var lc='';
	for (var i =0;i<arrAssets.length;i++)
		lc+=' StatementOfAssets('+ arrAssets[i]['YEAR']+','+ arrAssets[i]['OPA']+','+arrAssets[i]['RA']+','+arrAssets[i]['GIC']+')\r\n';
	

	var dd=new Date();
	lc+='updateListProperty("arrAssets","'+dd+'");';
	console.clear();
	console.log(lc);
}

function Reserve(pYear,ActualBalance,SOY,EOY,XP,Contrib,ExpectedInterests) 
////year	Actual Start Bal,Start Bal(recommended),Year End Bal (recommended),	Xpense,	contrb (recommended),interests
// eg Reserve(2023,61670,53909,17365,52474,15464,1066);
{
	arrReserve[arrReserve.length]=new Array('YEAR','ACTUAL_START_BALANCE','SOY_REQUIRED_BAL','EOY_REQUIRED_BAL','ProjectedEndingBalance','RECOM_CONTRIB','RequiredContribution','EXPENSES','DEFERRED_SURPLUS','Surplus','InterestVariation','ActualContribution','INTERESTS');
	arrReserve[arrReserve.length-1]['YEAR']=pYear;
	arrReserve[arrReserve.length-1]['ACTUAL_START_BALANCE']=ActualBalance;
	arrReserve[arrReserve.length-1]['SOY_REQUIRED_BAL']=SOY;
	arrReserve[arrReserve.length-1]['EOY_REQUIRED_BAL']=EOY;
	arrReserve[arrReserve.length-1]['EXPENSES']=XP;
	arrReserve[arrReserve.length-1]['RECOM_CONTRIB']=Contrib;
	arrReserve[arrReserve.length-1]['INTERESTS']=ExpectedInterests;
	arrReserve[arrReserve.length-1]['DEFERRED_SURPLUS']=0;
	arrReserve[arrReserve.length-1]['Surplus']=0;
	arrReserve[arrReserve.length-1]['ProjectedEndingBalance']=0;
	arrReserve[arrReserve.length-1]['InterestVariation']=0;
	arrReserve[arrReserve.length-1]['RequiredContribution']=0;
	arrReserve[arrReserve.length-1]['ActualContribution']=0;
}
//////////////////////////////////////////////////////////////////////
function AddReserve(pYear,Amt)
{
	for (var i =0;i<arrReserve.length;i++)
	{
		//console.log(arrAssets[i]['YEAR'] +'<>' +pYear);
		if (arrReserve[i]['YEAR']==pYear)
		{
		 arrReserve[i]['ActualContribution']=Amt;
		 break;
		}
	}
	
}
///////////////////////////////////////////////////////
function AddPlan(pNameForIt, pYear,pBudget,pPRESCRIBED_START_BAL,pPRESCRIBED_ENDING_BAL,pFundExpenses,pREQUIRED_INTEREST,pENDING_BALANCE,pCONTRIB_REQUIRED, pCONTRIB_RECOMMENDED,pREQUIRED_REVENUE)
{
	
	arrPlans[arrPlans.length]=new Array('P_NAME', 'YEAR','BUDGET','PRESCRIBED_START_BAL','PRESCRIBED_ENDING_BAL','FUND_EXPENSES','REQUIRED_INTEREST','ENDING_BALANCE','CONTRIB_REQUIRED', 'CONTRIB_RECOMMENDED','REQUIRED_REVENUE');
	arrPlans[arrPlans.length-1]['P_NAME']=pNameForIt;
	arrPlans[arrPlans.length-1]['YEAR']=pYear;
	arrPlans[arrPlans.length-1]['BUDGET']=pBudget;
	arrPlans[arrPlans.length-1]['PRESCRIBED_START_BAL']=pPRESCRIBED_START_BAL;
	arrPlans[arrPlans.length-1]['PRESCRIBED_ENDING_BAL']=pPRESCRIBED_ENDING_BAL;
	arrPlans[arrPlans.length-1]['FUND_EXPENSES']=pFundExpenses;
	arrPlans[arrPlans.length-1]['REQUIRED_INTEREST']=pREQUIRED_INTEREST;
	arrPlans[arrPlans.length-1]['ENDING_BALANCE']=pENDING_BALANCE;
	arrPlans[arrPlans.length-1]['CONTRIB_REQUIRED']=pCONTRIB_REQUIRED;
	arrPlans[arrPlans.length-1]['CONTRIB_RECOMMENDED']=pCONTRIB_RECOMMENDED;
	arrPlans[arrPlans.length-1]['REQUIRED_REVENUE']=pREQUIRED_REVENUE;
}
////////////////////////////////////
function addInterestRev(pYear,pProjected,pCurrentAcct,pReserve)
{
	arrRevs[arrRevs.length]=new Array('YEAR','PROJECTED','REALIZED_C','REALIZED_RF');
	arrRevs[arrRevs.length-1]['YEAR']=pYear;
	arrRevs[arrRevs.length-1]['PROJECTED']=pProjected;
	arrRevs[arrRevs.length-1]['REALIZED_C']=pCurrentAcct;
	arrRevs[arrRevs.length-1]['REALIZED_RF']=pReserve;
}
//////////////////////////////////////////////////////////