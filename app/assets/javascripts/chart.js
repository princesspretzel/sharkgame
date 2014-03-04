$.ajax({
    type: "GET",
    url: "/score",
    dataType: "json",
    success: function(data) {

      new Morris.Bar({
        // ID of the element in which to draw the chart.
        element: 'plot-area',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: data,
        // Contains colors for the bars
        barColors: ['#800000'],
        // The name of the data record attribute that contains x-values.
        xkey: 'winner_num',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['high_score'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['High Score']
      });
    }
  })



