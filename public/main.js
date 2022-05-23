const search_box = document.querySelector('#query');

if (search_box) {
    search_box.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log(event.key + " pressed!");
            const query = document.querySelector('#query').value;
            const queryString = '/search/?recipe=' + query;

            fetch(queryString)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(response => {
                $("#searchresults").empty();
                response.forEach(element => {
                    const a = $("<a>")
                        .text(element.title + " (" + element.ingredient + ")")
                        .attr("href", "/id/" + element.rid);
                    $("<li>").append(a).appendTo("#searchresults");
                });
            })
            .catch(console.error);
        }
    });
}

$(".checktree").on("change", "label input:checkbox", function() {
    var
        checkbox = $(this),
        nestedList = checkbox.parent().next().next(),
        selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");
 
    if(checkbox.is(":checked")) {
        return selectNestedListCheckbox.prop("checked", true);
    }
    selectNestedListCheckbox.prop("checked", false);
});

const image_input = document.querySelector("#image-input");
image_input.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});

const update = document.querySelector('#update-button');

if (update) {
    update.addEventListener('click', _ => {
        fetch('/recipes', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'muffin!',
                ingredient: 'best day of my life :))))'
            })
        })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(response => {
            window.location.reload(true);
        });
    });
};

const deleteButton = document.querySelector('#delete-button');

if (deleteButton) {
    deleteButton.addEventListener('click', _ => {
        fetch('/recipes', {
              method: 'delete',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
              title: 'muffin!'
              })
          })
          .then(res => {
              if (res.ok) return res.json();
          })
          .then(response => {
              if (response === 'No muffin to delete') {
                  message.textContent = 'No muffin to delete';
              } else {
                  window.location.reload(true);
              };
          });
    });
};