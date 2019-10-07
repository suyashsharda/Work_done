
/*1.build the architecture of the project by implementing modules
--------------------------------------------------
first module is to handle our budget data
budgetController variable is going to be an immediately-invoked function expression(IIFE) that will return an object.
--------------------------------------------------
IIFE- it is an anonymous function wrapped in parenthesis
------------------------------------------------
// when javascript hits the below line it gets executed and this anonymous function is declared and immediately called or invoked because of () operator
var budgetController = (function() {
   //here is the code of the function
   // this variable and function are private and are not visible from outside scope 
   var x=23;
    var add=function(a)
    {
        return x+a;
    }
    //it returns an object containing all of the functions that we want in public
    return {
        //this is the object that gets assigned to budget variable after this function returns.
        publicTest: function(b)
        {
            //here add function now can be used in outside scope
            return(add(b));
        }
    }
    //after this function returns x and a are accessible by publicTest because of closure ,i.e. any function has always access to the variables and parameters of its outer function even after it returns
})();
//() is the function invocation 

var UIController=(function()
{
    //some code
})();

//this module is to make communication between the upper two modules
var controller=(function(bidgetCtrl,UICtrl){

    var z=bidgetCtrl.publicTest(5);
    return {
        anotherPublic:function()
        {
            console.log(z);
        }
    }

})(budgetController,UIController);
*/

//--------------------------------------------------------------------------------------
// app controller is the place where we will tell other modules what to do, 
//so we write methods in ui controller and budget controller to get some data for us or to calculate something 
// and in here , in the conroller we call these methods
//---------------------------------------------------------------------------------------
//BUDGET CONTROLLER
//keeps track of all incomes and expenses
var budgetController = (function() {
    //function constructors to use many same objects(instantiating) 
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
    };
    Expense.prototype.getPercentage=function()
    {
        return this.percentage;
    }
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type]=sum;
    };

    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
        
    };

    return{
        addItem: function(type,des,val){
            
            var newItem,Id;
            //create new id
            if(data.allItems[type].length>0)
            {
            Id=data.allItems[type][data.allItems[type].length-1].id +1;
            }
            else
            Id=0;
            //create new item
            if(type==='exp')
            {
                newItem=new Expense(Id,des,val);
            }
            else if(type === 'inc')
            {
                newItem=new Income(Id,des,val);
            }

            //since type is either exp or inc same as array name
           //push the new item into datastructure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;

        },
        deleteItem:function(type,id){
            var ids,index;
            //find the index of id in exp or inc
            var ids=data.allItems[type].map(function(current)
            {
                return current.id;
            });
            index=ids.indexOf(id);

            if(index !==-1)
            {
                data.allItems[type].splice(index,1);   
            }
        },

        calculateBudget:function(){
            // calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget--income-expenses
            data.budget=data.totals.inc-data.totals.exp;

            //calculate percentage of income that we spent 
            if(data.totals.inc>0)
            {
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else
            data.percentage=-1  
        },

        calculatePercentages:function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
            
        },
        getPercentages: function(){
            var allPerc=data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
        },

        testing:function(){
            console.log(data);
        }
    }

 })();
 
 
 //UI CONTROLLER
 var UIController=(function()
 {
     var DOMStrings={
         inputType:'.add__type',
         inputDescription:'.add__description',
         inputValue:'.add__value',
         inputBtn:'.add__btn',
         incomeContainer:'.income__list',
         expensesContainer:'.expenses__list',
         budgetLabel:'.budget__value',
         incomeLabel:'.budget__income--value',
         expenseLabel:'.budget__expenses--value',
         percentageLabel:'.budget__expenses--percentage',
         container:'.container',
         expensesPercLabel:'.item__percentage',
         dateLabel:'.budget__title--month'
     };
     var formatNumber=function(num,type)
        {
            var numSplit,int,desc;
            /*
            + or - before no.s
            exactly 2 decimal points
            comma sepearting the thousands
            2310.4567->+ 2,310.46
            2000->+ 2,000.00
            */
           //abs removes sign of the num
           num=Math.abs(num);
           //method of number prototype,put exactly 2 decimal no.s
           num=num.toFixed(2);
           numSplit=num.split('.');
           int=numSplit[0];
            if(int.length>3)
            {
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }

           desc=numSplit[1];
           
           return (type==='exp'?'-':'+') +' '+ int +'.'+desc;
        };
        var nodeListForEach=function(list,callback)
            {
                for(var i=0;i<list.length;i++)
                {
                    callback(list[i],i);
                }   

            };
     return{
         getinput: function()
         {
             return{
                type: document.querySelector(DOMStrings.inputType).value,//will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                //value is in form of strings so it is converted to string
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
                };
        },
        addListItems: function(obj,type){
            // html string with placeholder text
            var newHtml,element,html;
            if(type ==='inc')
            {
            element=DOMStrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button</div></div</div>';
            }

            else if(type==='exp')
            {
            element=DOMStrings.expensesContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace place holder text with some actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem:function(selectorId){
            var element=document.getElementById(selectorId)
            element.parentNode.removeChild(element);
        },

        clearFeilds: function()
        {
            var fields
            //returns a list and convert to array
            fields=document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            //this will think return an array,slice method is stored in Array prototype 
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            fieldsArr[0].focus();
            });
        },

        displayBudget:function(obj)
        {
            var type;
            obj.budget>0?type='inc' : type='exp';
            document.querySelector(DOMStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage>0)
            {
                document.querySelector(DOMStrings.percentageLabel).textContent=obj.percentage+"%";

            }
            else{
                document.querySelector(DOMStrings.percentageLabel).textContent="------";
            }
        
        },
        displayPercentages:function(percentages){
            var fields=document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            
            nodeListForEach(fields,function(current,index)
            {
                if(percentages[index]>0)
                {
                current.textContent=percentages[index]+'%';
                }
                else{
                    current.textContent='------';
                }
            });
        },

        displayMonth:function()
        {
            //returns date of today
            var now=new Date();
            //var Christmas=new Date(2016,11,25);
            months=['January','February','March','April','May','June','July','August','September','October','November','December']
            month=months[now.getMonth()+1];
            year=now.getFullYear();//returns 2016
            document.querySelector(DOMStrings.dateLabel).textContent=month+' '+year;
        },

        changeType:function()
        {
            var fields=document.querySelectorAll(
                DOMStrings.inputType+','+
                DOMStrings.inputDescription+','+
                DOMStrings.inputValue
            )
           nodeListForEach(fields,function(cur)
           {
                cur.classList.toggle('red-focus');
           });
           document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings:function()
        {
            return DOMStrings;
        }
     }
 })();
 
 //GLOBAL APP CONTROLLER
 var controller=(function(budgetCtrl,UICtrl){

    var setupEventListeners=function()
    {
        var DOM= UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',cntrlAddItem);

    document.addEventListener('keypress',function(event) {
        if(event.keyCode===13 || event.which===13)
        {
            cntrlAddItem();
        }
    });
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);


};

    var updateBudget=function(){
    //1.calculate the budget

    budgetCtrl.calculateBudget(); 
    //2.return the budget

    var budget=budgetCtrl.getBudget();
    //3.display the budget on the ui
        UICtrl.displayBudget(budget);
};

    var updatePercentages=function(){
        //calculate the percentages
        budgetCtrl.calculatePercentages();

        //read them from budget controller
        var percentages=budgetCtrl.getPercentages();

        //update in user interface
        UICtrl.displayPercentages(percentages);
    }
   
    var cntrlAddItem=function(){
        var input,newItem
     //1. get the field input data
         input=UICtrl.getinput();

         if(input.description!== "" && !isNaN(input.value) && input.value>0)
         {

            //2. add the item to the budget controller
        
            newItem= budgetCtrl.addItem(input.type,input.description,input.value);

            //3. add the item to the ui

            UICtrl.addListItems(newItem,input.type);

            //4. clear the fields
            UICtrl.clearFeilds();
    
            //5. calculate and update budget
            updateBudget();

            //6. calculate and update percentages
            updatePercentages();
         }
    };

   var ctrlDeleteItem=function(event){
    var itemId,spiltId,type,Id;
    itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId)
    {
        spiltId=itemId.split('-');
        type=spiltId[0];
        Id=parseInt(spiltId[1]);
        //here Id is in form string

        //delete the item from the data structure
        budgetCtrl.deleteItem(type,Id);

        //delete the item from ui

        UICtrl.deleteListItem(itemId);


        //update the new budget
        updateBudget(); 

        // calculate and update percentages
        updatePercentages();
    }

   };
    return {
        init:function(){
            console.log('application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();

        }
    }
 })(budgetController,UIController);

 controller.init();