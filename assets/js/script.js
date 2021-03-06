 window.alert = function() {};
 var defaultCSS = document.getElementById('bootstrap-css');

 function changeCSS(css) {
     if (css) $('head > link').filter(':first').replaceWith('<link rel="stylesheet" href="' + css + '" type="text/css" />');
     else $('head > link').filter(':first').replaceWith(defaultCSS);
 }
 $(document).ready(function() {
     var iframe_height = parseInt($('html').height());
     window.parent.postMessage(iframe_height, 'http://bootsnipp.com');
     loadTemplates(queries);
     loadCategory(queries);
 });
 var queries = {};
 $.each(document.location.search.substr(1).split('&'), function(c, q) {
     if (q != "") {
         var i = q.split('=');
         queries[i[0].toString()] = i[1].toString();
     }
 });

/* function percentChange(x, y) {
    var change = (((y - x) / x) * 100);
    if(change >= 0)
        var clas = "likes-up";
    else
        var clas = "likes-down";
     return {
         "change": change,
         "class": clas
     };
 }*/
 var jsonReply={};
 function percentChange(x, y) {
    x=parseInt(x);
    y=parseInt(y);
    var checked = $('#figure').is(':checked');
    console.log('checked => '+checked); 
    if(checked == true)
        var change = (y - x);
    else
        var change = (((y - x) / x) * 100);
     return {
         "change": change,
         "class": (y > x) ? "likes-up" : "likes-down"
     };
 }
 function loadTemplates(params) {
     $('#loader').html("<img src='assets/ajax-loader2.gif' />").show();
     //console.log("working");
     $.ajax({
         type: "GET",
         data: params,
         timeout: 5000,
         url: 'api',
     }).done(function(reply){jsonReply=reply;createTable();}).fail(function(reply) {
         console.log("fail");
     });
 }

 function loadCategory(params) {
     // $('#loader').html("<img src='assets/ajax-loader2.gif' />").show();
     // $('#no-more-tables , .pagination-container').hide();

     $.ajax({
         type: "GET",
         data: params,
         timeout: 5000,
         url: 'api/category.php',
     }).done(function(category) {
         console.log(loadCategory);
         //$('#loader').html("").hide();
         var data_category = '';
         console.log('queries.category => ' + queries.category);
         data_category += '<option value="">--Select category--</option>';
         if (queries.category == 'All')
             data_category += '<option selected>All</option>';
         else
             data_category += '<option>All</option>';
         for (cat in category) {
             if (decodeURIComponent(queries.category).replace("+", " ") == category[cat])
                 data_category += '<option selected>';
             else
                 data_category += '<option>';
             data_category += category[cat] + '</option>';
         }
         $('#category_form select.category-filter').html(data_category);

     }).fail(function(reply) {
         console.log("fail");
     });
 }
   // var reply= jsonReply;
/*console.log('jsonReply => ',jsonReply);
debugger;*/
 var createTable=function() {
    var reply= jsonReply;
    var checked = $('#figure').is(':checked');
    if(checked == true)
        var symbol = '';
    else
        var symbol = '%';
         //console.log(reply);

         //window.location=reply;
         var table = '';
         //console.log(reply);

         var date_array = [];
         date_array.push({
             "date": '2015-03-11',
             "value": "11 Mar '15"
         });
         date_array.push({
             "date": '2015-03-16',
             "value": "16 Mar '15"
         });
         date_array.push({
             "date": '2015-03-18',
             "value": "18 Mar '15"
         });
         date_array.push({
             "date": '2015-03-21',
             "value": "21 Mar '15"
         });
         date_array.push({
             "date": '2015-03-28',
             "value": "28 Mar '15"
         });
         date_array.push({
             "date": '2015-04-03',
             "value": "3 Apr '15"
         });
         table += '<thead class="cf"><tr><th class="menu-right sorting-asc" data-sort="string-ins">PAGES</th>';
         for (index in date_array) {
             table += '<th class="numeric" data-sort="float">' + date_array[index].value + '</th>';
         }
         table += '</tr></thead><tbody>';

                  for (val in reply) {

                      table += '<tr>';
                      table += '<td data-title="Page Name">' + val + '</td>';
                      var count = 0;
                      for (d in date_array) {
                          var numberOfLikes = reply[val][date_array[d].date];

                          if (numberOfLikes == undefined)
                          {
                              numberOfLikes = "-N/A-";
                              table += '<td data-sort-value="0.0" data-title="' + date_array[d].value + '">' + numberOfLikes + '</td>';
                          }
                          else
                          { 
                             if(d!=0)
                             {
                                 if(reply[val][date_array[d-1].date] == undefined)
                                 {
                                     table += '<td data-sort-value="0.0" data-title="' + date_array[d].value + '">' + numberOfLikes + '</td>';
                                 }
                                 else
                                 {
                                     if(count == 0)
                                     {

                                         var previous = reply[val][date_array[d-1].date];
         /*                                console.log('val => '+val);
                                         console.log('previous => '+previous);*/
                                         count++;
                                     }
                                    
                                     var percent = percentChange(previous, numberOfLikes, 'figure');
                                     table += '<td data-title="' + date_array[d].value + '" data-sort-value=' + percent.change.toFixed(3) + '>' + numberOfLikes + '<span class="' + percent.class + '">' + Math.abs(percent.change.toFixed(3))+' '+ symbol+' </td>';  
                                 }
                             }
                             else
                                 table += '<td data-title="' + date_array[d].value + '"data-sort-value="'+numberOfLikes+'" >' + numberOfLikes + '</td>';
                          }
                        
                      }
                      table += '</tr>';


                  }

         table += '</tbody>';
         //console.log('table => '+table);
         $('.fblikes-table').html(table);
                 $('#loader').html("").hide();
         $('#no-more-tables , .pagination-container').show();
         $("table").stupidtable();
}