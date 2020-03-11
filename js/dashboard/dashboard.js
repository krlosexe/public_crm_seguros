// DashBoard JavaScripts

(function ($) {
	'use strict';

	var primary = '#7774e7',
		success = '#37c936',
		info = '#0f9aee',
		warning = '#ffcc00',
		danger = '#ff3c7e',
		primaryInverse = 'rgba(119, 116, 231, 0.1)',
		successInverse = 'rgba(55, 201, 54, 0.1)',
		infoInverse = 'rgba(15, 154, 238, 0.1)',
		warningInverse = 'rgba(255, 204, 0, 0.1)',
		dangerInverse = 'rgba(255, 60, 126, 0.1)',
		gray = '#f6f7fb',
		white = '#fff',
		dark = '#515365'


    var sparklineBarData = [32, 38, 36, 35, 38, 37, 35, 34, 36, 38, 36, 37, 35, 34, 37, 38, 38];
    $("#bar-config").sparkline(sparklineBarData,  
    {
        type: 'bar',
        height: '60',
        barWidth: 3,
        barSpacing: 8,
        barColor: info
    });


    var lineChart = document.getElementById("line-chart");
    var lineCtx = lineChart.getContext('2d');
    lineChart.height = 80;
    var datapack1 = [65, 59, 80, 81, 56, 55, 40];
    var datapack2 = [28, 48, 40, 19, 90, 27, 75];
    var lineConfig = new Chart(lineCtx, {
        type: 'line',
        data: {
        labels: ["16th", "17th", "18th", "19th", "20th", "21th", "22th"],
        datasets: [{
            label: 'Series A',
            backgroundColor: infoInverse,
            borderColor: info,
            pointBackgroundColor: info,
            borderWidth: 2,
            data: datapack1
        },
        {
            label: 'Series B',
            backgroundColor: successInverse,
            borderColor: success,
            pointBackgroundColor: success,
            borderWidth: 2,
            data: datapack2
            }]
        },
        
        options: {
            legend: {
                display: false
            },
            scales: {
              
              yAxes: [{

                  stacked: true,
                   ticks: {
                      min: 0,
                      stepSize: 30,
                  }

              }]
          }
        }
    });

})(jQuery);