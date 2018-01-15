$(window).on('load', function() {
    initPage();
});

$(".right-scrolling-body").scroll(function() {
  $(".daterangepicker").hide();
  $('#sonar-calender').blur();
});

$(window).resize(function() {
  $(".daterangepicker").hide();
  $('#sonar-calender').blur();
});


var start = moment().subtract(29, 'days');
var end = moment();
var startDate = start.format('YYYY-MM-DD');
var endDate = end.format('YYYY-MM-DD');

$(function() {

    function cb(start, end) {
        $('#sonar-calender span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#sonar-calender').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            <!--'Today': [moment(), moment()],-->
            <!--'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],-->
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

    function cd(start, end) {
        $('#issue-calender span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#issue-calender').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            <!--'Today': [moment(), moment()],-->
            <!--'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],-->
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cd);

    cd(start, end);

});


$('#dailyBtnSonar').click(function(){
    getSonarTrendLineHistory("day");
});
$('#monthlyBtnSonar').click(function(){
    getSonarTrendLineHistory("Month");
});
$('#quarterlyBtnSonar').click(function(){
    getSonarTrendLineHistory("Quarter");
});
$('#yearlyBtnSonar').click(function(){
    getSonarTrendLineHistory("Year");
});

$('#resetView').click(function(){
    resetDashboardView();
});

$('#sonar-calender').on('apply.daterangepicker', function(ev, picker) {

    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');
    setSonarDate(startDate, endDate);
    <!--setSonarCalender();-->
    getSonarTrendLineHistory("day");
});