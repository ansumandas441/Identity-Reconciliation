import { ContactType } from "../models/contact";
import { LinkPrecedence } from '../models/contact';

const isExactMatch = (input : {email: string | null, phoneNumber: string | null} , contacts : Array<ContactType>)=>{
    return contacts.find((contact)=>{
        return contact.email===input.email && contact.phoneNumber===input.phoneNumber;
    });
}


const primaryMatch = (contacts : Array<ContactType>)=>{
    let primaryMatches = contacts.filter((match)=>{
        return match.linkPrecedence===LinkPrecedence.Primary;
    });
    return primaryMatches;
}

export {
    isExactMatch,
    primaryMatch
}