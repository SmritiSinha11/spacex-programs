$(document).ready(function() {
    var year;
    var launchSuccess;
    var landSuccess;

    $("#spinner").show();
    $.get("https://api.spaceXdata.com/v3/launches?limit=100", function(data, status){
        $("#spinner").hide();
        generateLaunchBlocks(data);
    });

    $(".btn-year-filter").click(function() {
        $(".btn-year-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        year = $(this).text();
        filterLaunches(year, launchSuccess, landSuccess);
    });
    
    $(".btn-launch-success-filter").click(function() {
        $(".btn-launch-success-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        launchSuccess = $(this).text();
        filterLaunches(year, launchSuccess, landSuccess);
    });

    $(".btn-land-success-filter").click(function() {
        $(".btn-land-success-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        landSuccess = $(this).text();
        filterLaunches(year, launchSuccess, landSuccess);
    });

    $("#btn-clear-all").click(function() {
        $("button").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        year = launchSuccess = landSuccess = undefined;
        filterLaunches(year, launchSuccess, landSuccess);
    })
});

function filterLaunches(year, launchSuccess, landSuccess) {
    let url = 'https://api.spaceXdata.com/v3/launches?limit=100';
    if (launchSuccess) url += '&launch_success='+ launchSuccess;
    if (landSuccess) url += '&landSuccess='+ landSuccess;
    if (year) url += '&launch_year=' + year;
    $("#spinner").show();
    $.get(url, function(data, status) {
        $("#spinner").hide();
        generateLaunchBlocks(data);
    });
}

function generateLaunchBlocks(data) {
    let singleLaunchBlock = '<div>';
    if (data.length) {
        $.each(data, function(index, launch) {
            singleLaunchBlock += '<div class="spacex-launch-block">';
            singleLaunchBlock += '<div>'+ launch.mission_name +' #'+ launch.flight_number +'</div>';
            singleLaunchBlock += '<img src="'+ launch.links.mission_patch_small +'" alt="'+ launch.mission_name +'" />';
            if(launch.mission_id.length) {
                singleLaunchBlock += '<div>';
                singleLaunchBlock += '<span>Mission Ids:</span>';
                singleLaunchBlock += '<ul>';
                launch.mission_id.forEach(mission => {
                    singleLaunchBlock += '<li>'+ mission +'</li>';
                });
                singleLaunchBlock += '</ul>';
                singleLaunchBlock += '</div>';
            }
            singleLaunchBlock += '<div><span>Launch Year: </span><span>'+ launch.launch_year +'</span></div>';
            singleLaunchBlock += '<div><span>Successful Launch: </span><span>'+ launch.launch_success +'</span></div>';
            // singleLaunchBlock += '<div><span>Successful Landing: </span><span>'+ launch.launch_landing +'</span></div>';     // As response object is not having key 'launch_landing'.
            singleLaunchBlock += '</div>';
        });
    } else {
        singleLaunchBlock += '<p>No data to display</p>';
    }
    singleLaunchBlock += '</div>';
    $("#launches-container").html(singleLaunchBlock);
}