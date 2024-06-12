import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { LinkPrecedence, ContactType} from '../models/contact';
import { isNewInfo, primaryMatch }  from '../utils/match';

const prisma = new PrismaClient();

interface ResultObj {
    primaryContatctId: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

interface Result {
    contact: ResultObj
}

const add = async (req: Request, res: Response) => {
    try {
    const {email, phoneNumber} = req.body;

    // If both are null return error
    if (email == null && phoneNumber == null) {
        return res.status(400).json({
        message: 'Both email and phoneNumber cannot be null or undefined'
        });
    }

    const primaryContacts: Array<Pick<ContactType, 'id'>> = await prisma.contact.findMany({
        where: {
        AND: [
            {
            OR: [
                { email: email },
                { phoneNumber: phoneNumber },
            ],
            },
            {
                linkPrecedence: LinkPrecedence.Primary,
            },
        ],
        },
        select: {
            id: true,
            linkedId: true,
        },
        distinct: ['id'],
        orderBy: {
        createdAt: 'desc',
        },
    });

    const secondaryContacts: Array<Pick<ContactType, 'linkedId'>> = await prisma.contact.findMany({
        where: {
        AND: [
            {
            OR: [
                { email: email },
                { phoneNumber: phoneNumber },
            ],
            },
            {
                linkPrecedence: LinkPrecedence.Secondary,
            },
        ],
        },
        select: {
            linkedId: true,
        },
        distinct: ['linkedId'],
        orderBy: {
        createdAt: 'desc',
        },
    });

    const primarySet = new Set(primaryContacts.map(contact => contact.id));
    const secondarySet = new Set(secondaryContacts.map(contact => contact.linkedId));

    // Merge the sets while ensuring uniqueness
    const mergedIdsSet = new Set([...primarySet, ...secondarySet]);
    
    let mergedIds = Array.from(mergedIdsSet);
    let ids = mergedIds.filter(id => id !== null && id !== undefined) as number[];

    let allContacts: Array<ContactType> = await prisma.contact.findMany({
        where: {
          OR: [
            {
              linkedId: { in: ids }
            },
            {
              id: { in: ids }
            }
          ]
        }
      });
    
    let contactPrint = allContacts.map((element)=>{
        return {phone:element.phoneNumber, email:element.email}
    });

    let primaryId = allContacts.find((element)=>{
        return element.linkPrecedence === LinkPrecedence.Primary;
    })?.id ?? 0;

    if(allContacts.length===0){
        let newContact : ContactType = await prisma.contact.create({
            data: {
              email: email,
              phoneNumber: phoneNumber,
              linkPrecedence: LinkPrecedence.Primary,
            }
        });

        if(!newContact){
            throw new Error('Action can not be done');
        }

        allContacts.push(newContact);
        primaryId = newContact.id;
    } else {
        if(isNewInfo({email, phoneNumber}, allContacts)) {
            let newContact : ContactType = await prisma.contact.create({
                data: {
                    email: email,
                    phoneNumber: phoneNumber,
                    linkedId: primaryId,
                    linkPrecedence: LinkPrecedence.Secondary,
                }
            });

            if(!newContact){
                throw new Error('Action can not be done');
            }
            allContacts.push(newContact);
        }
        let primaryMatches = primaryMatch(allContacts);
        if(primaryMatches.length>1){
            let editedElement = await prisma.contact.update({
                where: {
                    id: primaryMatches[1].id,
                },
                data: {
                    linkPrecedence: LinkPrecedence.Secondary
                },
            });
            allContacts = allContacts.map((contact)=>{
                if(contact.id===editedElement.id){
                    contact.linkPrecedence = LinkPrecedence.Secondary;
                }
                return contact;
            });
        } 
    }

    const initialResponseObj: ResultObj = {
        primaryContatctId: primaryId, // or any default value
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    };
    
    // Initializing the result body
    const initialResponse: Result = {
        contact: initialResponseObj
    };

    // storing unique values
    const uniqueEmails = new Set();
    const uniquePhoneNumbers = new Set();
    const uniqueSecondaryContactIds = new Set();
    
    let result = allContacts.reduce((acc,element)=>{
        if(element.email && !uniqueEmails.has(element.email)){
            acc.contact.emails.push(element.email);
            uniqueEmails.add(element.email)
        }
        if(element.phoneNumber && !uniquePhoneNumbers.has(element.phoneNumber)){
            acc.contact.phoneNumbers.push(element.phoneNumber);
            uniquePhoneNumbers.add(element.phoneNumber);
        }
        if(element.linkedId && element.linkPrecedence===LinkPrecedence.Secondary && !uniqueSecondaryContactIds.has(element.id)){
            acc.contact.secondaryContactIds.push(element.id);
            uniqueSecondaryContactIds.add(element.id);
        }
        return acc;
    }, initialResponse);
    
    res.status(200).json(result);
    } catch(error) {
        console.log('Error - ',error);
    }
}

const getAll = async (req: Request, res: Response)=>{
    try {
        const allData = await prisma.contact.findMany();
        res.status(200).json({Data: allData});
    } catch (error) {
        console.log('Error - ',error);
    }
}

const deleteDatabase = async (req: Request, res: Response)=>{
    try {
        const allData = await prisma.contact.deleteMany({});
        res.status(200).json({Success: "Successfully deleted"});
    } catch (error) {
        console.log('Error - ',error);
    }
}

export const controller = {
    add,
    getAll,
    deleteDatabase,
}