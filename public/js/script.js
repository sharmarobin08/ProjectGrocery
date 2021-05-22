function validate() {
    const form = document.querySelector("form");
    if (form.first.value == "" || form.last.value == "" || form.pass.value == "" || form.username.value == "") {
        alert("Please fill all the fields");
    }
}