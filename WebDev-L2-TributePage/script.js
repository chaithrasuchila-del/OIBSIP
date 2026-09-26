// Display a small message when the page is loaded
document.addEventListener("DOMContentLoaded", function () {

    console.log("A. P. J. Abdul Kalam Tribute Page Loaded");

    // Add click effect to timeline items
    const timelineItems = document.querySelectorAll(".timeline li");

    timelineItems.forEach(function (item) {

        item.addEventListener("click", function () {

            // Remove active class from other items
            timelineItems.forEach(function (otherItem) {
                otherItem.classList.remove("active");
            });

            // Add active class to clicked item
            item.classList.add("active");
        });

    });

});
