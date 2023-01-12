const LINK_REGEX = /^[a-z0-9]+$/;

function payoutFrequency() {
    if ($("#payout-frequency").val() === "payout") {
        $("#pf-select").addClass("col-7").removeClass("col-12");
        $("#pf-input").show();
    } else {
        $("#pf-select").addClass("col-12").removeClass("col-7");
        $("#pf-input").hide();
    }
}

function updateLinkPreview() {
    let matches = LINK_REGEX.test($("#link").val());
    
    if ($("#link").val().length >= 3) {
        if (matches) {
            $("#invalid-chars").hide();
            $.get("/shop/check?link=" + encodeURIComponent()).then(result => {
                if (result.ok && result.available) {
                    $("#link-exists").hide();
                    $("#link-preview span").text($("#link").val());
                    $("#link-preview").show();
                } else {
                    $("#link-preview").hide();
                    $("#link-exists").show();
                }
            })
        } else {
            $("#link-exists").hide();
            $("#link-preview").hide();
            $("#invalid-chars").show();
        }
    } else {
        $("#link-exists").hide();
        $("#link-preview").hide();
        $("#invalid-chars").hide();
    }
}

$(function() {
    $("#payout-frequency").on("change", payoutFrequency);
    payoutFrequency();

    $("#link").on("keyup", updateLinkPreview);
    updateLinkPreview();
});