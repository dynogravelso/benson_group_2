// TMZLive Past Menu Expand
$("#showr").click(function () {
    $(this).slideToggle("normal");
    $("div.tmz-live-past-eps").slideToggle("normal");
});
$("#hidr").click(function () {
    $("#showr").slideToggle("normal");
    $("div.tmz-live-past-eps").slideToggle("normal");
});


// TMZ Sports Past Menu Expand
$("#sports-showr").click(function () {
    $(this).slideToggle("normal");
    $("div.tmz-sports-past-eps").slideToggle("normal");
});
$("#sports-hidr").click(function () {
    $("#sports-showr").slideToggle("normal");
    $("div.tmz-sports-past-eps").slideToggle("normal");
});

