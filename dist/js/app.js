$(document).ready(function() {
    var year;
    var launchSuccess;
    var landSuccess;
    updateUrl(year, landSuccess, launchSuccess);
    filterLaunches(year, launchSuccess, landSuccess);

    $(".btn-year-filter").click(function() {
        $(".btn-year-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        year = $(this).text();
        updateUrl(year, landSuccess, launchSuccess);
        filterLaunches(year, launchSuccess, landSuccess);
    });
    
    $(".btn-launch-success-filter").click(function() {
        $(".btn-launch-success-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        launchSuccess = $(this).text();
        updateUrl(year, landSuccess, launchSuccess);
        filterLaunches(year, launchSuccess, landSuccess);
    });

    $(".btn-land-success-filter").click(function() {
        $(".btn-land-success-filter").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        $(this).addClass('active');
        landSuccess = $(this).text();
        updateUrl(year, landSuccess, launchSuccess);
        filterLaunches(year, launchSuccess, landSuccess);
    });

    $("#btn-clear-all").click(function() {
        $("button").each(function(i, elm) {
            $(elm).removeClass('active');
        });
        year = launchSuccess = landSuccess = undefined;
        updateUrl(year, landSuccess, launchSuccess);
        filterLaunches(year, launchSuccess, landSuccess);
    });
});

function filterLaunches(year, launchSuccess, landSuccess) {
    let url = 'https://api.spaceXdata.com/v3/launches?limit=100';
    if (launchSuccess) url += '&launch_success='+ launchSuccess;
    if (landSuccess) url += '&land_success='+ landSuccess;
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
            singleLaunchBlock += '<div class="spacex-launch-wrapper">';
            singleLaunchBlock += '<div class="img-wrapper"><img src="'+ launch.links.mission_patch_small +'" alt="'+ launch.mission_name +'" /></div>';
            singleLaunchBlock += '<p class="mission-name">'+ launch.mission_name +' #'+ launch.flight_number +'</p>';
            if(launch.mission_id.length) {
                singleLaunchBlock += '<div class="desc-div">';
                singleLaunchBlock += '<label>Mission Ids:</label>';
                singleLaunchBlock += '<ul>';
                launch.mission_id.forEach(mission => {
                    singleLaunchBlock += '<li>'+ mission +'</li>';
                });
                singleLaunchBlock += '</ul>';
                singleLaunchBlock += '</div>';
            }
            singleLaunchBlock += '<div class="desc-div"><label>Launch Year: </label><span>'+ launch.launch_year +'</span></div>';
            singleLaunchBlock += '<div class="desc-div"><label>Successful Launch: </label><span>'+ launch.launch_success +'</span></div>';
            // singleLaunchBlock += '<div class="desc-div"><label>Successful Landing: </label><span>'+ launch.launch_landing +'</span></div>';     // As response object is not having key 'launch_landing'.
            singleLaunchBlock += '</div>';
            singleLaunchBlock += '</div>';
        });
    } else {
        singleLaunchBlock += '<p>No data to display</p>';
    }
    singleLaunchBlock += '</div>';
    $("#launches-container").html(singleLaunchBlock);
}

function updateUrl(year, landSuccess, launchSuccess) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?limit=100';
    if (launchSuccess) newurl += '&launch_success='+ launchSuccess;
    if (landSuccess) newurl += '&land_success='+ landSuccess;
    if (year) newurl += '&launch_year=' + year;
    window.history.pushState({path:newurl},'',newurl);
}