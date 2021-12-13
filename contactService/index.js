// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary


// Outlining thoughts:
// 1. Define constructor with variables and CRUD, except Read
// 2. Define method for fetching contacts
// 3. Define methods for validation/type checking
// 4. Place defined methods into search function, defining Read


export default class {
    constructor(updates, service) {
        this.contacts = [];
        this.formattedContacts = [];
        this.service = service;
        updates.on("add", this.contactAdd.bind(this));
        updates.on("change", this.contactChanged.bind(this));
        updates.on("remove", this.contactRemoved.bind(this));
    }
    contactAdd(id) {
        this.service.getById(id).then((result) => {
        this.contacts.push(result);
        });
    }    
    contactChanged(id, key, value) {
        this.contacts.map((contact) => {
        if (contact[id] === id) {
            contact[key] = value;
        }
        return contact;
        });
    }    
    contactRemoved(id) {
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
    }

    async fetchContacts() {
        const response = await fetch(url)
        const objectResponse = await response.json()
        return this.contacts = objectResponse
    }

    normalizeString = string => {
        return string.match(/^[A-Za-z0-9|@|.]+$/)
    }
    normalizeNumbers = string => {
        return string.match(/^[0-9]+$/)
    }
    
    formatPhone = phone => {
        phone.replace(/^[+1]$/, "")
        let number = this.normalizeNumbers(phone)
        return `
            (${number.substring(0,3)}) 
            ${number.substring(4,7)}-
            ${number.substring(7,10)}
        `;
    }

    //This function could be a set of functions but this is more concise
    formatContacts(contacts) {
        this.fetchContacts()
        return this.formattedContacts = contacts.map(result => {
            contact = {
                id: result.id,
                name:
                result.nickName.length > 0
                    ? `${result.nickName} ${result.lastName}`
                    : `${result.firstName} ${result.lastName}`,
                phones: [this.formatPhone(result.primaryPhoneNumber),
                        this.formatPhone(result.secondaryPhoneNumber)],
                email: result.emailAddress || result.primaryEmail || "",
                address: result.address || "",
                role: result.role || ""
            };
        })
    }

    search(query) {
        this.fetchContacts(url)
        const contacts = this.contacts
        const query = normalizeString(query)
        let searchResult = [] 
        let cacheIds = []

        contacts.forEach(contact => {
            for (const [key, value] of Object.entries(contact)) {
                //push contacts, where either strings or nested arrays contain the query argument
                if (key != id  && (
                        value.toLowerCase().includes(query.toLowerCase()) ||
                        value.indexOf(query) > -1 
                        )
                    ) {
                    searchResult.push(contact)
                    cache.push(contact.id)
                }
            }
        })
        searchResults = this.formatContacts(searchResult)
        return {searchResults, cacheIds}
    }

}

//Questions:
//1. Does this have to be an exact match or fuzzy matching?
//2. Should we implement a limit of query string length of 3 characters?
//3. Can a cookie be stored client side that references the user and can loading of their contacts begin as soon as they load the webpage?



//Code Graveyard:

//A manual method that is more functional for iterating over the entries
    // search(query) {
    //     let cache = []
    //     let contacts = this.contacts 
    //     let contactKeys = Object.keys(contacts)
    //     keys.forEach(contact => {
    //         for(i=0; i < contactKeys.length; i++) {
    //             if(contact.contactKeys.value) {}
    //         }
    //     })
    // }

//An alternative that would normalize each key:value pair
    // getFormattedResult = userContacts => {
    //     Object.keys(userContacts).forEach(key => {
    //         normalizeString(userContacts[key])
    // });