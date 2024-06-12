import { ContactType } from "../models/contact";
import { LinkPrecedence } from '../models/contact';

const isNewInfo = (input : {email: string | null, phoneNumber: string | null} , contacts : Array<ContactType>)=>{
    console.log('contacts -> ',contacts);
    const contactEmails = contacts.map(contact=>contact.email).filter(email=>email!=null) as string[]
    const contactPhoneNumber = contacts.map(contact=>contact.phoneNumber).filter(phoneNumber=>phoneNumber!=null) as string[]
    return contacts.find((contact) => {
        if (input.email && input.phoneNumber && input.email===contact.email) {
            return !contactPhoneNumber.includes(input.phoneNumber);
        } else if (input.email && input.phoneNumber && input.phoneNumber === contact.phoneNumber) {
            return !contactEmails.includes(input.email);
        }
        return false;
    });
}


const primaryMatch = (contacts : Array<ContactType>)=>{
    let primaryMatches = contacts.filter((match)=>{
        return match.linkPrecedence===LinkPrecedence.Primary;
    });
    return primaryMatches;
}

export {
    isNewInfo,
    primaryMatch
}