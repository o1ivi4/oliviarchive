// const e = require("express");

const search_box = document.querySelector('#query');
const search_btn = document.querySelector('#search_btn');

if (search_box && search_btn) {
    search_box.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    });
    search_btn.addEventListener('click', function(event) {
        event.preventDefault();
        search();
    });
}

function search() {
    // find text query
    const query = document.querySelector('#query').value;
    // find categories
    var checked_cats = [];
    var cats = document.querySelectorAll("input[type=checkbox]")
    cats.forEach((c) => {
        if ($(c).is(':checked')) {
            console.log(c.name);
            if (c.name === "topcat") {
                checked_cats.push(c.value);
            } else if (c.value != "on") {
                checked_cats.push(c.value);
            }
        }
        // if ((c.value != "on" && $(c).is(':checked')) || ($(c).name == "topcat" && $(c).is(':checked'))) {
        //     checked_cats.push(c.value);
        // }
    });

    console.log(checked_cats);

    var arrStr = encodeURIComponent(JSON.stringify(checked_cats));
    const queryString = '/search/?recipe=' + query + '&cats=' + arrStr;
    fetch(queryString)
    .then(res => {
        if (res.ok) return res.json();
    })
    .then(recipes => {
        $("#searchresults").empty();
        if (recipes.length == 0) {
            $('<div class="row text-center"><p>sorry, no recipes found.</p></div>').appendTo('#searchresults');
        } else {
            for(var j = 0; j < recipes.length; j+=3) {
                var html = '';
                if (recipes.length - j > 2) { 
                    // if there's at least 3 recipes to display, build a full row (3 cards)
                    html = `<div class="row">
                                <div class="col-sm-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <a href="/id/` + recipes[j].rid + '">' + recipes[j].title + `</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <a href="/id/` + recipes[j+1].rid + '">' + recipes[j+1].title + `</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <a href="/id/` + recipes[j+2].rid + '">' + recipes[j+2].title + `</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                } else {
                    // if there's only 1 or 2 recipes left, build a partial row (1 or 2 cards)
                    html = `<div class="row">
                                <div class="col-sm-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <a href="/id/` + recipes[j].rid + '">' + recipes[j].title + `</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>`;
                    if (recipes.length - j == 2) {
                        html += `<div class="col-sm-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <a href="/id/` + recipes[j+1].rid + '">' + recipes[j+1].title + `</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>`;
                    }
                    // close out the row
                    html += `</div>`;
                }
                // append the row's html to index display
                $(html).appendTo("#searchresults");
            }
        }
    }).catch(console.error);
}

// $(".checktree").on("change", "label input:checkbox", function() {
//     var
//         checkbox = $(this),
//         nestedList = checkbox.parent().next().next(),
//         selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");
 
//     if(checkbox.is(":checked")) {
//         return selectNestedListCheckbox.prop("checked", true);
//     }
//     selectNestedListCheckbox.prop("checked", false);
// });

// const image_input = document.querySelector("#image-input");
// image_input.addEventListener("change", function() {
//     const reader = new FileReader();
//     reader.addEventListener("load", () => {
//         const uploaded_image = reader.result;
//         document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
//     });
//     reader.readAsDataURL(this.files[0]);
// });

// const update = document.querySelector('#update-button');

// if (update) {
//     update.addEventListener('click', _ => {
//         fetch('/recipes', {
//             method: 'put',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 title: 'muffin!',
//                 ingredient: 'best day of my life :))))'
//             })
//         })
//         .then(res => {
//             if (res.ok) return res.json();
//         })
//         .then(response => {
//             window.location.reload(true);
//         });
//     });
// };

// const deleteButton = document.querySelector('#delete-button');

// if (deleteButton) {
//     deleteButton.addEventListener('click', _ => {
//         fetch('/recipes', {
//               method: 'delete',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//               title: 'muffin!'
//               })
//           })
//           .then(res => {
//               if (res.ok) return res.json();
//           })
//           .then(response => {
//               if (response === 'No muffin to delete') {
//                   message.textContent = 'No muffin to delete';
//               } else {
//                   window.location.reload(true);
//               };
//           });
//     });
// };