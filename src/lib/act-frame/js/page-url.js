window.urPageUrl = class {
    constructor(urlStr) {
        this.urlStr = urlStr;
    } // end constructor
    template() {
        let template = 'swim3';
        (() => { // TDDTEST83 FIX
            template = new URL(this.urlStr).searchParams.get("template");
        })(); // TOGGLE (); <-> ;
        return template;
    } // end template method
}; // end page url class
