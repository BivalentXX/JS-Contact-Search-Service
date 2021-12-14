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
        this.contacts = []
        this.formattedContacts = []
        this.service = service
        this.fetchContacts()
        updates.on("add", id => this.contactAdd(id, service))
        updates.on("change", (id, key, value) => this.contactChanged(id, key, value))
        updates.on("remove", (id) => this.contactRemoved(id))
    }
    contactAdd(id, service) {
        service.getById(id).then((result) => {
        this.contacts.push(result)
        // console.log(result)
        });
    }    
    contactChanged(id, key, value) {
        this.contacts.map((contact) => {
            if (contact.id === id) {
                contact[key] = value
                return contact
            }    
        });
    }    
    contactRemoved(id) {
        this.contacts = this.contacts.filter((contact) => contact.id !== id)
    }

    async fetchContacts(url) {
        const response = await fetch(url)
        const objectResponse = await response.json()
        return this.contacts = objectResponse
    }

    normalizeString(string) {
        return string.match(/[A-Za-z0-9|@|.|(|)]+/g)
    }
    normalizeNumbers(string) { 
        return string.match(/[0-9]+/g)
    }
    
    normalizePhone(phone) {
        let number = this.normalizeNumbers(phone.replace(/(\+1)/g, "")).join('')
        return `(${number.slice(0,3)}) ${number.slice(3,6)}-${number.slice(6,10)}`;
    }
    formatPhoneNumbers(contact) {
        let phoneNumbers = []
        const n1 = contact.primaryPhoneNumber
        const n2 = contact.secondaryPhoneNumber
        if (n1) { phoneNumbers.push(this.normalizePhone(n1)) }
        if (n2) { phoneNumbers.push(this.normalizePhone(n2)) }
        return phoneNumbers
    }

    formatAddress(contact) {
        return `${contact.addressLine1} ${contact.addressLine2} ${contact.addressLine3} ${contact.city} ${contact.state} ${contact.zipCode}`
    }

    //This function could be a set of functions but this is more concise
    formatContacts(contact) {
        const object = {
                id: contact.id,
                name: 
                contact.nickName.length > 0 ?
                    `${contact.nickName} ${contact.lastName}`
                    : `${contact.firstName} ${contact.lastName}`,
                phones: this.formatPhoneNumbers(contact),
                email: contact.primaryEmail || contact.secondaryEmail || "",
                address: contact.addressLine1 ? this.formatAddress(contact) : ""
            } 
        return object
    }

    search(query) {
        // this.fetchContacts(url)
        const contacts = this.contacts
        const querySearch = this.normalizeString(query)
     
        let searchResult = [] 
        let cacheIds = []
        contacts.forEach(contact => {
            for (const [key, value] of Object.entries(contact)) {

                //push contacts, where either strings or nested arrays contain the query argument
                //I may have overcomplicated this when I could have just dealt in strings instead of arrays
                if (key != 'id'  && (
                        querySearch.indexOf(value) > -1 ||
                        querySearch.filter(x => value.includes(x)).length > 0 || 
                        this.normalizeNumbers(value)?.join('').includes(this.normalizeNumbers(query)?.join(''))
                        )
                    ) {
                    if (!searchResult.includes(contact)) { 
                        searchResult.push(contact)
                    }
                    
                    // cacheIds.push(contact.id)
                }
            }
        })
        searchResult = searchResult.map(result => this.formatContacts(result))

        return searchResult
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