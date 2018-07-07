function toggleElement(id) {
    var element = document.getElementById(id);
    if(element.style.display === 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function toggleClassName(id, className) {
    var element = document.getElementById(id);
    if (hasClass(element, className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}